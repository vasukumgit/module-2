import React from "react";

import plus from "../../../../../../../assets/editor-panel/assets-panel/plus.png";
import cancel from "../../../../../../../assets/editor-panel/assets-panel/cancel.png";
import leftarrow from "../../../../../../../assets/editor-panel/assets-panel/leftarrow.png";

function MoveFileModal({
  files,
  onClose,
  onFolderSelect,
}) {
  return (
    <>
      {/* HEADER */}
      <div className="details-header">
        <span
          className="back-btn"
          onClick={onClose}
        >
          <img
            src={leftarrow}
            alt=""
          />
        </span>

        <h3>Folder Name</h3>

        <button
          className="close-btn"
          onClick={onClose}
        >
          <img
            src={cancel}
            alt=""
          />
        </button>
      </div>

      {/* SEARCH */}
      <div className="assets-search">
        <input
          type="text"
          placeholder="Search in Folder Name"
        />

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 21L15.8 15.8M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* UPLOAD */}
      <div className="upload-row">
        <div className="upload-circle">
          <img
            src={plus}
            alt=""
          />
        </div>

        <span>
          Upload New Asset
        </span>
      </div>

      {/* FOLDERS */}
      <div className="folder-grid">
        {files.map((file) => (
          <div
            key={file.id}
            className="folder-item"
            onClick={() =>
              onFolderSelect(
                file.folderId
              )
            }
          >
            <img
              src={file.image}
              alt={file.name}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default MoveFileModal;