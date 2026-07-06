import React, { useState, useRef, useEffect } from "react";

import editable from "../../../../../../../assets/editor-panel/assets-panel/editable.png";
import detail from "../../../../../../../assets/editor-panel/assets-panel/details.png";
import move from "../../../../../../../assets/editor-panel/assets-panel/move.png";
import download from "../../../../../../../assets/editor-panel/assets-panel/download.png";
import box from "../../../../../../../assets/editor-panel/assets-panel/box.png";
import dell from "../../../../../../../assets/editor-panel/assets-panel/dell.png";
import threedots from "../../../../../../../assets/editor-panel/assets-panel/threedots.png";
import whitetick from "../../../../../../../assets/editor-panel/assets-panel/whitetick.png";

function FileCard({
  file,
  isSelected,
  toggleSelection,
  onRename,
  onDelete,
  onMove,
  onDownload,
  onDetails,
  selectionMode,
  setSelectionMode,
}) {
  const [activeMenu, setActiveMenu] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef(null);

  const menuRef = useRef(null);
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`image-card ${isSelected ? "active-selected" : ""}`}
      onClick={() => {
        if (selectionMode) {
          toggleSelection(file.id);
        }
      }}
    >
      <img src={file.image} alt={file.name} />

      {isSelected && (
        <div className="selected-tick">
          <img src={whitetick} alt="" className="tick-icon" />
        </div>
      )}

      {!selectionMode && (
        <button
          className="three-dots"
          onClick={(e) => {
            e.stopPropagation();

            const rect = e.currentTarget.getBoundingClientRect();

            setMenuData({
              file,
              top: rect.bottom,
              left: rect.right,
            });

            setActiveMenu(true);
          }}
        >
          <img src={threedots} alt="" />
        </button>
      )}

      {activeMenu && menuData && (
        <div
          className="asset-menu"
          style={{
            position: "fixed",
            top: menuData.top,
            left: menuData.left - 190,
            zIndex: 9999,
          }}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-top">
            <div className="title-edit">
              {isEditing ? (
                <div className="file-edit-wrap">
                  <input
                    ref={inputRef}
                    value={file.name}
                    onChange={(e) => onRename(file.id, e.target.value)}
                    className="edit-input"
                  />

                  <span className="fixed-extension">.jpg</span>
                </div>
              ) : (
                <h4>
                  {file.name}
                  <span className="fixed-extension">.jpg</span>
                </h4>
              )}

              <img
                src={editable}
                alt=""
                className="edit-icon"
                onDoubleClick={() => setIsEditing(true)}
              />
            </div>

            <p>By Vamika</p>
          </div>

          <div className="popup-menu-items">
            <div className="asset-menu-item" onClick={() => onDetails(file.id)}>
              <img src={detail} alt="" />
              <span>Details</span>
            </div>

            <div className="asset-menu-item" onClick={() => onMove(file)}>
              <img src={move} alt="" />
              <span>Move</span>
            </div>

            <div className="asset-menu-item" onClick={() => onDownload(file)}>
              <img src={download} alt="" />
              <span>Download</span>
            </div>

            <div
              className="asset-menu-item"
              onClick={() => {
                setSelectionMode(true);
                toggleSelection(file.id);
                setActiveMenu(false);
              }}
            >
              <img src={box} alt="" />
              <span>Select</span>
            </div>

            <div
              className="asset-menu-item delete"
              onClick={() => onDelete([file.id])}
            >
              <img src={dell} alt="" />
              <span>Delete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileCard;
