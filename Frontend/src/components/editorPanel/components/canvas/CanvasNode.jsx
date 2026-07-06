// CanvasNode.jsx

import ShapeItem from "./ShapeItem";
import ClipMaskGroup from "./ClipMaskGroup";

const CanvasNode = ({
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
  const isGroup = node.type === "group";

  if (node.visible === false) {
    return null;
  }

  if (node.type === "group" && node.clip) {
    return (
      <ClipMaskGroup
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

  console.log(node.name, node.visible);

  return (
    <>
      {!isGroup && (
        <ShapeItem
          // key={shape.id}
          shape={node}
          template={template}
          setCanvasDraggable={setCanvasDraggable}
          isSelected={selectedIds?.includes(node.id)}
          onSelect={() => {
            setSelectedIds((prev) => {
              const current = prev || [];

              return current.includes(node.id)
                ? current.filter((id) => id !== node.id)
                : [...current, node.id];
            });
          }}
          // onChange={(newAttrs) => {
          //   console.log("UPDATED FROM CANVAS:", newAttrs);
          //   const updated = [...elements];

          //   updated[index] = {
          //     ...elements[index], // keep old values (IMPORTANT)
          //     ...newAttrs, // apply only changed values
          //   };
          //   setElements(updated);
          //   saveDesign(updated);
          // }}
          onChange={(newAttrs, commit = false) => {
            const updated = elements.map((el) =>
              el.id === node.id
                ? {
                    ...el,
                    ...newAttrs,
                  }
                : el,
            );

            setElements(updated);

            if (commit) {
              saveDesign(updated);
              saveHistory(updated, template);
            }
          }}
        />
      )}

      {node.children?.map((child) => (
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
    </>
  );
};

export default CanvasNode;
