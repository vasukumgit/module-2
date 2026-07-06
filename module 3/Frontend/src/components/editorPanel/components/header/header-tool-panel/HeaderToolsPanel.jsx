import { useState, useRef, useEffect } from "react";
import "./HeaderToolsPanel.css";
import axios from "axios";

import Selection from "../../../../../assets/editor-panel/header-tool-panel/selection.svg";
import Arrow from "../../../../../assets/editor-panel/header-tool-panel/arrow.svg";
import Direct from "../../../../../assets/editor-panel/header-tool-panel/direct.svg";
import Hand from "../../../../../assets/editor-panel/header-tool-panel/hand.svg";
import Zoom from "../../../../../assets/editor-panel/header-tool-panel/zoom.svg";
import Rectangle from "../../../../../assets/editor-panel/header-tool-panel/rectangle.svg";
import Line from "../../../../../assets/editor-panel/header-tool-panel/line.svg";
import Ellipse from "../../../../../assets/editor-panel/header-tool-panel/ellipse.svg";
import Polygon from "../../../../../assets/editor-panel/header-tool-panel/polygon.svg";
import Star from "../../../../../assets/editor-panel/header-tool-panel/star.svg";
import Pen from "../../../../../assets/editor-panel/header-tool-panel/pen.svg";
import Pencil from "../../../../../assets/editor-panel/header-tool-panel/pencil.svg";
import Text from "../../../../../assets/editor-panel/header-tool-panel/text.svg";
import Textpath from "../../../../../assets/editor-panel/header-tool-panel/text-path.svg";
import Vertical from "../../../../../assets/editor-panel/header-tool-panel/vertical-text.svg";
import Commend from "../../../../../assets/editor-panel/header-tool-panel/commend.svg";
// import cursor    from "../../../../../assets/editor-panel/header-tool-panel/selection.png";

import Cursor1 from "../../../../../assets/editor-panel/header-tool-panel/selection.png";
// import Cursor2 from "../../../../../assets/editor-panel/header-tool-panel/pen.png";
// import Cursor3 from "../../../../../assets/editor-panel/header-tool-panel/pencil.png";

const tools = [
  {
    name: "Selection",

    apiTool: "select",

    options: [
      {
        label: "Selection",

        icon: Selection,

        key: "V",

        apiSubTool: "selection",
      },

      {
        label: "Direct Selection",

        icon: Direct,

        key: "A",

        apiSubTool: "direct_selection",
      },

      { label: "Hand", icon: Hand, key: "H", apiSubTool: "hand" },

      { label: "Zoom", icon: Zoom, key: "Z", apiSubTool: "zoom" },
    ],
  },
  {
    name: "Rectangle",
    apiTool: "shape",
    options: [
      {
        label: "Rectangle",
        icon: Rectangle,
        key: "M",
        apiSubTool: "rectangle",
      },
      { label: "Line", icon: Line, key: "L", apiSubTool: "line" },
      { label: "Ellipse", icon: Ellipse, key: "O", apiSubTool: "ellipse" },
      { label: "Polygon", icon: Polygon, key: "", apiSubTool: "polygon" },
      { label: "Star", icon: Star, key: "", apiSubTool: "star" },
    ],
  },
  {
    name: "Pen",
    apiTool: "pen",
    options: [
      { label: "Pen", icon: Pen, key: "P", apiSubTool: "pen" },
      { label: "Pencil", icon: Pencil, key: "Shift+P", apiSubTool: "pencil" },
    ],
  },
  {
    name: "Text",
    apiTool: "text",
    options: [
      { label: "Text", icon: Text, key: "T", apiSubTool: "text" },
      {
        label: "Text on Path",
        icon: Textpath,
        key: "",
        apiSubTool: "text_path",
      },
      {
        label: "Vertical Text",
        icon: Vertical,
        key: "",
        apiSubTool: "vertical_text",
      },
    ],
  },
  {
    name: "Comment",
    options: [{ label: "Comment", icon: Commend, key: "" }],
  },
];

