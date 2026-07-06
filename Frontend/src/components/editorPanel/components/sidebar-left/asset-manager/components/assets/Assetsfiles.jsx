import React, { useState, useRef, useEffect } from "react";
import "./Assetsfiles.css";
import plus from "../../../../../../../assets/editor-panel/assets-panel/plus.png";

//Modifications
import { useFiles } from "../../hooks/useFiles";
import { useFileSelection } from "../../hooks/useFileSelection";
import FileGrid from "./FileGrid";
import FileDetails from "./FileDetails";
import MoveFileModal from "./MoveFileModal";
import SelectionFooter from "../common/SelectionFooter";
import UploadButton from "../common/UploadButton";
import DetailsHeader from "../common/DetailsHeader";

function Assetsfiles({ onClose, setCurrentView, setSelectedFile }) {
  const [showMovePopup, setShowMovePopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);

  // modifications
  const {
    files,
    addFile,
    renameFile,
    deleteFiles,
    moveFile,
    downloadFile,
    getFile,
  } = useFiles();
  const { selectedFiles, toggleSelection, clearSelection, isSelected } =
    useFileSelection();

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedFiles]);

  // Add assets
  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    addFile({
      id: Date.now(),
      name: file.name.split(".")[0],

      type: file.name.split(".").pop(),

      image: imageUrl,

      createdBy: "Vamika",

      folder: "Uploads",

      folderId: 1,

      size: `${Math.round(file.size / 1024)} KB`,

      dimensions: "Unknown",

      createdAt: new Date().toLocaleDateString(),

      modifiedAt: new Date().toLocaleDateString(),
    });
  };

  // move function
  const handleMoveClick = (item) => {
    setSelectedAsset(item);
    setShowMovePopup(true);
  };

  const handleFolderSelect = (targetFolderId) => {
    moveFile(selectedAsset.id, targetFolderId);

    setShowMovePopup(false);
  };

  const handleOpenDetails = (fileId) => {
    const file = getFile(fileId);

    if (!file) return;

    setSelectedFile(file);

    setCurrentView("file-details");
  };

  // Handle multiple select delete
  const handleDeleteSelected = () => {
    deleteFiles(selectedFiles);

    clearSelection();
  };

  return (
    <div className="files-content-wrapper">
      {!showMovePopup ? (
        <>
          <UploadButton onUpload={handleUpload} />

          <FileGrid
            files={files}
            isSelected={isSelected}
            toggleSelection={toggleSelection}
            onRename={renameFile}
            onDelete={deleteFiles}
            onMove={handleMoveClick}
            onDownload={downloadFile}
            onDetails={handleOpenDetails}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
          />

          {selectedFiles.length > 0 && (
            <SelectionFooter
              selectedCount={selectedFiles.length}
              onClear={clearSelection}
              onDelete={handleDeleteSelected}
            />
          )}
        </>
      ) : (
        <MoveFileModal
          files={files}
          onClose={() => setShowMovePopup(false)}
          onFolderSelect={handleFolderSelect}
        />
      )}
    </div>
  );
}
export default Assetsfiles;
