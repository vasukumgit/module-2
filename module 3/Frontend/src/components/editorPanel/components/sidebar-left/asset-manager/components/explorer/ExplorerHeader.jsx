import React from "react";
import "../../styles/AssetsPanel.css"

export default function ExplorerHeader({ onClose }) {
  return (
    <div>
      <div className="assets-header">
        <div className="assets-title">
          <div className="dots-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <h3>Assets</h3>
        </div>

        <button className="assets-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
