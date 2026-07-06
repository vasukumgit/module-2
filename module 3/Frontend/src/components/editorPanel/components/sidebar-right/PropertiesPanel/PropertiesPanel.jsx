import React from "react";
import "./styles/properties.css";

import AlignSection from "./sections/AlignSection/AlignSection";
import TransformSection from "./sections/TransformSection/TransformSection";
import AppearanceSection from "./sections/AppearanceSection/AppearanceSection";
// import FillSection from "./sections/FillSection";
// import StrokeSection from "./sections/StrokeSection";
import close from "../../../../../assets/editor-panel/close.svg";

const PropertiesPanel = ({
  elements,
  setElements,
  selectedIds,
  template,
  setTemplate,
  saveDesign,
  saveHistory,
  setShowProperties,
}) => {
  const selectedElements = elements.filter((item) =>
    selectedIds.includes(item.id),
  );
  const updateElementMultiple = (values) => {
    const updated = elements.map((item) =>
      selectedIds.includes(item.id) ? { ...item, ...values } : item,
    );

    setElements(updated);
    saveHistory(updated, template);
    saveDesign(updated);
  };

  return (
    <div className="properties-panel">
      {/* Header */}
      <div className="properties-header">
        <div className="properties-header-title">Properties</div>
        <button
          className="properties-close-btn"
          onClick={() => {
            setShowProperties(false);
          }}
        >
          <img src={close} alt="close" />
        </button>
      </div>

      {/* Sections */}
      <div className="properties-content">
        <AlignSection
          selectedElements={selectedElements}
          selectedIds={selectedIds}
          elements={elements}
          setElements={setElements}
          template={template}
          saveDesign={saveDesign}
          saveHistory={saveHistory}
        />
        <TransformSection
          selectedElements={selectedElements}
          selectedIds={selectedIds}
          elements={elements}
          setElements={setElements}
          template={template}
          setTemplate={setTemplate}
          saveDesign={saveDesign}
          updateElementMultiple={updateElementMultiple}
        />
        <AppearanceSection
          selectedElements={selectedElements}
          updateElementMultiple={updateElementMultiple}
        />
        {/* <FillSection />
        <StrokeSection /> */}
      </div>
    </div>
  );
};

export default PropertiesPanel;
