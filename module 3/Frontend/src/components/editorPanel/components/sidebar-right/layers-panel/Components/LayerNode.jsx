import LayerNodeContainer from "./LayerNodeContainer";

// SVG Asset Imports
import GroupIcon from "../../../../../../assets/editor-panel/layerpannel/group.svg";
import ImageIcon from "../../../../../../assets/editor-panel/layerpannel/image.svg";
import ShapeIcon from "../../../../../../assets/editor-panel/layerpannel/shape.svg";
import EyeOpenIcon from "../../../../../../assets/editor-panel/layerpannel/eye-open.svg";
import EyeCloseIcon from "../../../../../../assets/editor-panel/layerpannel/eye-close.svg";
import LockIcon from "../../../../../../assets/editor-panel/layerpannel/lock.svg";
import UnlockIcon from "../../../../../../assets/editor-panel/layerpannel/unlock.svg";
import RightArrow from "../../../../../../assets/editor-panel/layerpannel/right-arrow.svg"; 
import DownArrow from "../../../../../../assets/editor-panel/layerpannel/down-arrow.svg";

const LayerNode = ({
  node,
  level,
  elements,
  layerState,
  layerActions,
  isHiddenByParent,
  isOver,
}) => {
  const { selectedIds, editingId, tempName, setEditingId, setTempName } =
    layerState;

  const {
    selectLayer,
    toggleVisibility,
    toggleLock,
    toggleGroup,
    renameLayer,
  } = layerActions;

  return (
    <>
      <div
        className={`layer-row ${
          selectedIds.includes(node.id) ? "is-active" : ""
        } ${isOver && node.type === "group" ? "drop-hover" : ""}`}
        style={{
          background: isOver && node.type === "group" ? "#e6f7ff" : "#fff",
          paddingLeft: level * 20,
        }}
        onClick={(e) => selectLayer(node.id, e)}
      >
        <div className="layer-row-left">
          {node.type === "group" ? (
            <button
              className="layer-chevron"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(node.id);
              }}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <img 
                src={node.collapsed ? RightArrow : DownArrow} 
                alt="Toggle Group" 
                className="layer-chevron-icon"
              />
            </button>
          ) : (
            <div className="layer-chevron-spacer" />
          )}

          <span>
            {node.type === "group" ? (
              <img src={GroupIcon} alt="Group" className="layer-svg-icon" />
            ) : node.type === "text" ? (
              <span className="layer-svg-icon font-txt-layer">T</span>
            ) : node.type === "photo" || node.type === "image" ? (
              <img src={ImageIcon} alt="Image" className="layer-svg-icon" />
            ) : (
              <img src={ShapeIcon} alt="Shape" className="layer-svg-icon" />
            )}
          </span>

          {editingId === node.id ? (
            <input
              className="layer-inline-input"
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => renameLayer(node.id, tempName)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="layer-name-text"
              onDoubleClick={() => {
                setEditingId(node.id);
                setTempName(node.name || node.type);
              }}
            >
              {node.name || node.type}
            </span>
          )}
        </div>

        <div className="layer-row-actions">
          <button
            className={`layer-action-btn ${node.visible === false || isHiddenByParent(node, elements) ? "is-dimmed" : ""}`}
            disabled={isHiddenByParent(node, elements)}
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility(node.id);
            }}
          >
            <img 
              src={node.visible === false || isHiddenByParent(node, elements) ? EyeCloseIcon : EyeOpenIcon} 
              alt="Visibility" 
              className="action-svg-icon"
            />
          </button>

          <button
            className="layer-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleLock(node.id);
            }}
          >
            <img 
              src={node.locked ? LockIcon : UnlockIcon} 
              alt="Lock State" 
              className="action-svg-icon"
            />
          </button>
        </div>
      </div>

      {!node.collapsed &&
        (node.children || []).map((child) => (
          <LayerNodeContainer
            key={child.id}
            node={child}
            level={level + 1}
            elements={elements}
            layerState={layerState}
            layerActions={layerActions}
            isHiddenByParent={isHiddenByParent}
          />
        ))}
    </>
  );
};

export default LayerNode;