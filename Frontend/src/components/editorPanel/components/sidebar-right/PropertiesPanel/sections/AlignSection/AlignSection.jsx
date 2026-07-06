import "./../../styles/properties.css";
import AlignGroup from "./AlignGroup";
import axios from "axios";

import left from "../../../../../../../assets/editor-panel/properties/horizontal/left.svg";
import center from "../../../../../../../assets/editor-panel/properties/horizontal/middle.svg";
import right from "../../../../../../../assets/editor-panel/properties/horizontal/right.svg";

import top from "../../../../../../../assets/editor-panel/properties/vertical/top.svg";
import middle from "../../../../../../../assets/editor-panel/properties/vertical/vertical_middle.svg";
import bottom from "../../../../../../../assets/editor-panel/properties/vertical/bottom.svg";

import center_align from "../../../../../../../assets/editor-panel/properties/center.svg";

const AlignSection = ({
  selectedIds,
  elements,
  setElements,
  template,
  saveDesign,
  saveHistory,
}) => {
  const horizontal = [
    {
      id: "left",
      icon: left,
      label: "Left align",
      type: "horizontal",
      value: "left",
    },
    {
      id: "center",
      icon: center,
      label: "Center align",
      type: "horizontal",
      value: "center",
    },
    {
      id: "right",
      icon: right,
      label: "Right align",
      type: "horizontal",
      value: "right",
    },
  ];

  const vertical = [
    {
      id: "top",
      icon: top,
      label: "Top align",
      type: "vertical",
      value: "top",
    },
    {
      id: "middle",
      icon: middle,
      label: "Middle align",
      type: "vertical",
      value: "middle",
    },
    {
      id: "bottom",
      icon: bottom,
      label: "Bottom align",
      type: "vertical",
      value: "bottom",
    },
  ];

  const distribute = [
    {
      id: "distribute",
      icon: center_align,
      label: "Distribute",
      type: "distribute",
      value: true,
    },
  ];

  const getNormalizedBounds = (items) => {
    let minX = Infinity;
    let maxX = -Infinity;

    items.forEach((el) => {
      minX = Math.min(minX, el.x);
      maxX = Math.max(maxX, el.x + el.width);
    });

    return { minX, maxX };
  };

  const handleAlignment = (type, value) => {
    if (!selectedIds?.length) return;

    let updated = elements.map((item) => {
      if (!selectedIds.includes(item.id)) return item;

      // =========================
      // HORIZONTAL ALIGNMENT
      // =========================
      if (type === "horizontal") {
        let x = item.x;

        if (value === "left") {
          x = template.x;
        }

        if (value === "center") {
          x = template.x + template.width / 2 - item.width / 2;
        }

        if (value === "right") {
          x = template.x + template.width - item.width;
        }

        return {
          ...item,
          x,
        };
      }

      // =========================
      // VERTICAL ALIGNMENT
      // =========================
      if (type === "vertical") {
        let y = item.y;

        if (value === "top") {
          y = template.y;
        }

        if (value === "middle") {
          y = template.y + template.height / 2 - item.height / 2;
        }

        if (value === "bottom") {
          y = template.y + template.height - item.height;
        }

        return {
          ...item,
          y,
        };
      }

      return item;
    });

    // =========================
    // DISTRIBUTE (HORIZONTAL)
    // =========================
    if (type === "distribute") {
      const selected = elements
        .filter((item) => selectedIds.includes(item.id))
        .sort((a, b) => a.x - b.x);

      if (selected.length < 3) return;

      const bounds = getNormalizedBounds(selected);

      const totalWidth = selected.reduce((sum, el) => sum + el.width, 0);

      const gap =
        (bounds.maxX - bounds.minX - totalWidth) / (selected.length - 1);

      let currentX = bounds.minX;

      const updated = elements.map((item) => {
        const index = selected.findIndex((s) => s.id === item.id);
        if (index === -1) return item;

        if (index === 0) return item;

        const prev = selected[index - 1];
        currentX += prev.width + gap;

        return {
          ...item,
          x: currentX,
        };
      });

      return setElements(updated);
    }

    // =========================
    // SAVE FINAL RESULT
    // =========================
    setElements(updated);
    saveHistory(updated, template);
    saveDesign(updated);
  };

  return (
    <div className="align-section">
      {/* Subsection */}
      <div className="align-subsection">
        {/* Label + Dropdown */}
        <div className="align-top">
          <span className="section-title">Align</span>

          <div className="dropdown-container">
            <select className="selection-dropdown">
              <option>Selection</option>
            </select>
          </div>
        </div>

        {/* Content Container */}
        <div className="align-content">
          <div className="align-button-wrapper">
            {/* Horizontal */}
            <AlignGroup
              onSelect={handleAlignment}
              options={horizontal}
              className="group-horizontal"
            />

            {/* Vertical */}
            <AlignGroup
              onSelect={handleAlignment}
              options={vertical}
              className="group-vertical"
            />

            {/* Distribute (small) */}
            <AlignGroup
              onSelect={handleAlignment}
              options={distribute}
              className="group-small"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlignSection;
