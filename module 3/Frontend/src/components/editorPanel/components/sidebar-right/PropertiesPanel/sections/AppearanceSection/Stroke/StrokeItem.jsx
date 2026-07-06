import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

import minus from "../../../../../../../../assets/editor-panel/properties/minus.svg";
import solar_eye_linear from "../../../../../../../../assets/editor-panel/properties/solar_eye_linear.svg";

export default function StrokeItem({
  stroke,
  onChange,
  onDelete,
  onOpen,
  onClose,
  isOpen,
}) {


  // =========================
  // CLOSE PICKER OUTSIDE CLICK
  // =========================

 

  return (
    <div className="item-row">
      {/* MAIN INPUT */}
      <div className="input-container">
        {/* LEFT */}
        <div className="input-left">
          {/* PICKER WRAPPER */}
          <div
            className="picker-wrapper"
          >
            {/* COLOR DOT */}
            <div
              className="color-dot"
              style={{
                background:
                  stroke.color || "#000000",
              }}
              onClick={onOpen}
            />

            {/* COLOR PICKER */}
            {isOpen && (
              <div className="color-popup">
                <HexColorPicker
                  color={
                    stroke.color || "#000000"
                  }
                  onChange={(color) =>
                    onChange({
                      ...stroke,
                      color,
                    })
                  }
                />

                {/* HEX INPUT */}
                <input
                  type="text"
                  value={
                    stroke.color || "#000000"
                  }
                  onChange={(e) =>
                    onChange({
                      ...stroke,
                      color: e.target.value,
                    })
                  }
                  className="hex-input"
                />
              </div>
            )}
          </div>

          {/* COLOR TEXT */}
          <input
            type="text"
            value={(
              stroke.color || "#000000"
            ).replace("#", "")}
            onChange={(e) =>
              onChange({
                ...stroke,
                color:
                  "#" + e.target.value,
              })
            }
            className="color-text"
          />
        </div>

        {/* RIGHT */}
        <div className="input-right">
          {/* VISIBILITY */}
          <button
            type="button"
            className="eye-btn"
            onClick={() =>
              onChange({
                ...stroke,
                visible:
                  !stroke.visible,
              })
            }
          >
            <img
              src={solar_eye_linear}
              alt=""
            />
          </button>

          <div className="divider" />

          {/* STROKE WIDTH */}
          <input
            type="number"
            min="1"
            value={stroke.width || 2}
            onChange={(e) =>
              onChange({
                ...stroke,
                width: Number(
                  e.target.value,
                ),
              })
            }
            className="opacity-input"
          />
        </div>
      </div>

      {/* DELETE */}
      <button
        type="button"
        className="minus-btn"
        onClick={onDelete}
      >
        <img src={minus} alt="" />
      </button>
    </div>
  );
}