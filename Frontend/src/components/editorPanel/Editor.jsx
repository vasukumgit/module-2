import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import GridCanvas from "./components/canvas/CanvasStage";
import "./styles/editor.css";
import Header from "./components/header/Header";
import FooterLeft from "./components/footer/FooterLeft";
import FooterRight from "./components/footer/FooterRight";
import SidebarLeft from "./components/sidebar-left/SidebarLeft";
import SidebarRight from "./components/sidebar-right/SidebarRight";

export default function Editor() {
  const { projectId } = useParams();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [design, setDesign] = useState([]);
  const [elements, setElements] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTool, setActiveTool] = useState("selection");
  const historyRef = useRef([]);

  const historyIndexRef = useRef(-1);
  const location = useLocation();
  const { selectedTemplate } = location.state || {};
  const [template, setTemplate] = useState({
    width: 500,
    height: 500,
    x: 5000 - 250,
    y: 5000 - 250,
  });

  const templateId = design.template_id;

  useEffect(() => {
    const editor = document.querySelector(".editor");

    if (!editor) return; // safety check

    if (theme === "dark") {
      editor.classList.add("dark");
    } else {
      editor.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    fetchDesign();
  }, []);
  useEffect(() => {
    if (historyRef.current.length === 0) {
      console.log("CREATING INITIAL HISTORY");
      saveHistory([], template);
    }
  }, []);
  useEffect(() => {
    if (!design || !design.width || !design.height) return;

    setTemplate({
      width: Number(design.width),
      height: Number(design.height),
      x: 5000 - Number(design.width) / 2,
      y: 5000 - Number(design.height) / 2,
    });
  }, [design]);

  useEffect(() => {
    if (!selectedTemplate?.img) return;

    const templateElement = {
      id: Date.now(),
      src: selectedTemplate.img,
      type: "template",

      x: template.x,
      y: template.y,

      width: template.width,
      height: template.height,

      rotation: 0,
      opacity: 1,
    };
    setElements((prev) => {
      // ADDED HERE: Scans the array before appending to see if it's already there
      const exists = prev.some(
        (el) => el.type === "template" && el.src === selectedTemplate.img,
      );

      // ADDED HERE: If it already exists, return the current state unchanged
      if (exists) return prev;

      return [...prev, templateElement];
    });
  }, [selectedTemplate, template]);

  const saveHistory = (elementsState, templateState) => {
    console.log("SAVE HISTORY", elementsState.length);
    const snapshot = {
      elements: structuredClone(elementsState),
      template: structuredClone(templateState),
    };

    const current = historyRef.current[historyIndexRef.current];

    if (current && JSON.stringify(current) === JSON.stringify(snapshot)) {
      return;
    }

    historyRef.current = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );

    historyRef.current.push(snapshot);
    historyIndexRef.current++;

    console.log(
      "HISTORY PUSHED",
      historyRef.current.length,
      historyIndexRef.current,
    );
  };

  const fetchDesign = async () => {
    console.log("FETCH DESIGN CALLED");
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5050/api/cloud-status/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        const designData = res.data.design;
        console.log("DESIGN DATA", designData.design_data);
        setDesign(designData);

        if (designData.design_data) {
          historyRef.current = [];
          historyIndexRef.current = -1;

          setElements(designData.design_data);

          saveHistory(designData.design_data);
        }
      }
    } catch (error) {
      console.log("Fetch error:", error);

      setDesign({
        id: projectId,
        design_id: projectId,
        name: "Shared Design",
      });
    }
  };

  // reusable save function
  const saveDesign = async (updatedElements) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5050/api/designs/${projectId}`,
        {
          name: design.name,
          width: design.width,
          height: design.height,
          type: design.type,
          design_data: updatedElements,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Design saved");
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  // add new shape/photo
  const addElement = (src, type = "shape", position = null) => {
    const isVector = src.includes("data:image/svg+xml") || src.endsWith(".svg");

    const newElement = {
      id: Date.now(),
      name: `${type} ${elements.length + 1}`,
      parentId: null,
      order: elements.length,
      visible: true,
      locked: false,
      src,
      type,
      isVector,

      x: position?.x ?? template.x + template.width / 2 - 50,
      y: position?.y ?? template.y + template.height / 2 - 50,

      width: 100,
      height: 100,

      rotation: 0,
      scaleX: 1,
      scaleY: 1,

      opacity: 1,
      cornerRadius: 0,

      flipX: false,
      flipY: false,

      fillColor: null,
      stroke: null,
      strokeWidth: 0,
      strokeOpacity: 1,

      fills: [],
      strokes: [],

      blendMode: "normal",
    };

    const updatedElements = [...elements, newElement];

    setElements(updatedElements);
    saveDesign(updatedElements);
    saveHistory(updatedElements, template);
  };

  const handleToolChange = (tool) => {
    setActiveTool(tool);
  };
  return (
    <div className="editor">
      <GridCanvas
        activeTool={activeTool}
        elements={elements}
        design={design}
        setElements={setElements}
        saveDesign={saveDesign}
        saveHistory={saveHistory}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        template={template}
        setTemplate={setTemplate}
        addElement={addElement}
      />

      <div className="header-sec">
        <Header
          design={design}
          designId={projectId}
          elements={elements}
          onToolChange={handleToolChange}
          template={template}
          saveHistory={saveHistory}
        />
      </div>

      <SidebarLeft addElements={addElement} saveHistory={saveHistory} templateId={templateId}/>
      <SidebarRight
        elements={elements}
        setElements={setElements}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        template={template}
        setTemplate={setTemplate}
        saveDesign={saveDesign}
        saveHistory={saveHistory}
      />
      <FooterLeft
        elements={elements}
        setElements={setElements}
        template={template}
        setTemplate={setTemplate}
        historyRef={historyRef}
        historyIndexRef={historyIndexRef}
        saveHistory={saveHistory}
      />
      <FooterRight saveHistory={saveHistory} />
    </div>
  );
}
