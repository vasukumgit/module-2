import React from "react";

import move from "../../../../../../../assets/editor-panel/assets-panel/move.png";
import download from "../../../../../../../assets/editor-panel/assets-panel/download.png";
import box from "../../../../../../../assets/editor-panel/assets-panel/box.png";
import dell from "../../../../../../../assets/editor-panel/assets-panel/dell.png";
import xsymbol from "../../../../../../../assets/editor-panel/assets-panel/xsymbol.png";

function SelectionFooter({
  selectedCount,
  onClear,
  onDelete,
}) {
  return (
    <div className="selection-footer">
      {/* LEFT CONTAINER */}
      <div className="footer-selected">
        <span
          className="footer-close"
          onClick={onClear}
        >
          <img
            src={xsymbol}
            alt="Close"
          />
        </span>

        <p>
          {selectedCount} Selected
        </p>
      </div>

      {/* RIGHT CONTAINER */}
      <div className="footer-icons">
        <div className="footer-icon-box">
          <img
            src={box}
            alt="Select"
          />
        </div>

        <div className="footer-icon-box">
          <img
            src={move}
            alt="Move"
          />
        </div>

        <div className="footer-icon-box">
          <img
            src={download}
            alt="Download"
          />
        </div>

        <div
          className="footer-icon-box"
          onClick={onDelete}
        >
          <img
            src={dell}
            alt="Delete"
          />
        </div>
      </div>
    </div>
  );
}

export default SelectionFooter;