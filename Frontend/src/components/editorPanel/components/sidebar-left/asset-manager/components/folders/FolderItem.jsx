import Folder from "../../../../../../../assets/editor-panel/assets-panel/folder.svg";
import threedots from "../../../../../../../assets/editor-panel/assets-panel/threedots.png";
import FolderContextMenu from "./FolderContextMenu";

function FolderItem({
  folder,
  index,

  deleteMode,
  selectedFolders,

  handleFolderOpen,
  handleFolderSelect,

  activeMenu,
  handleMenuToggle,

  downloadingFolder,

  handleDetailsOpen,
  handleMove,
  handleDownloadFolder,
  handleDelete,
  menuRef,
  handleSelectMode
}) {
  if (!folder) return null;

  return (
    <div
      className="assets-folder-row"
      onClick={() => {
        if (!deleteMode) {
          handleFolderOpen(folder);
        }
      }}
    >
      <div className="assets-folder-left">
        {deleteMode && (
          <input
            type="checkbox"
            checked={selectedFolders.includes(folder.name)}
            onChange={() => handleFolderSelect(folder.name)}
          />
        )}

        <img src={Folder} alt="folder" />

        <div className="folder-text">
          <h4>{folder.name}</h4>

          <p>
            {folder.items?.length || 0}{" "}
            {(folder.items?.length || 0) === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="folder-menu-wrapper">
        <button
          className="folder-three-dots"
          onClick={(e) => handleMenuToggle(e, index)}
        >
          <img src={threedots} alt="" />
        </button>

        {activeMenu === index && (
          <div ref={menuRef}>
            <FolderContextMenu
              folder={folder}
              downloadingFolder={downloadingFolder}
              onDetails={handleDetailsOpen}
              onMove={handleMove}
              onDownload={handleDownloadFolder}
              onSelect={handleSelectMode}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderItem;
