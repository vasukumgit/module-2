import React from "react";
import "../../styles/AssetsPanel.css";
import FolderItem from "./FolderItem";
import CreateFolder from "../../../../../../../assets/editor-panel/assets-panel/createfolder.svg";

export default function FolderTree({ folder }) {
  return (
    <div>
      {/* <FolderContent /> */}

      <div className="assets-section">
        <h4>Folders</h4>
        <div className="folder-create">
          <div className="create-folder-icon">
            <img src={CreateFolder} alt="Plus" />
          </div>
          <span>Create Folder</span>
        </div>

        <FolderItem
          folder={{
            name: "Brand Assets",
            items: Array(24),
          }}
        />

        <FolderItem
          folder={{
            name: "Uploads",
            items: Array(24),
          }}
        />
      </div>
    </div>
  );
}
