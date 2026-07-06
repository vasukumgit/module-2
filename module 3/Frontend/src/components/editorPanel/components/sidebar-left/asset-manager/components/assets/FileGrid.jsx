import React from "react";
import FileCard from "../common/FileCard";

function FileGrid({
  files,
  isSelected,
  toggleSelection,
  onRename,
  onDelete,
  onMove,
  onDownload,
  onDetails,
  selectionMode,
  setSelectionMode,
}) {
  return (
    <div className="assets-grid">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={isSelected(file.id)}
          toggleSelection={toggleSelection}
          onRename={onRename}
          onDelete={onDelete}
          onMove={onMove}
          onDownload={onDownload}
          onDetails={onDetails}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
        />
      ))}
    </div>
  );
}

export default FileGrid;
