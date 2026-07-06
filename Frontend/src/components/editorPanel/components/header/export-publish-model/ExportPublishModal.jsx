import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./ExportPublishModal.css";

const API_URL =
  "http://localhost:5050/api/export";

const ExportModal = ({
  onClose,
  designId,
  designTitle = "Stackly Design",
  elements = [],
  template = {
    width: 500,
    height: 500,
    x: 4750,
    y: 4750,
  },
}) => {
  const [activeTab, setActiveTab] =
    useState("download");

  // DOWNLOAD STATES
  const [format, setFormat] =
    useState("png");

  const [quality, setQuality] =
    useState(80);

  const [scale, setScale] =
    useState("1x");

  // PUBLISH STATES
  const [title, setTitle] =
    useState(designTitle);

  const [description, setDescription] =
    useState("");

  const [allowReuse, setAllowReuse] =
    useState(true);

  // TAGS
  const [tags, setTags] = useState([
    "illustration",
    "Vector",
  ]);

  const [suggestions, setSuggestions] =
    useState([
      "Poster",
      "Social media",
      "Minimalist",
      "Modern",
    ]);

  // API STATES
  const [loading, setLoading] =
    useState(false);

  const [exportHistory, setExportHistory] =
    useState([]);

  const [publishHistory, setPublishHistory] =
    useState([]);

  // NEW STATES
  const [previewUrl, setPreviewUrl] =
    useState("");

  const [estimatedSize, setEstimatedSize] =
    useState("Calculating...");

  const token =
    localStorage.getItem("token");

  // =========================================
  // HELPERS
  // =========================================

  const getScaleNumber = () =>
    Number(String(scale).replace("x", "")) ||
    1;

  const formatBytes = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(
      2
    )} MB`;
  };

  const dataUrlToSize = (dataUrl) => {
    const base64 =
      dataUrl.split(",")[1] || "";

    return Math.round(
      (base64.length * 3) / 4
    );
  };

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();

      img.crossOrigin = "anonymous";

      img.onload = () => resolve(img);

      img.onerror = () => resolve(null);

      img.src = src;
    });

  // =========================================
  // RENDER DESIGN TO CANVAS
  // =========================================

  const renderDesignToCanvas =
    async () => {
      const scaleNumber =
        getScaleNumber();

      const canvas =
        document.createElement("canvas");

      canvas.width =
        Number(template.width || 500) *
        scaleNumber;

      canvas.height =
        Number(template.height || 500) *
        scaleNumber;

      const ctx =
        canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const offsetX = Number(
        template.x || 0
      );

      const offsetY = Number(
        template.y || 0
      );

      for (const el of elements || []) {
        const x =
          (Number(el.x || 0) - offsetX) *
          scaleNumber;

        const y =
          (Number(el.y || 0) - offsetY) *
          scaleNumber;

        const w =
          Number(el.width || 100) *
          scaleNumber;

        const h =
          Number(el.height || 100) *
          scaleNumber;

        ctx.save();

        if (el.rotation) {
          ctx.translate(
            x + w / 2,
            y + h / 2
          );

          ctx.rotate(
            (Number(el.rotation) *
              Math.PI) /
              180
          );

          ctx.translate(
            -(x + w / 2),
            -(y + h / 2)
          );
        }

        if (el.type === "text" || el.text) {
          ctx.fillStyle =
            el.fill ||
            el.color ||
            "#111827";

          ctx.font = `${
            Number(el.fontSize || 24) *
            scaleNumber
          }px ${
            el.fontFamily || "Arial"
          }`;

          ctx.fillText(
            el.text || "",
            x,
            y +
              Number(
                el.fontSize || 24
              ) *
                scaleNumber
          );
        } else if (el.src) {
          const img = await loadImage(
            el.src
          );

          if (img) {
            ctx.drawImage(
              img,
              x,
              y,
              w,
              h
            );
          } else {
            ctx.fillStyle = "#f3f4f6";

            ctx.fillRect(x, y, w, h);

            ctx.fillStyle = "#9ca3af";

            ctx.font = `${
              12 * scaleNumber
            }px Arial`;

            ctx.fillText(
              "Image blocked",
              x + 10,
              y + 22
            );
          }
        } else if (
          el.type === "circle"
        ) {
          ctx.fillStyle =
            el.fill || "#2563eb";

          ctx.beginPath();

          ctx.arc(
            x + w / 2,
            y + h / 2,
            Math.min(w, h) / 2,
            0,
            Math.PI * 2
          );

          ctx.fill();
        } else {
          ctx.fillStyle =
            el.fill ||
            el.backgroundColor ||
            "#2563eb";

          ctx.fillRect(x, y, w, h);
        }

        ctx.restore();
      }

      return canvas;
    };

  // =========================================
  // UPDATE PREVIEW
  // =========================================

  const updatePreviewAndSize =
    async () => {
      try {
        const canvas =
          await renderDesignToCanvas();

        const mimeType =
          format === "jpg"
            ? "image/jpeg"
            : "image/png";

        const dataUrl =
          canvas.toDataURL(
            mimeType,
            quality / 100
          );

        setPreviewUrl(dataUrl);

        setEstimatedSize(
          formatBytes(
            dataUrlToSize(dataUrl)
          )
        );
      } catch (err) {
        console.error(
          "Preview error:",
          err
        );

        setPreviewUrl("");

        setEstimatedSize(
          "Not available"
        );
      }
    };

  // =========================================
  // DOWNLOAD FILE
  // =========================================

  const downloadFile = async () => {
    const canvas =
      await renderDesignToCanvas();

    const fileName = `design-${designId}`;

    if (format === "pdf") {
      const imgData =
        canvas.toDataURL(
          "image/png",
          quality / 100
        );

      const pdf = new jsPDF({
        orientation:
          canvas.width >= canvas.height
            ? "landscape"
            : "portrait",

        unit: "px",

        format: [
          canvas.width,
          canvas.height,
        ],
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );

      pdf.save(`${fileName}.pdf`);

      return imgData;
    }

    const mimeType =
      format === "jpg"
        ? "image/jpeg"
        : "image/png";

    const dataUrl = canvas.toDataURL(
      mimeType,
      quality / 100
    );

    const link =
      document.createElement("a");

    link.href = dataUrl;

    link.download = `${fileName}.${
      format === "jpg"
        ? "jpg"
        : "png"
    }`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    return dataUrl;
  };

  // =========================================
  // FETCH EXPORT DATA
  // =========================================

  const fetchExportData = async () => {
    try {
      const response = await axios.get(
        API_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExportHistory(
        (response.data || []).filter(
          (item) =>
            item.export_type ===
            "download"
        )
      );
    } catch (error) {
      console.error(
        "Error fetching export data:",
        error
      );
    }
  };

  // =========================================
  // FETCH PUBLISH DATA
  // =========================================

  const fetchPublishData =
    async () => {
      try {
        const response =
          await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setPublishHistory(
          (response.data || []).filter(
            (item) =>
              item.export_type ===
              "publish"
          )
        );
      } catch (error) {
        console.error(
          "Error fetching publish data:",
          error
        );
      }
    };

  // =========================================
  // LOAD API DATA
  // =========================================

  useEffect(() => {
    fetchExportData();
    fetchPublishData();
  }, []);

  // =========================================
  // PREVIEW UPDATE
  // =========================================

  useEffect(() => {
    const t = setTimeout(
      updatePreviewAndSize,
      400
    );

    return () => clearTimeout(t);
  }, [
    format,
    quality,
    scale,
    elements,
    template,
  ]);

  // =========================================
  // TAG FUNCTIONS
  // =========================================

  const removeTag = (tag) => {
    setTags(
      tags.filter((t) => t !== tag)
    );

    if (!suggestions.includes(tag)) {
      setSuggestions([
        ...suggestions,
        tag,
      ]);
    }
  };

  const addTag = (tag) => {
    setTags([...tags, tag]);

    setSuggestions(
      suggestions.filter((s) => s !== tag)
    );
  };

  // =========================================
  // DOWNLOAD API
  // =========================================

  const handleDownload = async () => {
    try {
      setLoading(true);

      const dataUrl =
        await downloadFile();

      const fileSize =
        formatBytes(
          dataUrlToSize(dataUrl)
        );

      const payload = {
        design_id: designId,

        export_type: "download",

        format,

        quality,

        scale,

        title,

        description,

        tags,

        allow_reusing: allowReuse,

        file_size: fileSize,

        file_url: null,

        status: "downloaded",
      };

      console.log(
        "Sending Export Payload:",
        payload
      );

      await axios.post(
        API_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Download completed and stored in DB"
      );

      fetchExportData();
    } catch (error) {
      console.error(
        "Export API Error:",
        error
      );

      alert("Failed to export");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // PUBLISH API
  // =========================================

  const handlePublish = async () => {
    try {
      setLoading(true);

      const payload = {
        design_id: designId,

        export_type: "publish",

        format,

        quality,

        scale,

        title,

        description,

        tags,

        allow_reusing: allowReuse,

        file_size: estimatedSize,

        file_url:
          previewUrl || null,

        status: "published",
      };

      console.log(
        "Sending Publish Payload:",
        payload
      );

      await axios.post(
        API_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Design Published Successfully"
      );

      fetchPublishData();
    } catch (error) {
      console.error(
        "Publish API Error:",
        error
      );

      alert("Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-card"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* CLOSE BUTTON */}
        <button
          className="close-btn"
          onClick={onClose}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* HEADER */}
        <div className="modal-header">
          <h2>Export & Publish</h2>
        </div>

        {/* TABS */}
        <nav className="modal-tabs">
          <button
            className={
              activeTab === "download"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("download")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>

            Download
          </button>

          <button
            className={
              activeTab === "publish"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("publish")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>

            Publish
          </button>
        </nav>

        {/* CONTENT */}
        <div className="modal-scroll-content">
          {/* PREVIEW */}
          <div className="preview-header">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="design-thumb"
              />
            ) : (
              <div className="design-thumb preview-empty">
                No Preview
              </div>
            )}

            <div className="preview-info">
              <h3>
                {activeTab === "download"
                  ? "Download Your Design"
                  : "Publish to Community"}
              </h3>

              <p>
                {activeTab === "download"
                  ? "Choose a format and quality, then hit download. Your file will be ready instantly."
                  : "Make your design discoverable. Add a title, description, and tags so others can find and reuse it."}
              </p>

              <span className="bold-size">
                Size:{" "}
                <span className="light-text">
                  {estimatedSize}
                </span>
              </span>
            </div>
          </div>

          <div className="form-content">
            {activeTab ===
            "download" ? (
              <div className="download-view">
                {/* FORMAT */}
                <div className="label-flex">
                  <label className="section-label">
                    Format
                  </label>

                  <span className="est-size">
                    Estimated size:{" "}
                    {estimatedSize}
                  </span>
                </div>

                <div className="format-grid">
                  {[
                    {
                      id: "png",
                      title: "PNG",
                      desc: "Best for web and sharing",
                    },
                    {
                      id: "jpg",
                      title: "JPG",
                      desc: "Smaller file size",
                    },
                    {
                      id: "svg",
                      title: "SVG",
                      desc: "Scalable vector",
                    },
                    {
                      id: "pdf",
                      title: "PDF",
                      desc: "Print ready vector",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={`format-card ${
                        format === item.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setFormat(item.id)
                      }
                    >
                      <div className="radio-ui">
                        {format ===
                          item.id && (
                          <div className="radio-inner" />
                        )}
                      </div>

                      <div className="card-text">
                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* QUALITY */}
                <div className="control-group">
                  <div className="label-flex">
                    <label className="section-label">
                      Quality
                    </label>

                    <span className="value-label">
                      {quality}%
                    </span>
                  </div>

                  <input
                    type="range"
                    className="blue-range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) =>
                      setQuality(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                {/* SCALE */}
                <div className="control-group">
                  <label className="section-label">
                    Scale
                  </label>

                  <div className="scale-row">
                    {[
                      "0.5x",
                      "1x",
                      "2x",
                      "3x",
                      "4x",
                    ].map((s) => (
                      <button
                        key={s}
                        className={
                          scale === s
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setScale(s)
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EXPORT HISTORY */}
                {exportHistory?.length >
                  0 && (
                  <div className="history-section">
                    <h4>
                      Export History
                    </h4>

                    {exportHistory.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={index}
                          className="history-item"
                        >
                          {item.format} -{" "}
                          {item.scale} -{" "}
                          {item.file_size ||
                            "N/A"}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="publish-view">
                {/* TITLE */}
                <div className="field-group">
                  <label className="section-label">
                    Title
                  </label>

                  <input
                    type="text"
                    placeholder="Give your design a name..."
                    className="standard-input"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="field-group">
                  <label className="section-label">
                    Description
                    (optional)
                  </label>

                  <textarea
                    placeholder="Tell others what makes this design unique..."
                    rows="4"
                    className="standard-input"
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* TAGS */}
                <div className="field-group">
                  <label className="section-label">
                    Tags
                  </label>

                  <div className="tag-box">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill"
                      >
                        {tag}

                        <button
                          onClick={() =>
                            removeTag(tag)
                          }
                        >
                          &times;
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      className="tag-input-ghost"
                    />
                  </div>

                  <div className="suggestions-flex">
                    {suggestions.map(
                      (s) => (
                        <span
                          key={s}
                          className="suggest-item"
                          onClick={() =>
                            addTag(s)
                          }
                        >
                          {s}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* REUSING */}
                <div className="reusing-section">
                  <div className="reusing-text">
                    <strong>
                      Allow Reusing
                    </strong>

                    <p>
                      Let others use your
                      design as a template
                    </p>
                  </div>

                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={allowReuse}
                      onChange={() =>
                        setAllowReuse(
                          !allowReuse
                        )
                      }
                    />

                    <span className="toggle-slider" />
                  </label>
                </div>

                {/* PUBLISH HISTORY */}
                {publishHistory?.length >
                  0 && (
                  <div className="history-section">
                    <h4>
                      Published Designs
                    </h4>

                    {publishHistory.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={index}
                          className="history-item"
                        >
                          {item.title ||
                            "Untitled"}{" "}
                          -{" "}
                          {item.file_size ||
                            "N/A"}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="modal-footer">
          <p className="community-terms">
            By publishing, you agree to
            our{" "}
            <u className="community-terms-sub">
              Community Guidelines
            </u>
            .
          </p>

          <button
            className="submit-btn"
            onClick={
              activeTab === "download"
                ? handleDownload
                : handlePublish
            }
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : activeTab ===
              "download" ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>

                Download
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>

                Publish
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExportModal;