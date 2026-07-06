// AssetsPopup.jsx

import React, { useState } from "react";
import "../styles/AssetsPanel.css";
import AssetsFolder from "../components/folders/AssetsFolder";
import Assetsfiles from "../components/assets/Assetsfiles";
import SearchBar from "../components/explorer/SearchBar";
import ExplorerHeader from "../components/explorer/ExplorerHeader";
import ExplorerTabs from "../components/explorer/ExplorerTabs";
import FolderTree from "../components/folders/FolderTree";
import AssetGrid from "../components/assets/AssetGrid";
import FolderContent from "../components/folders/FolderContent";
import FolderDetails from "../components/folders/FolderDetails";
import FileDetails from "../components/assets/FileDetails";

function AssetsPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("All");

  // Navigation State
  const [currentView, setCurrentView] = useState("home");

  // Selected Data
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const assetsImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=500",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=500",
    "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=500",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=500",
  ];

  const handleBack = () => {
    setCurrentView("home");
    setSelectedFolder(null);
    setSelectedFile(null);
  };
  return (
    <>
      <div className="assets-popup">
        {currentView === "home" && (
          <>
            <ExplorerHeader onClose={onClose} />

            <SearchBar />

            <ExplorerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "All" && (
              <>
                <div className="assets-section">
                  <h4>Folders</h4>

                  <AssetsFolder
                    setCurrentView={setCurrentView}
                    setSelectedFolder={setSelectedFolder}
                  />
                </div>

                <div className="assets-section">
                  <h4>Files</h4>

                  <Assetsfiles
                    setCurrentView={setCurrentView}
                    setSelectedFile={setSelectedFile}
                  />
                </div>
              </>
            )}

            {activeTab === "Folders" && (
              <AssetsFolder
                setCurrentView={setCurrentView}
                setSelectedFolder={setSelectedFolder}
              />
            )}

            {activeTab === "Files" && (
              <Assetsfiles
                setCurrentView={setCurrentView}
                setSelectedFile={setSelectedFile}
              />
            )}
          </>
        )}

        {currentView === "folder-content" && (
          <FolderContent
            openFolder={selectedFolder}
            onBack={handleBack}
            setCurrentView={setCurrentView}
            setSelectedFolder={setSelectedFolder}
          />
        )}

        {currentView === "folder-details" && (
          <FolderDetails folder={selectedFolder} onBack={handleBack} />
        )}

        {currentView === "file-details" && (
          <FileDetails selectedImage={selectedFile} onBack={handleBack} />
        )}
      </div>

      {showMoveModal && (
        <MoveFileModal onClose={() => setShowMoveModal(false)} />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal onClose={() => setShowCreateFolderModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteFolderModal onClose={() => setShowDeleteModal(false)} />
      )}
    </>
  );
}

export default AssetsPanel;
