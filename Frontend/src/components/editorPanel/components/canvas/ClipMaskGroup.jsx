import { Group } from "react-konva";
import CanvasNode from "./CanvasNode";
import { getSvgPathString } from "../sidebar-right/layers-panel/Utils/svgUtils";

const ClipMaskGroup = ({
  node,
  elements,
  setElements,
  selectedIds,
  setSelectedIds,
  template,
  saveDesign,
  setCanvasDraggable,
  saveHistory,
}) => {
  console.log("CLIP MASK GROUP RENDERED");
  const maskNode = node.children.find((c) => c.isMask);
  const contentNodes = node.children.filter((c) => !c.isMask);

  if (!maskNode) return null;

  const svg = decodeURIComponent(
    maskNode.src.replace("data:image/svg+xml,", ""),
  );

  const paths = getSvgPathString(svg);


  return (
    // <Group
    //   x={node.x || 0}
    //   y={node.y || 0}
    //   // clipFunc={(ctx) => {
    //   //   ctx.beginPath();
    //   //   ctx.moveTo(50, 0);
    //   //   ctx.lineTo(100, 100);
    //   //   ctx.lineTo(0, 40);
    //   //   ctx.lineTo(100, 40);
    //   //   ctx.lineTo(0, 100);
    //   //   ctx.closePath();
    //   // }}
    //   // clipFunc={(ctx) => {
    //   //   const svg = decodeURIComponent(
    //   //     maskNode.src.replace("data:image/svg+xml,", ""),
    //   //   );

    //   //   const paths = getSvgPathString(svg);

    //   //   ctx.save();

    //   //   ctx.scale(maskNode.width / 63, maskNode.height / 72);

    //   //   paths.forEach((d) => {
    //   //     const p = new Path2D(d);
    //   //     ctx.addPath?.(p); // if supported
    //   //   });

    //   //   ctx.restore();
    //   // }}
    // >
    <Group>
      {contentNodes.map((child) => (
        <CanvasNode
          key={child.id}
          node={child}
          elements={elements}
          setElements={setElements}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          template={template}
          saveDesign={saveDesign}
          setCanvasDraggable={setCanvasDraggable}
          saveHistory={saveHistory}
        />
      ))}

      <CanvasNode
        node={maskNode}
        elements={elements}
        setElements={setElements}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        template={template}
        saveDesign={saveDesign}
        setCanvasDraggable={setCanvasDraggable}
        saveHistory={saveHistory}
      />
    </Group>
    // {/* </Group> */}
  );
};

export default ClipMaskGroup;
