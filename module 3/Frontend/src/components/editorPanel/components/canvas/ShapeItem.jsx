import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Group,
  Image as KonvaImage,
  Transformer,
  Path,
  Line,
  Rect,
  Circle,
  Ellipse,
} from "react-konva";
import useImage from "use-image";
import { getSvgPaths } from "../sidebar-right/layers-panel/Utils/svgUtils";
const hexToRgba = (hex, opacity = 100) => {
  const c = hex.replace("#", "");

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const ShapeItem = ({
  shape,
  template,
  setCanvasDraggable,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(shape.src, "anonymous");

  const [svgContent, setSvgContent] = useState("");
  // const [svgPath, setSvgPath] = useState("");

  useEffect(() => {
    if (!trRef.current || !shapeRef.current) return;

    if (isSelected && !shape.locked) {
      trRef.current.nodes([shapeRef.current]);
    } else {
      trRef.current.nodes([]);
    }

    trRef.current.getLayer()?.batchDraw();
  }, [isSelected, shape.locked]);

  const isDataSVG =
    shape.src?.startsWith("data:image/svg+xml") || shape.src?.endsWith(".svg");

  const isExternalSVG =
    shape.src?.startsWith("https") && shape.src?.includes(".svg");

  const isSVG = isDataSVG || isExternalSVG;
  console.log("IS SVG", shape.name, isSVG);
  useEffect(() => {
    if (!isSVG) return;

    // DATA SVG
    if (isDataSVG) {
      try {
        const decoded = decodeURIComponent(
          shape.src.replace("data:image/svg+xml,", ""),
        );

        setSvgContent(decoded);
      } catch (err) {
        console.log("Data SVG decode error", err);
      }

      return;
    }

    // EXTERNAL SVG
    if (isExternalSVG) {
      fetch(shape.src)
        .then((res) => {
          console.log("FETCH STATUS", res.status);
          return res.text();
        })
        .then((data) => {
          console.log("SVG CONTENT", data);
          setSvgContent(data);
        })
        .catch((err) => {
          console.log("FETCH ERROR", err);
        });
    }
  }, [shape.src, isSVG, isDataSVG, isExternalSVG]);

  const svgPaths = useMemo(() => {
    return svgContent ? getSvgPaths(svgContent) : [];
  }, [svgContent]);

  const hasComplexSvg = useMemo(() => {
    if (!svgContent) return false;

    return (
      svgContent.includes("<linearGradient") ||
      svgContent.includes("<radialGradient") ||
      svgContent.includes("<defs") ||
      svgContent.includes("<mask") ||
      svgContent.includes("<filter") ||
      svgContent.includes("<clipPath")
    );
  }, [svgContent]);
  // console.log("SVG PATHS", svgPaths);
  const svgSize = useMemo(() => {
    if (!svgContent) return { width: 100, height: 100 };

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svg = svgDoc.querySelector("svg");

    const viewBox = svg?.getAttribute("viewBox");

    if (viewBox) {
      const [, , width, height] = viewBox.split(" ").map(Number);

      return { width, height };
    }

    return {
      width: Number(svg?.getAttribute("width")) || 100,
      height: Number(svg?.getAttribute("height")) || 100,
    };
  }, [svgContent]);

  const activeStroke = shape.strokes?.find((s) => s.visible) || null;
  console.log(
    "DRAW IMAGE",
    shape.name,
    shape.x,
    shape.y,
    shape.width,
    shape.height,
  );
  return (
    <>
      {isSVG && !hasComplexSvg ? (
        <Group
          // x={shape.x}
          // y={shape.y}
          x={shape.x + shape.width / 2}
          y={shape.y + shape.height / 2}
          offsetX={svgSize.width / 2}
          offsetY={svgSize.height / 2}
          scaleX={(shape.width / svgSize.width) * (shape.flipX ? -1 : 1)}
          scaleY={(shape.height / svgSize.height) * (shape.flipY ? -1 : 1)}
          rotation={shape.rotation || 0}
          // scaleX={shape.width / svgSize.width}
          // scaleY={shape.height / svgSize.height}
          // scaleX={(shape.scaleX || 1) * (shape.flipX ? -1 : 1)}
          // scaleY={(shape.scaleY || 1) * (shape.flipY ? -1 : 1)}
          opacity={shape.opacity ?? 1}
          draggable={!shape.locked}
          ref={shapeRef}
          listening={!shape.isMask}
          onClick={() => {
            if (shape.locked) return;
            onSelect();
          }}
          onTap={() => {
            if (shape.locked) return;
            onSelect();
          }}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            setCanvasDraggable(false);
          }}
          onDragMove={(e) => {
            onChange({
              ...shape,
              x: e.target.x() - shape.width / 2,
              y: e.target.y() - shape.height / 2,
            });
          }}
          onDragEnd={(e) => {
            setCanvasDraggable(true);

            onChange(
              {
                ...shape,
                x: e.target.x() - shape.width / 2,
                y: e.target.y() - shape.height / 2,
              },
              true,
            );
          }}
        >
          {svgPaths.map((path, index) => {
            const fillLayers =
              shape.fills?.length > 0
                ? [...shape.fills].reverse()
                : [
                    {
                      id: "default",
                      color: null,
                      opacity: 100,
                      visible: true,
                    },
                  ];
            return (
              <React.Fragment key={index}>
                {fillLayers.map((fillLayer) => {
                  if (!fillLayer.visible) return null;
                  // console.log("PATH:", path);
                  const activeStroke = shape.strokes?.find((s) => s.visible);

                  const fillColor =
                    fillLayer.color ??
                    (path.fill === "none" ? undefined : path.fill);

                  const fillOpacity = fillLayer.opacity ?? 100;

                  const strokeColor =
                    activeStroke?.color ??
                    (path.stroke === "currentColor" ? "#000" : path.stroke);

                  const strokeWidth =
                    activeStroke?.width ?? Number(path.strokeWidth) ?? 1;
                  // console.log("Path type", path.type);

                  console.log("ACTIVE STROKE", activeStroke);
                  console.log("STROKE COLOR", strokeColor);
                  console.log("STROKE WIDTH", strokeWidth);
                  console.log("PATH", path);

                  if (path.type === "path") {
                    return (
                      <Path
                        key={`${index}-${fillLayer.id}`}
                        data={path.data}
                        fill={
                          fillColor
                            ? hexToRgba(fillColor, fillOpacity)
                            : undefined
                        }
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        globalCompositeOperation={
                          shape.globalCompositeOperation || "source-over"
                        }
                      />
                    );
                  }

                  // POLYGON
                  if (path.type === "polygon") {
                    const points = path.points.trim().split(/\s|,/).map(Number);

                    return (
                      <Line
                        key={`${index}-${fillLayer.id}`}
                        points={points}
                        closed
                        fill={
                          fillColor
                            ? hexToRgba(fillColor, fillOpacity)
                            : undefined
                        }
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        globalCompositeOperation={
                          shape.globalCompositeOperation || "source-over"
                        }
                      />
                    );
                  }

                  // POLYLINE
                  if (path.type === "polyline") {
                    const points = path.points.trim().split(/\s|,/).map(Number);

                    return (
                      <Line
                        key={`${index}-${fillLayer.id}`}
                        points={points}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        lineJoin="round"
                        lineCap="round"
                        globalCompositeOperation={
                          shape.globalCompositeOperation || "source-over"
                        }
                      />
                    );
                  }

                  if (path.type === "rect") {
                    return (
                      <Rect
                        key={`${index}-${fillLayer.id}`}
                        x={Number(path.x)}
                        y={Number(path.y)}
                        width={Number(path.width)}
                        height={Number(path.height)}
                        cornerRadius={Number(path.rx) || 0}
                        fill={
                          fillColor
                            ? hexToRgba(fillColor, fillOpacity)
                            : undefined
                        }
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        globalCompositeOperation={
                          shape.globalCompositeOperation || "source-over"
                        }
                      />
                    );
                  }
                  // Circle
                  console.log("paths", path);
                  if (path.type === "circle") {
                    return (
                      <Circle
                        key={`${index}-${fillLayer.id}`}
                        x={Number(path.cx)}
                        y={Number(path.cy)}
                        radius={Number(path.r)}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        globalCompositeOperation={
                          shape.globalCompositeOperation || "source-over"
                        }
                        fill={
                          fillColor
                            ? hexToRgba(fillColor, fillOpacity)
                            : undefined
                        }
                      />
                    );
                  }
                  // ELLIPSE
                  if (path.type === "ellipse") {
                    return (
                      <Ellipse
                        key={`${index}-${fillLayer.id}`}
                        x={Number(path.cx)}
                        y={Number(path.cy)}
                        radiusX={Number(path.rxEllipse)}
                        radiusY={Number(path.ryEllipse)}
                        fill={
                          fillColor
                            ? hexToRgba(fillColor, fillOpacity)
                            : undefined
                        }
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        globalCompositeOperation={
                          shape.globalCompositeOperation || "source-over"
                        }
                      />
                    );
                  }
                  //Line
                  if (path.type === "line") {
                    const x1 = Number(path.x1);
                    const y1 = Number(path.y1);
                    const x2 = Number(path.x2);
                    const y2 = Number(path.y2);

                    const isTiny =
                      Math.abs(x2 - x1) < 0.5 && Math.abs(y2 - y1) < 0.5;

                    // tiny line → render dot
                    if (isTiny) {
                      return (
                        <Circle
                          key={`${index}-${fillLayer.id}`}
                          x={x1}
                          y={y1}
                          radius={1.2}
                          fill={strokeColor}
                          // stroke={strokeColor}
                          // strokeWidth={strokeWidth}
                          globalCompositeOperation={
                            shape.globalCompositeOperation || "source-over"
                          }
                        />
                      );
                    }
                    return (
                      <Line
                        // key={`${index}-${fillLayer.id}`}
                        points={[
                          Number(path.x1),
                          Number(path.y1),
                          Number(path.x2),
                          Number(path.y2),
                        ]}
                        //  fill={hexToRgba(
                        //         fillLayer.color,
                        //         fillLayer.opacity || 100,
                        //       )}
                        // fill={
                        //   fillColor
                        //     ? hexToRgba(fillColor, fillOpacity)
                        //     : undefined
                        // }
                        // stroke={strokeColor}
                        // strokeWidth={strokeWidth}
                      />
                    );
                  }

                  return null;
                })}
              </React.Fragment>
            );
          })}
        </Group>
      ) : (
        <KonvaImage
          ref={shapeRef}
          image={image}
          x={shape.x + shape.width / 2}
          y={shape.y + shape.height / 2}
          width={shape.width}
          height={shape.height}
          perfectDrawEnabled={false}
          rotation={shape.rotation || 0}
          offsetX={shape.width / 2}
          offsetY={shape.height / 2}
          // scaleX={shape.scaleX || 1}
          // scaleY={shape.scaleY || 1}
          scaleX={(shape.scaleX || 1) * (shape.flipX ? -1 : 1)}
          scaleY={(shape.scaleY || 1) * (shape.flipY ? -1 : 1)}
          opacity={shape.opacity ?? 1}
          cornerRadius={shape.cornerRadius || 0}
          draggable={!shape.locked}
          stroke={shape.strokes?.find((s) => s.visible)?.color || "transparent"}
          strokeWidth={shape.strokes?.find((s) => s.visible)?.width || 0}
          globalCompositeOperation={
            shape.globalCompositeOperation || "source-over"
          }
          onClick={() => {
            if (shape.locked) return;
            onSelect();
          }}
          onTap={() => {
            if (shape.locked) return;
            onSelect();
          }}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            setCanvasDraggable(false);
          }}
          onDragStart={(e) => {
            e.cancelBubble = true;
            setCanvasDraggable(false);
          }}
          onDragMove={(e) => {
            const node = e.target;

            let newX = node.x();
            let newY = node.y();

            onChange({
              ...shape,
              fillColor: shape.fillColor,
              fills: shape.fills,
              x: node.x() - shape.width / 2,
              y: node.y() - shape.height / 2,
            });
          }}
          onDragEnd={(e) => {
            setTimeout(() => {
              setCanvasDraggable(true);
            }, 0);

            onChange(
              {
                ...shape,
                fillColor: shape.fillColor,
                fills: shape.fills,
                x: e.target.x() - shape.width / 2,
                y: e.target.y() - shape.height / 2,
              },
              true,
            );
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            const newWidth = Math.abs(node.width() * scaleX);
            const newHeight = Math.abs(node.height() * scaleY);

            onChange(
              {
                ...shape,
                fillColor: shape.fillColor,
                fills: shape.fills,
                x: node.x() - newWidth / 2,
                y: node.y() - newHeight / 2,
                width: newWidth,
                height: newHeight,
                rotation: node.rotation(),
                scaleX: scaleX < 0 ? -1 : 1,
                scaleY: scaleY < 0 ? -1 : 1,
              },
              true,
            );

            node.scaleX(scaleX < 0 ? -1 : 1);
            node.scaleY(scaleY < 0 ? -1 : 1);
          }}
        />
      )}

      {isSelected && !shape.locked && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          anchorSize={12}
          borderStrokeWidth={2}
          ignoreStroke={true}
          boundBoxFunc={(oldBox, newBox) => {
            return {
              ...newBox,
              width: Math.abs(newBox.width),
              height: Math.abs(newBox.height),
            };
          }}
        />
      )}
    </>
  );
};

export default ShapeItem;
