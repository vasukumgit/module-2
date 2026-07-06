import React from "react";
import leftarrow from "../../../../../../../assets/editor-panel/assets-panel/leftarrow.png";

function DetailsHeader({
  title,
  onBack,
}) {
  return (
    <div className="details-header">
      <span
        className="back-btn"
        onClick={onBack}
      >
        <img
          src={leftarrow}
          alt=""
        />
      </span>

      <h3>{title}</h3>
    </div>
  );
}

export default DetailsHeader;