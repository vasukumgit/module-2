// FolderDetails.jsx

import React from "react";
import leftarrow from "../../../../../../../assets/editor-panel/assets-panel/leftarrow.png";

function FolderDetails({ folder, onBack, onRename, onShare, onDelete }) {
  return (
    <div className="folder-details-page">
      <div className="folder-details-header">
        <button className="back-btn" onClick={onBack}>
          <img src={leftarrow} alt="back-btn" />
        </button>

        <h2>{folder?.name}</h2>
      </div>

      <div className="folder-preview-card">
        <div className="preview-images">
          <img
            className="left-img"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"
            alt=""
          />

          <img
            className="center-img"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"
            alt=""
          />

          <img
            className="right-img"
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"
            alt=""
          />
        </div>

        <div className="preview-content">
          <h3>{folder?.name}</h3>

          <p>
            {folder?.items?.length || 0}{" "}
            {(folder?.items?.length || 0) === 1 ? "Item" : "Items"}
          </p>
        </div>
      </div>

      <div className="details-card">
        <h3>Details</h3>
        <div className="details-card-rows">
          <div className="details-row">
            <span>Items</span>
            <span>{folder?.items?.length || 0}</span>
          </div>

          <div className="details-row">
            <span>Size</span>
            <span>124 KB</span>
          </div>

          <div className="details-row">
            <span>Type</span>
            <span>Folder</span>
          </div>

          <div className="details-row">
            <span>Created By</span>
            <span>Creator Name</span>
          </div>

          <div className="details-row">
            <span>Date Created</span>
            <span>28 Apr 2026</span>
          </div>

          <div className="details-row">
            <span>Date Modified</span>
            <span>28 Apr 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderDetails;
