import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TextStyles.css";
import Drag from "../../../../../assets/editor-panel/drag-icon.svg";
import Close from "../../../../../assets/editor-panel/close.svg";
import Search from "../../../../../assets/editor-panel/search.svg";
const getScale = (title) => {
  switch (title) {
    case "Thank You":
      return 1.4;
    case "Title":
      return 1.5;
    case "Golden Hour":
      return 1.2;
    case "Coffee Break":
      return 1;
    case "Happy Birthday":
      return 1;
    default:
      return 1;

  }

};
function TextStyles({ open, onClose }) {
  const [search, setSearch] = useState("");
  const [styles, setStyles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  useEffect(() => {
    fetchTextStyles();

  }, []);
  const fetchTextStyles = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/text-styles");
      setStyles(response.data.data);

    } catch (error) {

      console.error("Error fetching styles:", error);

    }

  };
  const handleStyleDoubleClick = (item) => {
    setEditingId(item.id);
    setEditText(item.preview_text || item.title);
    setSelectedColor(item.text_color || "#000000");

  };
  const saveText = async (id) => {
    try {
      await axios.put(`http://localhost:5050/api/text-styles/${id}`, {
        preview_text: editText,
        text_color: selectedColor,

      });
      setEditingId(null);
      fetchTextStyles();

    } catch (error) {

      console.error("Error updating style:", error);

    }

  };
  const filteredStyles = styles.filter((item) =>

    item.title?.toLowerCase().includes(search.toLowerCase())

  );
  if (!open) return null;
  return (
    <div className="textstyles-dropdown-menu">

      {/* HEADER */}
      <div className="textstyles-header">
        <div className="textstyles-title-box">
          <img src={Drag} alt="" />
          <span>Text Styles</span>
        </div>
        <button className="textstyles-close-btn" onClick={onClose}>
          <img src={Close} alt="" />
        </button>
      </div>

      {/* SEARCH */}
      <div className="textstyles-search-section">
        <input
          type="search"
          placeholder="Search in text styles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}

        />
        <img src={Search} alt="" className="textstyles-search-icon" />
      </div>

      {/* COLOR PICKER */}

      {editingId && (
        <div className="textstyles-color-picker">
          <label>Font Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}

          />
        </div>

      )}

      {/* BODY */}
      <div className="textstyles-scroll-body">
        <div className="textstyles-section">
          <div className="textstyles-section-header">
            <h6 className="textstyles-section-label">All Text Styles</h6>
          </div>
          <div className="textstyles-grid">

            {filteredStyles.map((item) => (
              <div
                key={item.id}
                className="textstyles-card"
                onDoubleClick={() => handleStyleDoubleClick(item)}
              >
                <div className="textstyles-card-inner">
                  <span
                    className={`textstyles-card-text ${item.title === "Fire Away"

                      ? "fire-main"
                      : ""

                      }`}
                    style={{
                      fontFamily: item.font_family,
                      fontSize: `${(item.font_size || 28) * getScale(item.title)}px`,
                      fontWeight: item.font_weight,
                      color: item.text_color,
                      fontStyle: item.font_style || "normal",
                      textTransform:
                        item.text_transform || "none",
                      whiteSpace: "pre-line",
                      maxWidth: "100%",
                      textAlign: "center",
                      lineHeight: "0.95",
                      overflowWrap: "break-word",

                    }}
                  >

                    {item.preview_text}
                  </span>

                  {item.secondary_preview_text && (
                    <span
                      className={`textstyles-card-text secondary ${item.title === "Fire Away"

                        ? "fire-secondary"
                        : ""

                        }`}
                      style={{
                        fontFamily:
                          item.secondary_font_family,
                        fontSize: `${Math.min(
                          item.secondary_font_size || 18,
                          22

                        )}px`,
                        fontWeight:
                          item.secondary_font_weight,
                        color:
                          item.secondary_text_color,
                        fontStyle:
                          item.secondary_font_style ||

                          "normal",
                        textTransform:
                          item.secondary_text_transform ||

                          "none",

                      }}
                    >

                      {item.secondary_preview_text}
                    </span>

                  )}
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>

  );

}
export default TextStyles;
