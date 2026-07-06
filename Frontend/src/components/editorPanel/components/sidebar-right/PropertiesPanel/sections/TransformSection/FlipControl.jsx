import "../../styles/properties.css";
import verticalflip from "../../../../../../../assets/editor-panel/properties/verticalflip.svg";
import horizontalflip from "../../../../../../../assets/editor-panel/properties/horizontalflip.svg";

const FlipControl = ({ selectedElements, updateElementMultiple }) => {
  const el = selectedElements?.[0];

  const toggleHorizontal = () => {
    updateElementMultiple({
      // flipX: !el.scaleX === -1 ? 1 : -1,
      flipX: !el.flipX,
    });
  };

  const toggleVertical = () => {
    updateElementMultiple({
      // flipY: !el.scaleY === -1 ? 1 : -1,
      flipY: !el.flipY,
    });
  };

  return (
    <div className="column flex-1">
      <span className="section-label">Flip</span>

      <div className="row">
        <button type="button" className="flip-btn" onClick={toggleHorizontal}>
          <img src={horizontalflip} alt="horizontal flip" />
        </button>

        <button type="button" className="flip-btn" onClick={toggleVertical}>
          <img src={verticalflip} alt="vertical flip" />
        </button>
      </div>
    </div>
  );
};

export default FlipControl;
