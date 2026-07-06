import React from "react";
import Folder from "../../../../../../assets/editor-panel/assets-panel/folder.svg";

function MoveFolderModal({
  open,
  folders,
  movingFolder,
  targetFolder,
  setTargetFolder,
  onClose,
  onMove,
}) {
  if (!open) return null;

  return (
    <div className="assets-container-popup-overlay" onClick={onClose}>
      <div
        className="move-folder-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="move-folder-header">
          <div className="move-folder-top-row">
            <h2>Move Folder</h2>

            <button
              className="move-close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <p>Select a destination folder below</p>

          <p>
            Current location: {movingFolder?.name}
          </p>

          <input
            className="move-folder-search-input"
            placeholder="Search folder"
          />

          <p className="move-folder-project-name">
            Project Name (All Folders)
          </p>
        </div>

        <div className="move-folder-list">
          {folders.map((folder, index) => {
            const isMovingFolder =
              folder.name === movingFolder?.name;

            return (
              <div
                key={index}
                className={`move-folder-row ${
                  isMovingFolder
                    ? "blur-folder"
                    : targetFolder?.name === folder.name
                    ? "selected-target-folder"
                    : ""
                }`}
                onClick={() => {
                  if (isMovingFolder) return;

                  setTargetFolder(folder);
                }}
              >
                <div className="move-folder-left">
                  <img src={Folder} alt="folder" />

                  <div>
                    <h4>{folder.name}</h4>

                    <p>
                      {(folder.items?.length || 0) +
                        (folder.subFolders?.length || 0)}
                      {" "}
                      items
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="move-folder-footer">
          <button
            className="move-folder-btn"
            disabled={!targetFolder}
            onClick={onMove}
          >
            Move File
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoveFolderModal;