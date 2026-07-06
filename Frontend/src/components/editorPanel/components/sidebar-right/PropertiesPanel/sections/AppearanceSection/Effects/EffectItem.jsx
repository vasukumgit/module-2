import React from "react";
import minus from "../../../../../../../../assets/editor-panel/properties/minus.svg";
import solar_eye_linear from "../../../../../../../../assets/editor-panel/properties/solar_eye_linear.svg";
import corner_Radius from "../../../../../../../../assets/editor-panel/properties/corner_Radius.svg";

export default function EffectItem({ name, onDelete, onToggle }) {
  return (
    <div className="effect-row">
      {/* MAIN PILL */}
      <div className="effect-item">
        {/* LEFT */}
        <div className="effect-left">
          <img src={corner_Radius} alt="" />
          <span>{name}</span>
        </div>

        {/* RIGHT */}
        <div className="effect-right">
          <button type="button" className="eye-btn" onClick={onToggle}>
            <img src={solar_eye_linear} alt="" />
          </button>
        </div>
      </div>

      {/* ❌ OUTSIDE MINUS */}
      <button type="button" className="minus-btn" onClick={onDelete}>
        <img src={minus} alt="" />
      </button>
    </div>
  );
}
