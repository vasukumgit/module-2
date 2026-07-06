// FolderContent.jsx

import TextField from "@mui/material/TextField";
import Folder from "../../../../../../../assets/editor-panel/assets-panel/folder.svg";
import leftarrow from "../../../../../../../assets/editor-panel/assets-panel/leftarrow.png";
import FolderContextMenu from "./FolderContextMenu";
import SearchBar from "../explorer/SearchBar";

function FolderContent({
  openFolder,
  folders,
  onBack,
  setFolders,
  setOpenFolder,

  activeMenu,
  setActiveMenu,

  downloadingFolder,

  handleBack,
  handleFolderOpen,
  handleDetailsOpen,
  handleMove,
  handleDownloadFolder,
  handleDelete,
}) {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const updatedFolders = folders.map((folder) => {
      if (folder.name === openFolder?.name) {
        return {
          ...folder,
          items: [...folder.items, ...files],
        };
      }

      return folder;
    });

    setFolders(updatedFolders);

    const updatedCurrentFolder = updatedFolders.find(
      (folder) => folder.name === openFolder.name,
    );

    setOpenFolder(updatedCurrentFolder);
  };
  return (
    <div className="uploads-page-container">
      {/* HEADER */}
      <div className="folder-data-container">
        <div className="folder-data-header">
          <button className="uploads-back-btn" onClick={onBack}>
            <img src={leftarrow} alt="backarrow" />
          </button>

          <h2>{openFolder?.name}</h2>
        </div>

        <button className="uploads-close-btn" onClick={onBack}>
          ✕
        </button>
      </div>

      {/* SEARCH */}
      <div className="uploads-search-wrapper">
        <SearchBar/>
      </div>

      {/* UPLOAD BUTTON */}
      <div
        className="upload-new-assets-row"
        onClick={() => document.getElementById("assetUploadInput").click()}
      >
        <div className="upload-new-assets-icon">+</div>

        <p>Upload New Asset</p>

        <input
          id="assetUploadInput"
          type="file"
          multiple
          hidden
          onChange={handleUpload}
        />
      </div>

      {/* IMAGES */}
      {/* <div className="uploads-images-grid">
 
          {openFolder?.items?.length > 0 ? (
 
            openFolder.items.map((file, index) => (
 
              <img
                key={index}
                src={
                  typeof file === "string"
                    ? file
                    : URL.createObjectURL(file)
                }
                alt="uploaded"
              />
 
            ))
 
          ) : (
 
            <div className="empty-folder-container">
              <p>This folder is empty</p>
            </div>
 
          )}
 
        </div> */}

      {/* FOLDER CONTENT */}
      <div className="uploads-folder-content">
        {/* SUBFOLDERS */}
        {openFolder?.subFolders?.length > 0 && (
          <div className="subfolders-section">
            {openFolder.subFolders.map((subFolder, index) => (
              <div
                key={index}
                className="subfolder-card"
                onClick={() => handleFolderOpen(subFolder)}
              >
                {/* LEFT */}
                <div className="subfolder-left">
                  <img src={Folder} alt="folder" />

                  <div>
                    <h4>{subFolder.name}</h4>

                    <p>
                      {(subFolder.items?.length || 0) +
                        (subFolder.subFolders?.length || 0)}{" "}
                      {(subFolder.items?.length || 0) +
                        (subFolder.subFolders?.length || 0) ===
                      1
                        ? "item"
                        : "items"}
                    </p>
                  </div>
                </div>

                {/* 3 DOT MENU */}
                <div className="subfolder-menu-wrapper">
                  <button
                    className="folder-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      const uniqueIndex = `sub-${index}`;

                      if (activeMenu === uniqueIndex) {
                        setActiveMenu(null);
                      } else {
                        setActiveMenu(uniqueIndex);
                      }
                    }}
                  >
                    ⋯
                  </button>

                  {activeMenu === index && (
                    <FolderContextMenu
                      folder={folder}
                      downloadingFolder={downloadingFolder}
                      onDetails={handleDetailsOpen}
                      onMove={handleMove}
                      onDownload={handleDownloadFolder}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBFOLDERS */}
        {/* {openFolder?.subFolders?.length > 0 && (
 
    <div className="subfolders-section">
 
      {openFolder.subFolders.map((subFolder, index) => (
 
        <div
          key={index}
          className="subfolder-card"
          onClick={() => handleFolderOpen(subFolder)}
        >
 
          <img
            src={Folder}
            alt="folder"
          />
 
          <div>
 
            <h4>{subFolder.name}</h4>
 
            <p>
              {(subFolder.items?.length || 0) +
                (subFolder.subFolders?.length || 0)}{" "}
              Items
            </p>
 
          </div>
 
        </div>
 
      ))}
 
    </div>
  )} */}

        {/* IMAGES */}
        {openFolder?.items?.length > 0 ? (
          <div className="uploads-images-grid">
            {openFolder.items.map((file, index) => (
              <img
                key={index}
                src={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
                alt="uploaded"
              />
            ))}
          </div>
        ) : (
          openFolder?.subFolders?.length === 0 && (
            <div className="empty-folder-container">
              <p>This folder is empty</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default FolderContent;