// ─────────────────────────────────────────────────────────
// PROPS:
//   onToolChange(subTool)  — tells Editor which sub-tool is active
//   onSelectAll()          — called when "selection" is activated
// ─────────────────────────────────────────────────────────
function HeaderToolsPanel({ onToolChange, onSelectAll }) {
  const wrapperRef = useRef(null);
  const userId = 1;
  const canvasId = "canvas_1";

  // openDropdown  : index of the group whose dropdown is open  (null = all closed)
  // selectedToolIndex : index of the currently ACTIVE tool group
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedToolIndex, setSelectedToolIndex] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const d = {};
    tools.forEach((t, i) => {
      d[i] = t.options[0];
    });
    return d;
  });

  // ── Apply cursor on the Konva canvas element ──
  const changeCursor = (subTool) => {
    const canvas = document.querySelector(".konvajs-content");
    if (!canvas) return;
    const map = {
      selection: `url(${Cursor1}) 0 0, default`,
      direct_selection: "default",
      hand: "grab",
      zoom: "zoom-in",
      pen: "crosshair",
      pencil: "crosshair",
      // pen: `url(${Cursor2}) 0 0, crosshair`,
      // pencil: `url(${Cursor3}) 0 0, crosshair`,
      rectangle: "crosshair",
      line: "crosshair",
      ellipse: "crosshair",
      polygon: "crosshair",
      star: "crosshair",
      text: "text",
      text_path: "text",
      vertical_text: "text",
    };
    canvas.style.cursor = map[subTool] ?? "default";
  };

  // ── Tell Editor (and GridCanvas) the new active tool ──
  const notifyToolChange = (subTool) => {
    if (onToolChange) onToolChange(subTool);
    if (subTool === "selection" && onSelectAll) onSelectAll();
  };

  // ── Persist to backend ──
  const saveTool = async (toolGroup, option) => {
    if (!toolGroup?.apiTool || !option?.apiSubTool) return;
    try {
      await axios.post("http://localhost:5050/api/editor-tool/tool", {
        userId,
        canvasId,
        tool: toolGroup.apiTool,
        subTool: option.apiSubTool,
      });
    } catch (err) {
      console.error("POST ERROR:", err);
    }
  };

  // ── Restore last-used tool on mount ──
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/editor-tool/tools",
          {
            params: { userId, canvasId },
          },
        );
        if (res.data?.data) {
          const { tool, sub_tool } = res.data.data;
          tools.forEach((group, index) => {
            if (group.apiTool === tool) {
              const found = group.options.find(
                (o) => o.apiSubTool === sub_tool,
              );
              if (found) {
                setSelectedOptions((prev) => ({ ...prev, [index]: found }));
                setSelectedToolIndex(index);
                changeCursor(found.apiSubTool);
                notifyToolChange(found.apiSubTool);
              }
            }
          });
        }
      } catch (err) {
        console.error("GET ERROR:", err);
      }
    };
    load();
  }, []);

  // ── Keep cursor in sync when active option changes ──
  useEffect(() => {
    if (selectedToolIndex === null) return;
    const sel = selectedOptions[selectedToolIndex];
    if (sel?.apiSubTool) changeCursor(sel.apiSubTool);
  }, [selectedToolIndex, selectedOptions]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─────────────────────────────────────────────────────────
  // MAIN BUTTON CLICK
  //   First click on a group  → activate it + fire onToolChange immediately
  //   Click on already-active → toggle dropdown open/closed
  // ─────────────────────────────────────────────────────────
  const handleMainButtonClick = async (index) => {
    const toolGroup = tools[index];
    const selected = selectedOptions[index];

    if (selectedToolIndex !== index) {
      // New group — activate immediately
      setSelectedToolIndex(index);
      setOpenDropdown(null);
      if (selected?.apiSubTool) {
        changeCursor(selected.apiSubTool);
        notifyToolChange(selected.apiSubTool); // ← this sets activeTool in Editor
        await saveTool(toolGroup, selected);
      }
    } else {
      // Already active — just open/close its dropdown
      setOpenDropdown((prev) => (prev === index ? null : index));
    }
  };

  // ─────────────────────────────────────────────────────────
  // DROPDOWN OPTION CLICK
  //   Always: remember option, activate group, close dropdown,
  //           fire onToolChange immediately
  // ─────────────────────────────────────────────────────────
  const handleOptionClick = async (toolIndex, option) => {
    const toolGroup = tools[toolIndex];
    setSelectedOptions((prev) => ({ ...prev, [toolIndex]: option }));
    setSelectedToolIndex(toolIndex);
    setOpenDropdown(null);
    if (option?.apiSubTool) {
      changeCursor(option.apiSubTool);
      notifyToolChange(option.apiSubTool); // ← this sets activeTool in Editor
      await saveTool(toolGroup, option);
    }
  };

  return (
    <div className="header-toolbar-box" ref={wrapperRef}>
      <ul>
        {tools.map((tool, index) => {
          const selected = selectedOptions[index];
          const isSelected = selectedToolIndex === index;
          const isOpen = openDropdown === index;
          return (
            <li key={index} className="header-toolbar-item">
              <div
                className={`header-tool-button ${isSelected ? "selected" : ""}`}
                onClick={() => handleMainButtonClick(index)}
              >
                <div className="header-tool-icons">
                  <img src={selected.icon} alt="" />
                  <img src={Arrow} alt="" />
                </div>
              </div>

              {isOpen && (
                <div className="header-tool-dropdown">
                  {tool.options.map((item, i) => {
                    const isActive = selected.label === item.label;
                    return (
                      <div
                        key={i}
                        className={`header-dropdown-item ${isActive ? "active" : ""}`}
                        onClick={() => handleOptionClick(index, item)}
                      >
                        <div className="header-dropdown-left">
                          <span className={`check ${isActive ? "show" : ""}`}>
                            ✓
                          </span>
                          <img
                            src={item.icon}
                            alt=""
                            className="header-dropdown-icons"
                          />
                          <span className="header-tool-option">
                            {item.label}
                          </span>
                        </div>
                        <span className="shortcut">{item.key}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HeaderToolsPanel;
