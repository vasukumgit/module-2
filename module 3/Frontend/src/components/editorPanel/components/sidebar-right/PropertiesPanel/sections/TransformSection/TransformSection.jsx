import { useState } from "react";
import "../../styles/properties.css";

import PositionControl from "./PositionControl";
import SizeControl from "./SizeControl";
import RotationControl from "./RotationControl";
import FlipControl from "./FlipControl";

import down_arrow from "../../../../../../../assets/editor-panel/arrow.svg";

const TransformSection = ({
  selectedElements,
  updateElementMultiple,
  template,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="transform-container">
      {/* Header */}
      <div className="transform-header" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="section-title">Transform</h3>

        <button className={`transform-dropdown ${!isOpen ? "rotate" : ""}`}>
          <img src={down_arrow} alt="arrow" />
        </button>
      </div>

      {isOpen && (
        <>
          <PositionControl
            selectedElements={selectedElements}
            updateElementMultiple={updateElementMultiple}
            template={template}
          />

          <SizeControl
            selectedElements={selectedElements}
            updateElementMultiple={updateElementMultiple}
          />

          <div className="transform-bottom">
            <RotationControl
              selectedElements={selectedElements}
              updateElementMultiple={updateElementMultiple}
            />

            <FlipControl
              selectedElements={selectedElements}
              updateElementMultiple={updateElementMultiple}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransformSection;
