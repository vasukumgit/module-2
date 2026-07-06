import { useEffect, useState } from "react";
import "../../styles/properties.css";
import frame from "../../../../../../../assets/editor-panel/properties/frame.svg";

const SizeControl = ({ selectedElements, updateElementMultiple }) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    locked: false,
  });

  useEffect(() => {
    if (!selectedElements?.length) {
      setSize((prev) => ({
        ...prev,
        width: "",
        height: "",
      }));
      return;
    }

    const el = selectedElements[0];

    setSize((prev) => ({
      ...prev,
      width: Math.round(el.width || 0),
      height: Math.round(el.height || 0),
    }));
  }, [selectedElements]);

  // =========================
  // WIDTH CHANGE
  // =========================
  const handleWidthChange = (value) => {
    const width = Number(value);

    setSize((prev) => {
      const locked = prev.locked;

      const newSize = {
        width,
        height: locked
          ? Math.round((width * prev.height) / prev.width)
          : prev.height,
      };

      updateElementMultiple({
        width,
        ...(locked ? { height: newSize.height } : {}),
      });

      return {
        ...prev,
        ...newSize,
      };
    });
  };

  // =========================
  // HEIGHT CHANGE
  // =========================
  const handleHeightChange = (value) => {
    const height = Number(value);

    setSize((prev) => {
      const locked = prev.locked;

      const newSize = {
        height,
        width: locked
          ? Math.round((height * prev.width) / prev.height)
          : prev.width,
      };

      updateElementMultiple({
        height,
        ...(locked ? { width: newSize.width } : {}),
      });

      return {
        ...prev,
        ...newSize,
      };
    });
  };

  // =========================
  // LOCK TOGGLE
  // =========================
  const toggleSizeLock = () => {
    setSize((prev) => ({
      ...prev,
      locked: !prev.locked,
    }));
  };

  return (
    <div className="column">
      <span className="section-label">Size</span>

      <div className="row">
        {/* WIDTH */}
        <div className="input-pill">
          <span className="input-label">W</span>
          <input
            type="number"
            value={size.width}
            onChange={(e) => handleWidthChange(e.target.value)}
            disabled={!selectedElements?.length}
          />
        </div>

        {/* HEIGHT */}
        <div className="input-pill">
          <span className="input-label">H</span>
          <input
            type="number"
            value={size.height}
            onChange={(e) => handleHeightChange(e.target.value)}
            disabled={!selectedElements?.length}
          />
        </div>

        {/* LOCK */}
        <button
          type="button"
          className={`icon-btn ${size.locked ? "active" : ""}`}
          onClick={toggleSizeLock}
        >
          <img src={frame} alt="" />
        </button>
      </div>
    </div>
  );
};

export default SizeControl;
