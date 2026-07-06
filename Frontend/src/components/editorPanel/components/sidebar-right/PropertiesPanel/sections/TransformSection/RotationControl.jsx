import "../../styles/properties.css";
import angle from "../../../../../../../assets/editor-panel/properties/angle.svg";
import reset from "../../../../../../../assets/editor-panel/properties/reset.svg";

const RotationControl = ({ selectedElements, updateElementMultiple }) => {
  const el = selectedElements?.[0];

  if (!el) return null;

  const handleRotation = (value) => {
    updateElementMultiple({
      rotation: Number(value),
    });
  };

  const resetRotation = () => {
    updateElementMultiple({
      rotation: 0,
    });
  };

  return (
    <div className="column flex-1">
      <span className="section-label">Rotation</span>

      <div className="input-pill">
        <span className="input-label">
          <img src={angle} alt="angle" />
        </span>

        <input
          type="number"
          value={Number(el.rotation || 0).toFixed(2)}
          onChange={(e) => handleRotation(e.target.value)}
          disabled={!selectedElements?.length}
        />

        <button type="button" className="reset-btn" onClick={resetRotation}>
          <img src={reset} alt="reset" />
        </button>
      </div>
    </div>
  );
};

export default RotationControl;
