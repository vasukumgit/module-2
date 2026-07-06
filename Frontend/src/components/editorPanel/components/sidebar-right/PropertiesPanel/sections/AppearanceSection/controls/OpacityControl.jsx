import { useEffect, useState } from "react";
import React from "react";
import Opacuty from "../../../../../../../../assets/editor-panel/properties/Opacuty.svg";

export default function OpacityControl({
  selectedElements,
  updateElementMultiple,
}) {
  const el = selectedElements?.[0];
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (!selectedElements?.length) {
      setOpacity("");
      return;
    }

    setOpacity(Math.round((selectedElements[0]?.opacity ?? 1) * 100));
  }, [selectedElements]);

  const handleOpacity = (value) => {
    const newOpacity = Number(value);

    setOpacity(newOpacity);

    updateElementMultiple({
      opacity: newOpacity / 100,
    });
  };

  return (
    <div>
      <span className="control-title">Opacity</span>

      <div className="input-field">
        <span>
          <img src={Opacuty} alt="" />
        </span>

        <input
          type="number"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => handleOpacity(e.target.value)}
          disabled={!selectedElements?.length}
        />
      </div>
    </div>
  );
}
