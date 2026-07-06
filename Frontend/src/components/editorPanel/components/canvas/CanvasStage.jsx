import React, { useRef, useState, useEffect, useMemo } from "react";
import { isVisible } from "../../components/sidebar-right/layers-panel/Utils/isVisible";
import { buildTree } from "../sidebar-right/layers-panel/Utils/buildTree";
import ShapeItem from "./ShapeItem";
import CanvasNode from "./CanvasNode";
import ClipMaskGroup from "./ClipMaskGroup";
import { getSvgPaths } from "../sidebar-right/layers-panel/Utils/svgUtils";
import {
  Stage,
  Layer,
  Line,
  Circle,
  Ellipse,
  Rect,
  Image as KonvaImage,
  // Rect,
  Transformer,
  Group,
  Path,
} from "react-konva";
import useImage from "use-image";
import Konva from "konva";

const SMALL_GRID = 10;
const LARGE_GRID = 50;
const STAGE_SIZE = 10000;

const extractPaths = (svgText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");

  return Array.from(doc.querySelectorAll("path")).map((p) =>
    p.getAttribute("d"),
  );
};

const GridCanvas = ({
  elements,
  design,
  setElements,
  saveDesign,
  saveHistory,
  selectedIds,
  setSelectedIds,
  template,
  setTemplate,
  addElement,
}) => {
  const stageRef = useRef();
  const transformerRef = useRef();
  const nodeRefs = useRef({});
  const [scale, setScale] = useState(1);
  const [canvasDraggable, setCanvasDraggable] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 5000,
    y: window.innerHeight / 2 - 5000,
  });
  const [canvasOffset, setCanvasOffset] = useState({
    x: 0,
    y: 0,
  });

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  const renderGrid = () => {
    const lines = [];

    for (let i = 0; i < STAGE_SIZE / SMALL_GRID; i++) {
      const pos = i * SMALL_GRID;
      const isMajor = pos % LARGE_GRID === 0;

      lines.push(
        <Line
          key={"v" + i}
          points={[pos, 0, pos, STAGE_SIZE]}
          stroke={isMajor ? "#d7ddea" : "#e0e8f6"}
          strokeWidth={isMajor ? 1.2 : 0.5}
        />,
      );

      lines.push(
        <Line
          key={"h" + i}
          points={[0, pos, STAGE_SIZE, pos]}
          stroke={isMajor ? "#d7ddea" : "#e0e8f6"}
          strokeWidth={isMajor ? 1.2 : 0.5}
        />,
      );
    }

    return lines;
  };

  const tree = buildTree(elements);
  console.log("FULL TREE:", JSON.stringify(tree, null, 2));

  // console.log("ELEMENTS", elements);
  const handleSelect = (id) => {
    setSelectedIds([id]);

    const node = nodeMapRef.current[id];

    if (node && transformerRef.current) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer().batchDraw();
    }
  };
  return (
    <div
      className="canvas-container"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={async (e) => {
        e.preventDefault();

        const stage = stageRef.current;

        if (!stage) return;

        // IMPORTANT
        stage.setPointersPositions(e);

        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const shapeSrc = e.dataTransfer.getData("shapeSrc");
        const photoSrc = e.dataTransfer.getData("photoSrc");
        const chartItemData = e.dataTransfer.getData("chartItem");

        const chartItem = chartItemData ? JSON.parse(chartItemData) : null;
        let src = shapeSrc || photoSrc || chartItem?.image;

        if (!src) return;

        if (src.startsWith("http") && src.includes(".svg")) {
          try {
            const response = await fetch(src);
            const svgText = await response.text();

            src = "data:image/svg+xml," + encodeURIComponent(svgText);
          } catch (err) {
            console.log("SVG convert error", err);
          }
        }

        const size = 100;

        // PERFECT FIGMA POSITION
        const x = (pointer.x - stage.x()) / stage.scaleX() - size / 2;

        const y = (pointer.y - stage.y()) / stage.scaleY() - size / 2;

        const isVector =
          src.includes("data:image/svg+xml") || src.endsWith(".svg");

        let svgPaths = [];

        if (isVector) {
          try {
            let svgText = "";

            if (src.startsWith("data:image/svg+xml")) {
              svgText = decodeURIComponent(src.split(",")[1]);
            } else {
              const response = await fetch(src);
              svgText = await response.text();
            }

            svgPaths = getSvgPaths(svgText);
            // console.log("SVG PATHS", svgPaths);
          } catch (err) {
            console.log("SVG parse error", err);
          }
        }

        addElement(src, shapeSrc ? "shape" : "photo", {
          x,
          y,
        });
      }}
    >
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={canvasDraggable}
        ref={stageRef}
        onWheel={handleWheel}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedIds([]);
            setSelectedTemplate(false);
          }
        }}
        // onDragStart={(e) => {
        //   e.cancelBubble = true;
        //   setCanvasDraggable(false);
        // }}
        // onDragEnd={(e) => {
        //   setCanvasDraggable(false);
        // }}
      >
        <Layer>
          {renderGrid()}

          {/* white template */}
          <Rect
            x={template.x}
            y={template.y}
            width={template.width}
            height={template.height}
            fill="white"
            stroke={selectedTemplate ? "#3b82f6" : "#d1d5db"}
            strokeWidth={selectedTemplate ? 2 : 1}
            draggable={selectedTemplate}
            onClick={() => {
              setSelectedTemplate(true);
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              setCanvasDraggable(false);
            }}
            onDragMove={(e) => {
              const newX = e.target.x();
              const newY = e.target.y();

              setTemplate((prevTemplate) => {
                const dx = newX - prevTemplate.x;
                const dy = newY - prevTemplate.y;

                setElements((prevElements) =>
                  prevElements.map((shape) => ({
                    ...shape,
                    x: shape.x + dx,
                    y: shape.y + dy,
                  })),
                );

                return {
                  ...prevTemplate,
                  x: newX,
                  y: newY,
                };
              });
            }}
            onDragEnd={() => {
              console.log("ARTBOARD DRAG END");
              setCanvasDraggable(true);

              const finalTemplate = {
                ...template,
                x: e.target.x(),
                y: e.target.y(),
              };
              saveDesign(elements);
              saveHistory(elements, finalTemplate);
            }}
          />

          {/* render shapes */}

          <Group>
            {tree.map((node) => {
              console.log("NODE:", node.id, "CLIP:", node.clip);
              if (node.type === "group" && node.clip) {
                return (
                  <ClipMaskGroup
                    key={node.id}
                    node={node}
                    elements={elements}
                    setElements={setElements}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    template={template}
                    saveDesign={saveDesign}
                    setCanvasDraggable={setCanvasDraggable}
                    saveHistory={saveHistory}
                  />
                );
              }

              return (
                <CanvasNode
                  key={node.id}
                  node={node}
                  elements={elements}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  setElements={setElements}
                  template={template}
                  saveDesign={saveDesign}
                  setCanvasDraggable={setCanvasDraggable}
                  saveHistory={saveHistory}
                />
              );
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default GridCanvas;
