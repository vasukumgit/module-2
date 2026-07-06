import React, { useState, useRef, useEffect } from "react";
import CreateFolder from "../../../../../../../assets/editor-panel/assets-panel/createfolder.svg";
import "./AssetsFolder.css";

import FolderList from "./FolderList";

import CreateFolderModal from "../../modals/CreateFolderModal";
import DeleteFolderModal from "../../modals/DeleteFolderModal";
import MoveFolderModal from "../../modals/MoveFolderModal";

import { useFolders } from "../../hooks/useFolders";

function AssetsFolder({
  setCurrentView,
  setSelectedFolder,
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);

  const [showMovePopup, setShowMovePopup] = useState(false);
  const [movingFolder, setMovingFolder] = useState(null);
  const [targetFolder, setTargetFolder] = useState(null);

  const [downloadingFolder, setDownloadingFolder] =
    useState(null);

  const [folderName, setFolderName] = useState("");

  const menuRef = useRef(null);

  const {
    folders,
    createFolder,
    folderOpen,
    deleteFolders,
    moveFolder,
    downloadFolder,
  } = useFolders();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // Folder Navigation
  // =========================

  const handleFolderOpen = (folder) => {
    const latestFolder = folderOpen(folder);

    setSelectedFolder(latestFolder);

    setCurrentView("folder-content");
  };

  const handleDetailsOpen = (folder) => {
    setSelectedFolder(folder);

    setCurrentView("folder-details");

    setActiveMenu(null);
  };

  // =========================
  // Folder Actions
  // =========================

  const handleMove = (folder) => {
    setMovingFolder(folder);

    setTargetFolder(null);

    setShowMovePopup(true);

    setActiveMenu(null);
  };

  const handleDelete = (folder) => {
    setDeleteMode(true);

    setSelectedFolders([folder.name]);

    setActiveMenu(null);
  };

  const handleDownloadFolder = async (folder) => {
    setDownloadingFolder(folder.name);

    await downloadFolder(folder);

    setDownloadingFolder(null);
  };

  // =========================
  // Create Folder
  // =========================

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleCreateFolder = () => {
    if (!folderName.trim()) return;

    createFolder(folderName);

    setFolderName("");

    setShowPopup(false);
  };

  // =========================
  // Menu
  // =========================

  const handleMenuToggle = (e, index) => {
    e.stopPropagation();

    setActiveMenu(
      activeMenu === index ? null : index
    );
  };

  // =========================
  // Selection
  // =========================

  const handleFolderSelect = (folderName) => {
    if (selectedFolders.includes(folderName)) {
      setSelectedFolders(
        selectedFolders.filter(
          (item) => item !== folderName
        )
      );
    } else {
      setSelectedFolders([
        ...selectedFolders,
        folderName,
      ]);
    }
  };

  const handleSelectMode = (folder) => {
    setDeleteMode(true);

    setSelectedFolders([folder.name]);

    setActiveMenu(null);
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);

    setSelectedFolders([]);
  };

  // =========================
  // Delete
  // =========================

  const handleDeleteFolders = () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    deleteFolders(selectedFolders);

    setSelectedFolders([]);

    setDeleteMode(false);

    setShowDeletePopup(false);
  };

  // =========================
  // Move
  // =========================

  const handleMoveFolder = () => {
    moveFolder(movingFolder, targetFolder);

    setShowMovePopup(false);

    setMovingFolder(null);

    setTargetFolder(null);
  };

  return (
    <div className="folder-content-wrapper">
      {/* Create Folder Modal */}

      {showPopup && (
        <CreateFolderModal
          open={showPopup}
          folderName={folderName}
          onChange={setFolderName}
          onCreate={handleCreateFolder}
          onClose={handlePopupClose}
        />
      )}

      {/* Delete Modal */}

      {showDeletePopup && (
        <DeleteFolderModal
          open={showDeletePopup}
          selectedCount={selectedFolders.length}
          onClose={() =>
            setShowDeletePopup(false)
          }
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Move Modal */}

      {showMovePopup && (
        <MoveFolderModal
          open={showMovePopup}
          folders={folders}
          movingFolder={movingFolder}
          targetFolder={targetFolder}
          setTargetFolder={setTargetFolder}
          onMove={handleMoveFolder}
          onClose={() => {
            setShowMovePopup(false);
            setMovingFolder(null);
            setTargetFolder(null);
          }}
        />
      )}

      {/* Create Folder Row */}

      <div
        className="assets-createnew-folder-row"
        onClick={handlePopupOpen}
      >
        <div className="create-folder-icon">
          <img src={CreateFolder} alt="Create" />
        </div>

        <p className="assets-new-folder-create">
          Create Folder
        </p>
      </div>

      {/* Folder List */}

      <FolderList
        folders={folders}
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

      {/* Delete Footer */}

      {deleteMode && (
        <div className="delete-footer-buttons">
          <button
            className="delete-cancel-btn"
            onClick={handleCancelDelete}
          >
            Cancel
          </button>

          <button
            className="delete-folder-btn"
            onClick={handleDeleteFolders}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default AssetsFolder;