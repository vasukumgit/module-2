import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import LayerNode from "./LayerNode";

const LayerNodeContainer = ({
  node,
  level,
  elements,
  layerState,
  layerActions,
  isHiddenByParent,
}) => {
  const {
    setNodeRef: dragRef,
    listeners,
    attributes,
    transform,
  } = useDraggable({
    id: node.id,
  });

  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: node.id,
  });

  const setRefs = (el) => {
    dragRef(el);
    dropRef(el);
  };

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      //   onClick={(e) => selectLayer(node.id, e)}
      //   className={`layer-item ${
      //     selectedIds?.includes(node.id) ? "active" : ""
      //   }`}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <LayerNode
        node={node}
        level={level}
        elements={elements}
        layerState={layerState}
        layerActions={layerActions}
        isHiddenByParent={isHiddenByParent}
        isOver={isOver}
      />
    </div>
  );
};

export default LayerNodeContainer;
