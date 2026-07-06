import React from "react";
import { Folder } from "lucide-react";

const FolderList = ({ viewMode }) => {

  const folders = ["Presentation", "Posters", "Print Design", "Meta Ads", "Business Cards"];

  return (
    <>
      {viewMode === 'list' && (
        <div className="st-list-header">
          <div className="st-col-title-box">Name</div>
          <div className="st-col-date">Last Modified</div>
          <div className="st-col-dim">Items</div>
          <div className="st-col-file"></div>
          <div className="st-col-actions"></div>
        </div>
      )}


      {/* FOLDERS SECTION */}
      <section className="st-projects-section st-all">
        <h3 className="st-section-label st-text">My Folders</h3>
        <div className="st-project-grid">
          {folders.map((folderName, index) => (
            <div
              key={index}
              className={`st-card-container ${viewMode === 'list' ? 'st-list-row' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <div className="st-card-media">
                {viewMode === 'list' && (
                  <div className="st-list-icon-overlay st-type-folder">
                    <Folder size={10} />
                  </div>
                )}
                <div className="st-folder-icon">
                  <Folder size={32} color="#64748b" />
                </div>
              </div>

              <div className="st-card-details">
                {viewMode !== 'list' ? (
                  <>
                    <div className="st-card-info-row">
                      <div className="st-type-icon-box st-type-folder">
                        <Folder size={20} />
                      </div>
                      <div className="st-text-stack">
                        <h4 className="st-card-title">{folderName}</h4>
                        <div className="st-card-meta">
                          <span className="st-meta-date">Edited 1 day ago</span>
                        </div>
                      </div>
                    </div>
                    <button className="st-more-options-btn" onClick={(e) => e.stopPropagation()}>
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="7" r="1.5" fill="#64748b" />
                        <circle cx="12" cy="12" r="1.5" fill="#64748b" />
                        <circle cx="12" cy="17" r="1.5" fill="#64748b" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="st-col-title-box">
                      <h4 className="st-card-title">{folderName}</h4>
                    </div>
                    <div className="st-col-date">Edited 1 day ago</div>
                    <div className="st-col-dim">24 items</div>
                    <div className="st-col-file"></div>
                    <button className="st-more-options-btn" onClick={(e) => e.stopPropagation()}>
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="7" r="1.5" fill="#64748b" />
                        <circle cx="12" cy="12" r="1.5" fill="#64748b" />
                        <circle cx="12" cy="17" r="1.5" fill="#64748b" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FolderList;
