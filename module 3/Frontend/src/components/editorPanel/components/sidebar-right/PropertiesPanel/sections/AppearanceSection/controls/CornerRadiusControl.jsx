import React, { useEffect, useState } from "react";
import corner_Radius from "../../../../../../../../assets/editor-panel/properties/corner_Radius.svg";

export default function CornerRadiusControl({
  selectedElements,
  updateElementMultiple,
}) {
  const el = selectedElements?.[0];
  const [cornerRadius, setCornerRadius] = useState(0);

  useEffect(() => {
    if (!selectedElements?.length) {
      setCornerRadius("");
      return;
    }

    setCornerRadius(selectedElements[0]?.cornerRadius || 0);
  }, [selectedElements]);

  const handleCornerRadius = (value) => {
    const maxRadius = Math.min(el?.width || 0, el?.height || 0) / 2;

    const updated = Math.min(Number(value), maxRadius);

    setCornerRadius(updated);

    updateElementMultiple({
      cornerRadius: updated,
    });
  };

  return (
    <div>
      <span className="control-title">Corner Radius</span>

      <div className="input-field">
        <span>
          <img src={corner_Radius} alt="" />
        </span>

        <input
          type="number"
          min="0"
          max={Math.min(el?.width || 0, el?.height || 0) / 2}
          value={cornerRadius}
          onChange={(e) => handleCornerRadius(e.target.value)}
          disabled={!selectedElements?.length}
        />
      </div>
    </div>
  );
}
