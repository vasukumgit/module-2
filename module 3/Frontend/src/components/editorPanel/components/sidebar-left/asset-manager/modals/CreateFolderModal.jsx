// modals/CreateFolderModal.jsx

import TextField from "@mui/material/TextField";

function CreateFolderModal({
  open,
  folderName,
  onChange,
  onCreate,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="assets-container-popup-overlay">
      <div className="assets-create-folder-popup">
        <h2>Create New Folder</h2>

        <TextField
          className="assets-create-folder-input"
          label="Folder name"
          placeholder="Untitled folder"
          value={folderName}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="assets-create-newfolder-popup-buttons">
          <button
            className="assets-create-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="assets-create-confirm-btn"
            onClick={onCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFolderModal;