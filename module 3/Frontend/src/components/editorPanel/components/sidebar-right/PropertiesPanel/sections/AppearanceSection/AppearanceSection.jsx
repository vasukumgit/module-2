import React, { useState } from "react";
import "./AppearanceSection.css";

import OpacityControl from "./controls/OpacityControl";
import CornerRadiusControl from "./controls/CornerRadiusControl";
import BlendModeControl from "./controls/BlendModeControl";
import FillSection from "./Fill/FillSection";
import StrokeSection from "./Stroke/StrokeSection";
import EffectsSection from "./Effects/EffectsSection";

import down_arrow from "../../../../../../../assets/editor-panel/arrow.svg";

export default function AppearanceSection({
  selectedElements,
  updateElementMultiple,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="appearance-section">
      <div className="section-header" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="section-title">Appearance</h3>

        <span className={`section-collapse ${!isOpen ? "rotate" : ""}`}>
          <img src={down_arrow} alt="" />
        </span>
      </div>

      {isOpen && (
        <>
          <div className="appearance-row">
            <div className="appearance-col">
              <OpacityControl
                selectedElements={selectedElements}
                updateElementMultiple={updateElementMultiple}
              />
            </div>

            <div className="appearance-col">
              <CornerRadiusControl
                selectedElements={selectedElements}
                updateElementMultiple={updateElementMultiple}
              />
            </div>
          </div>

          <BlendModeControl
            selectedElements={selectedElements}
            updateElementMultiple={updateElementMultiple}
          />

          <FillSection
            selectedElements={selectedElements}
            updateElementMultiple={updateElementMultiple}
          />

          <StrokeSection
            selectedElements={selectedElements}
            updateElementMultiple={updateElementMultiple}
          />

          <EffectsSection
            selectedElements={selectedElements}
            updateElementMultiple={updateElementMultiple}
          />
        </>
      )}
    </div>
  );
}