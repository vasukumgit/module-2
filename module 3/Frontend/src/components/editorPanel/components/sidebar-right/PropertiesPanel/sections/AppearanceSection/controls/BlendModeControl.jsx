import React, { useEffect, useState } from "react";
import down_arrow from "../../../../../../../../assets/editor-panel/arrow.svg";

export default function BlendModeControl({
  selectedElements,
  updateElementMultiple,
}) {
  const el = selectedElements?.[0];

  const blendOptions = [
    { label: "Pass Through", value: "source-over" },
    { label: "Normal", value: "source-over" },
    { label: "Multiply", value: "multiply" },
    { label: "Screen", value: "screen" },
    { label: "Overlay", value: "overlay" },
    { label: "Darken", value: "darken" },
    { label: "Lighten", value: "lighten" },
    { label: "Color Dodge", value: "color-dodge" },
    { label: "Color Burn", value: "color-burn" },
    { label: "Hard Light", value: "hard-light" },
    { label: "Soft Light", value: "soft-light" },
    { label: "Difference", value: "difference" },
    { label: "Exclusion", value: "exclusion" },
    { label: "Hue", value: "hue" },
    { label: "Saturation", value: "saturation" },
    { label: "Color", value: "color" },
    { label: "Luminosity", value: "luminosity" },
  ];

  const [blendMode, setBlendMode] = useState("source-over");

  useEffect(() => {
    if (!el) return;
    setBlendMode(el.globalCompositeOperation || "source-over");
  }, [el?.globalCompositeOperation]);

  const handleBlendMode = (value) => {
    setBlendMode(value);

    updateElementMultiple({
      globalCompositeOperation: value,
    });
  };

  return (
    <div className="blend-block">
      <span className="control-title">Blend Mode</span>

      <div className="blend-dropdown-wrapper">
        <select
          className="blend-select"
          value={blendMode}
          onChange={(e) => handleBlendMode(e.target.value)}
        >
          {blendOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="dropdown-icon">
          <img src={down_arrow} alt="arrow" />
        </span>
      </div>
    </div>
  );
}
