import React from "react";

function DeleteFolderModal({
  open,
  onClose,
  onConfirm,
  selectedCount = 1,
}) {
  if (!open) return null;

  return (
    <div className="assets-container-popup-overlay">
      <div className="delete-popup-container">
        <div className="delete-popup-icon">🗑️</div>

        <h2>
          Delete {selectedCount}{" "}
          {selectedCount === 1 ? "folder" : "folders"}?
        </h2>

        <p>
          This item will be permanently deleted and cannot be
          restored beyond this point.
        </p>

        <div className="delete-popup-buttons">
          <button
            className="delete-popup-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="delete-popup-confirm-btn"
            onClick={onConfirm}
          >
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFolderModal;