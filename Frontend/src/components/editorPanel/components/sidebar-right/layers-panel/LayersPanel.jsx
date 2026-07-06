import { useState, useEffect } from "react";

// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";
import "./LayersPanel.css";

import Eye from "../../../../../assets/editor-panel/properties/solar_eye_linear.svg";
import Closed from "../../../../../assets/editor-panel/close.svg";
import ExportIcon from "../../../../../assets/editor-panel/layerpannel/export.svg";
import MergeIcon from "../../../../../assets/editor-panel/layerpannel/merge.svg";
import ClipIcon from "../../../../../assets/editor-panel/layerpannel/clip.svg";
import DeleteIcon from "../../../../../assets/editor-panel/layerpannel/delete.svg";
import LayerNodeContainer from "./Components/LayerNodeContainer";
import { buildTree } from "./Utils/buildTree";
import { isChildOf } from "./Utils/isChildOf";
import { normalizeOrders } from "./Utils/normalizeOrders";
import { toggleVisibility } from "./Utils/toggleVisibility";
import { toggleLock } from "./Utils/toggleLock";
import { renameLayer } from "./Utils/renameLayer";
import { selectLayer } from "./Utils/selectLayer";
import { groupSelected } from "./Utils/groupSelected";
import { ungroup } from "./Utils/ungroup";
import { isHiddenByParent } from "./Utils/isHiddenByParent";
import { moveLayerOrder } from "./Utils/moveLayerOrder";
import { duplicateSelected } from "./Utils/duplicateSelected";
import { createClipGroup } from "./Utils/createClipGroup";

const LayersPanel = ({
  elements,
  setElements,
  selectedIds,
  setSelectedIds,
  template,
  setLayers,
  layers,
  saveDesign,
  saveHistory,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const { setNodeRef: setRootRef, isOver } = useDroppable({
    id: "root",
  });

  // console.log("ROOT OVER", isOver);

  useEffect(() => {
    // console.log("ELEMENTS CHANGED", elements);
  }, [elements]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        handleGroupSelected();
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "g") {
        e.preventDefault();

        handleUngroup();
      }

      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleDuplicate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, elements]);

  if (!elements) return null;
  if (!layers) return null;

  // =========================
  // SELECT LAYER
  // =========================

  const handleSelectLayer = (id, e) => {
    const item = elements.find((el) => el.id === id);

    if (item?.locked) return;

    selectLayer(selectedIds, setSelectedIds, id, e);
  };

  // =========================
  // RENAME
  // =========================

  const handleRenameLayer = (id, value) => {
    const updated = renameLayer(elements, id, value);

    setElements(normalizeOrders(updated));
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // console.log("ACTIVE", active);
    // console.log("OVER", over);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    // console.log("ACTIVE ID", activeId);
    // console.log("OVER ID", overId);

    if (overId === "root") {
      const updated = elements.map((el) =>
        el.id === activeId
          ? {
              ...el,
              parentId: null,
            }
          : el,
      );

      setElements(normalizeOrders(updated));
      saveHistory(normalizeOrders(updated), template);
      saveDesign(normalizeOrders(updated));
      return;
    }
    if (activeId === overId) return;

    const activeItem = elements.find((el) => el.id === activeId);
    const overItem = elements.find((el) => el.id === overId);

    if (!activeItem || !overItem) return;
    // console.log("ACTIVE", activeItem);
    // console.log("OVER", overItem);

    // console.log("CHECK", isChildOf(overItem.id, activeItem.id, elements));
    // console.log(
    //   "ELEMENTS",
    //   elements.map((el) => ({
    //     id: el.id,
    //     parentId: el.parentId,
    //     type: el.type,
    //     name: el.name,
    //   })),
    // );
    // Prevent group dropping on itself
    if (activeItem.type === "group" && activeItem.id === overItem.id) {
      return;
    }

    // Prevent group dropping into its own child
    if (
      activeItem.type === "group" &&
      isChildOf(overItem.id, activeItem.id, elements)
    ) {
      console.log("Invalid drop prevented");
      return;
    }

    let updated = [...elements];

    // CASE 1: DROP INTO GROUP
    if (overItem.type === "group") {
      updated = updated.map((el) =>
        el.id === activeId ? { ...el, parentId: overItem.id } : el,
      );

      setElements(normalizeOrders(updated));
      saveHistory(normalizeOrders(updated), template);
      saveDesign(normalizeOrders(updated));
      return;
    }

    // CASE 2: SAME PARENT REORDER (FIXED PROPERLY)
    const sameParent = activeItem.parentId === overItem.parentId;

    if (sameParent) {
      const parentId = activeItem.parentId;

      const siblings = updated
        .filter((el) => el.parentId === parentId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const activeIndex = siblings.findIndex((el) => el.id === activeId);

      const overIndex = siblings.findIndex((el) => el.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      const moved = siblings.splice(activeIndex, 1)[0];
      siblings.splice(overIndex, 0, moved);

      // 👇 IMPORTANT: update ORDER properly
      siblings.forEach((item, index) => {
        item.order = index;
      });

      updated = updated.map((el) => {
        const updatedItem = siblings.find((s) => s.id === el.id);
        return updatedItem || el;
      });

      setElements(normalizeOrders(updated));
      saveHistory(normalizeOrders(updated), template);
      saveDesign(normalizeOrders(updated));
      return;
    }

    // CASE 3: MOVE BETWEEN GROUPS
    updated = updated.map((el) =>
      el.id === activeId
        ? {
            ...el,
            parentId: overItem.parentId,
          }
        : el,
    );

    setElements(normalizeOrders(updated));
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };
  // =========================
  // TOGGLE VISIBILITY
  // =========================
  const handleToggleVisibility = (id) => {
    const item = elements.find((el) => el.id === id);
    if (!item) return;

    const updated = toggleVisibility(elements, id);

    setElements(normalizeOrders(updated));
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };

  const handleToggleLock = (id) => {
    const updated = toggleLock(elements, id);

    setElements(normalizeOrders(updated));
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };

  const toggleGroup = (id) => {
    const updated = elements.map((el) =>
      el.id === id
        ? {
            ...el,
            collapsed: !el.collapsed,
          }
        : el,
    );

    setElements(normalizeOrders(updated));
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };
  // =========================
  // DELETE
  // =========================
  const getChildrenIds = (id, elements) => {
    let ids = [id];

    elements.forEach((el) => {
      if (el.parentId === id) {
        ids.push(...getChildrenIds(el.id, elements));
      }
    });

    return ids;
  };

  const deleteSelected = () => {
    const idsToDelete = selectedIds.flatMap((id) =>
      getChildrenIds(id, elements),
    );

    const updated = elements.filter((el) => !idsToDelete.includes(el.id));

    setElements(normalizeOrders(updated));
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
    setSelectedIds([]);
  };

  const handleGroupSelected = () => {
    const updated = groupSelected(elements, selectedIds);

    setElements(updated);
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };

  const handleUngroup = () => {
    const updated = ungroup(elements, selectedIds);

    setElements(updated);
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
    setSelectedIds([]);
  };
  const handleMoveLayer = (direction) => {
    const updated = moveLayerOrder(elements, selectedIds, direction);

    setElements(updated);
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
  };
  const handleDuplicate = () => {
    const result = duplicateSelected(elements, selectedIds);

    setElements(result.elements);
    saveHistory(normalizeOrders(updated), template);
    saveDesign(normalizeOrders(updated));
    setSelectedIds(result.selectedIds);
  };

  const handleClip = () => {
    const updated = createClipGroup(elements, selectedIds);
    console.log("UPDATED", updated);
    setElements(updated);
    saveHistory(normalizeOrders(updated), template);
  };
  const layerActions = {
    selectLayer: handleSelectLayer,
    toggleVisibility: handleToggleVisibility,
    toggleLock: handleToggleLock,
    toggleGroup,
    renameLayer: handleRenameLayer,
  };

  const layerState = {
    selectedIds,
    editingId,
    tempName,
    setEditingId,
    setTempName,
  };

  const tree = buildTree(elements);
  console.log("TREE", JSON.stringify(tree, null, 2));
  // console.log("First Element:", elements[0]);
  // console.log("All Elements:", elements);
  return (
    <div className="layers-panel">
      {/* HEADER */}
      <div className="layers-panel-header">
        <span>Layers</span>

        <span className="close" onClick={() => setLayers(false)}>
          <img src={Closed} alt="" />
        </span>
      </div>

      {/* BODY */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="layers-panel-body" ref={setRootRef}>
          {tree.map((node, index) => (
            <LayerNodeContainer
              key={node.id}
              node={node}
              level={0}
              elements={elements}
              layerState={layerState}
              layerActions={layerActions}
              isHiddenByParent={isHiddenByParent}
            />
          ))}
        </div>
      </DndContext>

      <div className="layer-footer">
        {/* FRONTEND DESIGN */}
        <button
          className="footer-action-btn"
          onClick={() => console.log("export")}
          title="Export Layers"
        >
          <img src={ExportIcon} alt="Export" className="footer-svg-icon" />
        </button>

        <button
          className="footer-action-btn"
          onClick={() => console.log("merge")}
          title="Merge Layers"
        >
          <img src={MergeIcon} alt="Merge" className="footer-svg-icon" />
        </button>

        <button
          className="footer-action-btn"
          onClick={handleClip}
          title="Clip Mask"
        >
          <img src={ClipIcon} alt="Clip" className="footer-svg-icon" />
        </button>

        <button
          className="footer-action-btn"
          onClick={deleteSelected}
          title="Delete Selected"
        >
          <img src={DeleteIcon} alt="Delete" className="footer-svg-icon" />
        </button>
      </div>
    </div>
  );
};

export default LayersPanel;
