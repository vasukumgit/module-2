import { useState } from "react";
import "../../styles/properties.css";
import lock from "../../../../../../../assets/editor-panel/properties/lock.svg";

const PositionControl = ({
  selectedElements,
  updateElementMultiple,
  template,
}) => {
  const el = selectedElements?.[0];
  const [locked, setLocked] = useState(false);

  const x = el ? Number((el.x - template.x).toFixed(2)) : 0;
  const y = el ? Number((el.y - template.y).toFixed(2)) : 0;

  const handleXChange = (value) => {
    if (locked) return;

    updateElementMultiple({
      x: template.x + Number(value),
    });
  };

  const handleYChange = (value) => {
    if (locked) return;

    updateElementMultiple({
      y: template.y + Number(value),
    });
  };

  const toggleLock = () => {
    setLocked((prev) => !prev);

    updateElementMultiple({
      draggable: locked,
    });
  };

  return (
    <div className="column">
      <span className="section-label">Position</span>

      <div className="row">
        <div className="input-pill">
          <span className="input-label">X</span>
          <input
            type="number"
            value={x}
            disabled={locked}
            onChange={(e) => handleXChange(e.target.value)}
          />
        </div>

        <div className="input-pill">
          <span className="input-label">Y</span>
          <input
            type="number"
            value={y}
            disabled={locked}
            onChange={(e) => handleYChange(e.target.value)}
          />
        </div>

        <button type="button" className="icon-btn" onClick={toggleLock}>
          <img src={lock} alt="lock" />
        </button>
      </div>
    </div>
  );
};

export default PositionControl;
