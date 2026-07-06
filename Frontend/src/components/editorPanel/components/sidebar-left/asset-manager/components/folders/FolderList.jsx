import FolderItem from "./FolderItem";
import Folder from "../../../../../../../assets/editor-panel/assets-panel/folder.svg";
import "./AssetsFolder.css";

function FolderList({
  folders,
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
  return (
    <div className="Assets-folders-list">
      {folders.map((folder, index) => (
        <FolderItem
          key={folder.name}
          folder={folder}
          index={index}
          deleteMode={deleteMode}
          selectedFolders={selectedFolders}
          handleFolderOpen={handleFolderOpen}
          handleFolderSelect={handleFolderSelect}
          activeMenu={activeMenu}
          handleMenuToggle={handleMenuToggle}
          downloadingFolder={downloadingFolder}
          handleDetailsOpen={handleDetailsOpen}
          handleMove={handleMove}
          handleDownloadFolder={handleDownloadFolder}
          handleDelete={handleDelete}
          menuRef={menuRef}
          handleSelectMode={handleSelectMode}
        />
      ))}
    </div>
  );
}

export default FolderList;
