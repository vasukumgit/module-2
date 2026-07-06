import React, { useState, useEffect, useRef } from "react";

import Select from "../../../../assets/editor-panel/select.svg";
import User from "../../../../assets/editor-panel/user.png";
import Export from "../../../../assets/editor-panel/export.svg";

import ExportModal from "./export-publish-model/ExportPublishModal";
import HeaderToolsPanel from "./header-tool-panel/HeaderToolsPanel";
import CollabrationPanel from "./collabration-panel/CollabrationPanel";
import PrimaryPanel from "./primary-panel/PrimaryPanel";

function Header({ design, designId, elements, template, onToolChange }) {
  // State to manage modal visibility
  const [isExportOpen, setIsExportOpen] = useState(false);

  const toggleModal = () => {
    setIsExportOpen(!isExportOpen);
  };

  return (
    <div className="flex justify-between">
      <div className="title-sec flex items-center gap-[40px]">
        <PrimaryPanel design={design} designId={designId} elements={elements} />
      </div>
      <div className="header-toolbar-box">
        <HeaderToolsPanel onToolChange={onToolChange} />
      </div>
      <div className="invite-sec">
        <CollabrationPanel designId={designId} />
        <button className="export-btn" onClick={toggleModal}>
          <img src={Export} alt="export" />
          <span>Export</span>
        </button>
      </div>

      {/* EXPORT MODAL */}
      {isExportOpen && (
        <ExportModal
          onClose={toggleModal}
          design={design}
          designId={designId}
          designTitle={design?.name || "Untitled Design"}
          elements={elements}
          template={template}
        />
      )}
    </div>
  );
}

export default Header;
