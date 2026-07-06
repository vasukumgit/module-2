import React from 'react'
import "../../styles/AssetsPanel.css"

export default function ExplorerTabs({
 activeTab,
 setActiveTab
}) {
  return (
    <div>
              {/* TABS */}
        <div className="assets-tabs">
          <button
            className={activeTab === "All" ? "active" : ""}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
          <button
            className={activeTab === "Files" ? "active" : ""}
            onClick={() => setActiveTab("Files")}
          >
            Files
          </button>
          <button
            className={activeTab === "Folders" ? "active" : ""}
            onClick={() => setActiveTab("Folders")}
          >
            Folders
          </button>
        </div>
    </div>
  )
}
