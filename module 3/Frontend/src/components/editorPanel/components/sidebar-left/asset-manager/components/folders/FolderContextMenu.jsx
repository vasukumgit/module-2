import Pencil from "../../../../../../../assets/editor-panel/assets-panel/pencil.svg";
import Details from "../../../../../../../assets/editor-panel/assets-panel/Details.svg";
import Move from "../../../../../../../assets/editor-panel/assets-panel/Move.svg";
import Download from "../../../../../../../assets/editor-panel/assets-panel/download.svg";
import Select from "../../../../../../../assets/editor-panel/assets-panel/Select.svg";
import Delete from "../../../../../../../assets/editor-panel/assets-panel/Delete.svg";

function FolderContextMenu({
  folder,
  downloadingFolder,
  onDetails,
  onMove,
  onDownload,
  onSelect,
  onDelete,
}) {
  return (
    <div className="folder-menu-dropdown" onClick={(e) => e.stopPropagation()}>
      <h3>
        {folder.name}
        <img src={Pencil} alt="Pencil" />
      </h3>

      <p>By Vamika</p>

      <hr />

      <div className="assets-folder-brand-assets-content">
        <h3 onClick={() => onDetails(folder)}>
          <img src={Details} alt="details" />
          Details
        </h3>

        <h3 onClick={() => onMove(folder)}>
          <img src={Move} alt="move" />
          Move
        </h3>

        <h3 onClick={() => onDownload(folder)}>
          <img src={Download} alt="download" />
          {downloadingFolder === folder.name ? "Downloading..." : "Download"}
        </h3>

        <h3 onClick={() => onSelect(folder)}>
          <img src={Select} alt="select" />
          Select
        </h3>

        <h3 onClick={() => onDelete(folder)}>
          <img src={Delete} alt="delete" />
          Delete
        </h3>
      </div>
    </div>
  );
}

export default FolderContextMenu;
