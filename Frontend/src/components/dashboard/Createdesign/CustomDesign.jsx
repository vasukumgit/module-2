import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Createdesign.css";
import wordpress_lock from "../../../assets/Create-Design/wordpress_lock.svg";
import down_arrow from "../../../assets/Create-Design/down_arrow.svg";
import mobile_orientation from "../../../assets/Create-Design/mobile_orientation.svg";
import landscope_orientation from "../../../assets/Create-Design/landscope_orientation.svg";
import plus from "../../../assets/Create-Design/plus.svg";

export default function CustomDesign() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [projectName, setProjectName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [resolutionUnit, setResolutionUnit] = useState("Pixels/inch");

  const [unit, setUnit] = useState("Pixels (px)");
  const [resolution, setResolution] = useState("72 PPI");

  const [colorMode, setColorMode] = useState("RGB Color");
  const [background, setBackground] = useState("White");

  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderFocused, setFolderFocused] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [orientation, setOrientation] = useState("portrait"); // portrait | landscape
  const [lockRatio, setLockRatio] = useState(false);

  // ---------------- FETCH FOLDERS ----------------
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5050/api/designs/folders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFolders(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedFolderId(res.data.data[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- CREATE FOLDER ----------------
  const createFolder = async () => {
    if (!folderName.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5050/api/designs/folders",
        { name: folderName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        const newFolder = {
          id: res.data.folderId,
          name: folderName,
        };

        // update UI instantly
        setFolders((prev) => [...prev, newFolder]);
        setSelectedFolderId(newFolder.id);

        // reset input
        // setShowFolderInput(false);
        setFolderName("");
        setShowFolderModal(false);
      }
    } catch (err) {
      alert("Error creating folder");
    }
  };

  // ---------------- CREATE DESIGN ----------------
  const handleCreateDesign = async () => {
    if (!projectName || !width || !height) {
      alert("Fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5050/api/cloud-status",
        {
          title: projectName,
          name: projectName,
          width: Number(width),
          height: Number(height),
          folder_id: selectedFolderId,
          folder_name: null,
          type: "custom",
          unit,
          resolution,
          color_mode: colorMode,
          background,
          orientation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("design id", res.data);
      if (res.data.success) {
        navigate(`/editor/${res.data.data.design_id}`);
      }
    } catch (err) {
      alert("Error creating design");
    }
  };

  useEffect(() => {
    if (orientation === "landscape" && width && height) {
      setWidth(height);
      setHeight(width);
    }
  }, [orientation]);

  const handleWidthChange = (value) => {
    setWidth(value);
    if (lockRatio && height) {
      const ratio = height / width;
      setHeight(Math.round(value * ratio));
    }
  };

  return (
    <div className="tab-inner custom-page">
      {/* HEADER */}
      <div className="custom-header-container">
        <h2 className="custom-header-title">Custom size</h2>
      </div>

      {/* CONTENT */}
      <div className="custom-content-container">
        <div className="custom-content">
          {/* PROJECT DETAILS */}
          <div className="section">
            <p className="section-title">Project Details</p>

            <TextField
              fullWidth
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              InputProps={{ className: "section-input" }}
            />
          </div>

          {/* DIMENSIONS */}
          <div className="section">
            <p className="section-title">Dimensions</p>

            <div className="dimension-bar">
              {/* ORIENTATION TOGGLE */}
              <div className="orientation-toggle">
                <div
                  className={`toggle-circle ${orientation === "portrait" ? "active" : ""}`}
                  onClick={() => setOrientation("portrait")}
                >
                  <img src={mobile_orientation} alt="mobile_orientation" />
                </div>

                <div
                  className={`toggle-circle ${orientation === "landscape" ? "active" : ""}`}
                  onClick={() => setOrientation("landscape")}
                >
                  <img
                    src={landscope_orientation}
                    alt="landscope_orientation"
                  />
                </div>
              </div>

              {/* WIDTH + HEIGHT GROUP */}
              <div className="dimension-input-group">
                <TextField
                  placeholder="Width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="custom-textfield"
                  InputProps={{ classes: { root: "custom-input-root" } }}
                />

                <div
                  className={`lock-btn ${lockRatio ? "active" : ""}`}
                  onClick={() => setLockRatio(!lockRatio)}
                >
                  <img src={wordpress_lock} alt="wordpress_lock" />
                </div>

                <TextField
                  placeholder="Height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="custom-textfield"
                  InputProps={{ classes: { root: "custom-input-root" } }}
                />

                {/* UNITS */}
                <div className="dimension-select-wrapper">
                  {/* LEGEND LABEL */}
                  <span className="select-label">Units</span>

                  <div className="dimension-select">
                    <div className="select-content">
                      <span className="select-value">{unit}</span>

                      <span className="select-icon">
                        <img src={down_arrow} alt="down_arrow" />
                      </span>
                    </div>

                    {/* hidden native select */}
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="select-native"
                    >
                      <div className="units-dropdown">
                        <option className="dropdown-option">Pixels (px)</option>
                        <option className="dropdown-option">Inches (in)</option>
                        <option className="dropdown-option">
                          Millimeters (mm)
                        </option>
                        <option className="dropdown-option">
                          Centimeters (cm)
                        </option>
                        <option className="dropdown-option">Points (pt)</option>
                        <option className="dropdown-option">Picas (pc)</option>
                      </div>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESOLUTION */}
              <div className="resolution-wrapper">
                {/* FLOATING LABEL */}
                <span className="resolution-label">Resolution</span>

                <div className="resolution-field">
                  {/* LEFT INPUT (numbers only) */}
                  <input
                    type="number"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="resolution-input"
                  />

                  {/* RIGHT FIXED TEXT */}
                  <div className="resolution-suffix">
                    <select
                      value={resolutionUnit}
                      onChange={(e) => setResolutionUnit(e.target.value)}
                      className="resolution-select"
                    >
                      <option>Pixels/Inch (PPI)</option>
                      <option>Dots/Inch (DPI)</option>
                    </select>

                    <img src={down_arrow} alt="down_arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLOR + FOLDER ROW */}
          <div className="section">
            <div className="combined-row">
              {/* LEFT → COLOR SETTINGS */}
              <div className="color-block">
                <p className="section-title">Color Settings</p>

                <div className="color-settings-row">
                  {/* COLOR MODE */}
                  <div className="custom-select-wrapper">
                    <span className="select-label">Color Mode</span>

                    <div className="custom-select">
                      <span className="select-value">{colorMode}</span>
                      <img src={down_arrow} alt="" />
                    </div>

                    <select
                      value={colorMode}
                      onChange={(e) => setColorMode(e.target.value)}
                      className="select-native"
                    >
                      <option>RGB Color</option>
                      <option>CMYK Color</option>
                      <option>Grayscale</option>
                    </select>
                  </div>

                  {/* BACKGROUND */}
                  <div className="custom-select-wrapper">
                    <span className="select-label">Background</span>

                    <div className="custom-select">
                      <span className="select-value">{background}</span>
                      <img src={down_arrow} alt="" />
                    </div>

                    <select
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="select-native"
                    >
                      <option>White</option>
                      <option>Black</option>
                      <option>Transparent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RIGHT → FOLDER SETUP */}
              <div className="folder-block">
                <p className="section-title">Folder Setup</p>

                <div className="folder-row">
                  {/* ✅ ALWAYS SHOW DROPDOWN */}
                  {/* <div className="custom-select-wrapper flex-1">
            <span className="select-label">Select Folder</span>

            <div className="custom-select">
              <span className="select-value">
                {folders.find(f => f.id === selectedFolderId)?.name || "Select Folder"}
              </span>
              <img src={down_arrow} alt="" />
            </div>

            <select
              value={selectedFolderId || ""}
              onChange={(e) => setSelectedFolderId(Number(e.target.value))}
              className="select-native"
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div> */}

                  {/* ✅ CREATE BUTTON / INPUT */}
                  {!showFolderInput ? (
                    <button
                      className="create-folder-btn-modern"
                      onClick={() => setShowFolderInput(true)}
                    >
                      + Create
                    </button>
                  ) : (
                    <>
                      {/* ✅ ALWAYS SHOW DROPDOWN */}
                      <div className="custom-select-wrapper flex-1">
                        <span className="select-label">Select Folder</span>

                        <div className="custom-select">
                          <span className="select-value">
                            {folders.find((f) => f.id === selectedFolderId)
                              ?.name || "Select Folder"}
                          </span>
                          <img src={down_arrow} alt="" />
                        </div>

                        <select
                          value={selectedFolderId || ""}
                          onChange={(e) =>
                            setSelectedFolderId(Number(e.target.value))
                          }
                          className="select-native"
                        >
                          {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="create-folder-btn-modern"
                        onClick={() => {
                          setShowFolderInput(true);
                          setShowFolderModal(true);
                        }}
                      >
                        <img src={plus} alt="plus" />
                        Create
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="cta-container">
        <button className="create-btn" onClick={handleCreateDesign}>
          Create Design
        </button>
      </div>

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="folder-modal-overlay">
          <div className="folder-modal">
            {/* HEADER */}
            <div className="folder-modal-header">
              <h3>Create New Folder</h3>
            </div>

            {/* INPUT */}
            <div className="folder-modal-body">
              <div
                className={`folder-floating-wrapper ${
                  folderFocused || folderName ? "active" : ""
                }`}
              >
                <span className="folder-floating-label">Folder name</span>

                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onFocus={() => setFolderFocused(true)}
                  onBlur={() => setFolderFocused(false)}
                  className="folder-modal-input"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="folder-modal-footer">
              <button
                className="folder-cancel-btn"
                onClick={() => {
                  setShowFolderModal(false);
                  setFolderName("");
                }}
              >
                Cancel
              </button>

              <button className="folder-create-btn" onClick={createFolder}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMessage && <div className="custom-toast">{toastMessage}</div>}
    </div>
  );
}
