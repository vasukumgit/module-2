// import React, { useState, useMemo } from "react";
// import { Star, ChevronDown, LayoutGrid, Folder as FolderIcon, Plus, Grid, List, X, Search } from "lucide-react";
// import DashboardSidebar from "../../DashboardLayout/DashboardSidebar.jsx";
// import "./Folder.css";
// import { useNavigate } from "react-router-dom";
// import frame1 from "../../../../assets/Frames/frame1.png";
// import frame2 from "../../../../assets/Frames/frame2.png";
// import frame3 from "../../../../assets/Frames/frame3.png";

// import folder_img1 from "../../../../assets/Folders/Folder_img1.png"
// import folder_img2 from "../../../../assets/Folders/Folder_img2.png"
// import folder_img3 from "../../../../assets/Folders/Folder_img3.png"

// const Folder = () => {
//   const navigate = useNavigate();
//   const [sortBy, setSortBy] = useState('Last Viewed');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('grid');
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const [folders, setFolders] = useState([
//     { id: 1, name: "Presentation", items: 24, lastModified: "2 day ago", starred: true },
//     { id: 2, name: "Posters", items: 18, lastModified: "1 day ago", starred: false },
//     { id: 3, name: "Print Design", items: 32, lastModified: "2 days ago", starred: false },
//     { id: 4, name: "Meta Ads", items: 15, lastModified: "1 day ago", starred: false },
//     { id: 5, name: "Business Cards", items: 28, lastModified: "3 days ago", starred: false },
//   ]);

//   const toggleStar = (id) => {
//     setFolders(folders.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
//   };

//   const toggleSelect = (id) => {
//     setSelectedIds(prev =>
//       prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
//     );
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setIsSearchActive(false);
//   };

//   const hasStarred = folders.some(f => f.starred);

//   const processedFolders = useMemo(() => {
//     let list = [...folders].filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
//     if (sortBy === 'Alphabetical') return list.sort((a, b) => a.name.localeCompare(b.name));
//     return list.sort((a, b) => b.id - a.id);
//   }, [folders, sortBy, searchTerm]);

//   const starredFolders = processedFolders.filter(f => f.starred);
  
//   return (
//     <div className="dashboard">
//       <div className="dashboard-body">
//         <DashboardSidebar />
//         <div className="dashboard-wrapper">
//           <div className="st-workspace-root pj-folder-page">
//             <div className="pj-hero-frame">
//               <img src={frame1} className="pj-hero-img pj-img-left" alt="" />
//               <img src={frame2} className="pj-hero-img pj-img-right-top" alt="" />
//               <img src={frame3} className="pj-hero-img pj-img-right-bottom" alt="" />

//               <h1 className="pj-dashboard-title">
//                 Your <span>Studio</span>
//               </h1>

//               <div className={`pj-search-bar ${isSearchActive || searchTerm ? 'pj-search-bar--expanded' : ''}`}>
//                 <div className="pj-search-container">
//                   <Search className="pj-search-icon-main" size={20} />
//                   <input
//                     className="pj-search-input"
//                     type="text"
//                     placeholder="Search your folders..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onFocus={() => setIsSearchActive(true)}
//                     onBlur={() => {
//                       setTimeout(() => { if (!searchTerm) setIsSearchActive(false) }, 200);
//                     }}
//                   />
//                   {(isSearchActive || searchTerm) && (
//                     <div className="pj-clear-wrapper" onClick={clearSearch}>
//                       <div className="pj-v-line-search"></div>
//                       <X className="pj-search-icon-clear" size={18} />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="st-dashboard-wrapper">
//               <main className="st-main-content">
//                 <div className="st-title-row">
//                   <h2 className="st-heading-primary st-text">My Workspace</h2>
//                 </div>

//                 <div className="st-nav-bar-action">
//                   <div className="st-nav-pills-left">
//                     <button
//                       className="st-nav-tab-item"
//                       onClick={() => navigate("/projects")}
//                     >
//                       <LayoutGrid size={16}/> Projects
//                     </button>

//                     <button className="st-nav-tab-item st-active">
//                       <FolderIcon size={16}/> Folders
//                     </button>

//                     <button
//                       className={`st-nav-tab-item ${selectedIds.length > 0 ? 'st-active' : ''}`}
//                       onClick={() => selectedIds.length > 0 && setSelectedIds([])}
//                     >
//                       {selectedIds.length > 0 ? `Selected (${selectedIds.length})` : 'Select'}
//                     </button>
//                   </div>

//                   <div className="st-nav-tools-right">
//                     <button className="st-btn-create-new">
//                       <span className="st-create-icon-wrapper">
//                         <Plus size={20} />
//                       </span>
//                       Create new
//                     </button>

//                     <div className="st-dropdown-wrapper">
//                       <select className="st-ui-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//                         <option>Last Viewed</option>
//                         <option>Alphabetical</option>
//                       </select>
//                       <ChevronDown size={14} className="st-select-chevron" />
//                     </div>

//                     <div className="st-dropdown-wrapper">
//                       <select className="st-ui-select">
//                         <option>All Folders</option>
//                         <option>Client Folders</option>
//                       </select>
//                       <ChevronDown size={14} className="st-select-chevron" />
//                     </div>

//                     <div className="st-view-toggle-group">
//                       <button
//                         className={`st-view-btn ${viewMode === 'grid' ? 'st-active' : ''}`}
//                         onClick={() => setViewMode('grid')}
//                       >
//                         <Grid size={18}/>
//                       </button>
//                       <button
//                         className={`st-view-btn ${viewMode === 'list' ? 'st-active' : ''}`}
//                         onClick={() => setViewMode('list')}
//                       >
//                         <List size={18}/>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className={`st-content-area st-${viewMode}-layout`}>
//                   {viewMode === 'list' && (
//                     <div className="st-list-header">
//                       <div className="st-col-title-box">Name</div>
//                       <div className="st-col-date">Last Modified</div>
//                       <div className="st-col-dim">Items</div>
//                       <div className="st-col-file"></div>
//                       <div className="st-col-actions"></div>
//                     </div>
//                   )}

//                   {/* STARRED SECTION */}
//                   {hasStarred && (
//                     <section className="st-projects-section st-starred">
//                       <h3 className="st-section-label st-text">
//                         Starred <ChevronDown size={14}/>
//                       </h3>
//                       <div className="st-project-grid">
//                         {starredFolders.map(folder => (
//                           <FolderCard
//                             key={folder.id}
//                             folder={folder}
//                             onToggle={toggleStar}
//                             viewMode={viewMode}
//                             isSelected={selectedIds.includes(folder.id)}
//                             onSelect={() => toggleSelect(folder.id)}
//                           />
//                         ))}
//                       </div>
//                     </section>
//                   )}

//                   {/* FOLDERS SECTION */}
//                   <section className="st-projects-section st-all">
//                     <h3 className="st-section-label st-text">My Folders</h3>
//                     <div className="st-project-grid">
//                       {processedFolders.map(folder => (
//                         <FolderCard
//                           key={folder.id}
//                           folder={folder}
//                           onToggle={toggleStar}
//                           viewMode={viewMode}
//                           isSelected={selectedIds.includes(folder.id)}
//                           onSelect={() => toggleSelect(folder.id)}
//                         />
//                       ))}
//                     </div>
//                   </section>
//                 </div>
//               </main>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FolderCard = ({ folder, onToggle, viewMode, isSelected, onSelect }) => {
//   const isList = viewMode === 'list';
  
//   return (
//     <div
//       className={`st-card-container folder-card ${isList ? 'st-list-row' : ''} ${isSelected ? 'st-card-selected' : ''}`}
//       onClick={onSelect}
//       style={{ cursor: 'pointer', position: 'relative' }}
//     >
//       <div className={`st-round-select ${isSelected ? 'is-selected' : ''}`}>
//         {isSelected && <div className="st-check-icon">✓</div>}
//       </div>
 
//       <button
//         className={`st-card-star-btn ${folder.starred ? 'st-is-starred' : ''}`}
//         onClick={(e) => {
//           e.stopPropagation();
//           onToggle(folder.id);
//         }}
//       >
//         {/* <Star size={14} fill={folder.starred ? "#FFD700" : "none"} stroke={folder.starred ? "#FFD700" : (isList ? "#64748b" : "white")}/> */}
//         <Star
//   size={14}
//   strokeWidth={2}
//   fill={folder.starred ? "#FFD700" : "none"}
//   stroke={folder.starred ? "#FFD700" : "#334155"}
// />
//       </button>
 
//       <div className="st-card-media">
//         {/* {isList && (
//           <div className="st-list-icon-overlay st-type-folder">
//             <FolderIcon size={10} />
//           </div>
//         )} */}
//         {/* <div className="st-folder-icon">
//           <FolderIcon size={32} color="#64748b" />
//         </div> */}
//       </div>
 
//       <div className="st-card-details">
//         {!isList ? (
//   <>
//     {/* TOP IMAGE SECTION */}
//     <div className="st-card-preview">
//       <img src={folder_img1} className="st-preview-img img1" alt="" />
//       <img src={folder_img2} className="st-preview-img img2" alt="" />
//       <img src={folder_img3} className="st-preview-img img3" alt="" />
//     </div>

//     {/* BOTTOM INFO PANEL */}
//     <div className="st-card-footer">
//       <div className="st-folder-badge">
//         <FolderIcon size={18} />
//       </div>

//       <div className="st-footer-text">
//         <h4>{folder.name}</h4>
//         <p>{folder.items} Items</p>
//         <span>Last Modified {folder.lastModified}</span>
//       </div>
//     </div>
//   </>
// ) : (
//           <>
//             <div className="st-col-title-box">
//               <h4 className="st-card-title">{folder.name}</h4>
//             </div>
//             <div className="st-col-date">{folder.lastModified}</div>
//             <div className="st-col-dim">{folder.items} items</div>
//             <div className="st-col-file"></div>
//             <button className="st-more-options-btn" onClick={(e) => e.stopPropagation()}>
//               <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
//                 <circle cx="12" cy="7" r="1.5" fill="#64748b" />
//                 <circle cx="12" cy="12" r="1.5" fill="#64748b" />
//                 <circle cx="12" cy="17" r="1.5" fill="#64748b" />
//               </svg>
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Folder;

import React, { useState, useMemo } from "react";
import { Star, ChevronDown, LayoutGrid, Folder as FolderIcon, Plus, Grid, List, X, Search } from "lucide-react";
import DashboardSidebar from "../../DashboardLayout/DashboardSidebar.jsx";
import "./Folder.css";
import { useNavigate } from "react-router-dom";
import frame1 from "../../../../assets/Frames/frame1.png";
import frame2 from "../../../../assets/Frames/frame2.png";
import frame3 from "../../../../assets/Frames/frame3.png";

import folder_img1 from "../../../../assets/Folders/Folder_img1.png"
import folder_img2 from "../../../../assets/Folders/Folder_img2.png"
import folder_img3 from "../../../../assets/Folders/Folder_img3.png"

const Folder = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('Last Viewed');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [folders, setFolders] = useState([
    { id: 1, name: "Presentation", items: 24, lastModified: "2 day ago", starred: true },
    { id: 2, name: "Posters", items: 18, lastModified: "1 day ago", starred: false },
    { id: 3, name: "Print Design", items: 32, lastModified: "2 days ago", starred: false },
    { id: 4, name: "Meta Ads", items: 15, lastModified: "1 day ago", starred: false },
    { id: 5, name: "Business Cards", items: 28, lastModified: "3 days ago", starred: false },
  ]);

  const toggleStar = (id) => {
    setFolders(folders.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchActive(false);
  };

  const hasStarred = folders.some(f => f.starred);

  // Filtered lists for both sections
  const processedFolders = useMemo(() => {
    // 1. Filter by search term
    let list = [...folders].filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 2. Sort the items
    if (sortBy === 'Alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [folders, sortBy, searchTerm]);

  // Extract starred items for the top section
  const starredFolders = useMemo(() => {
    return processedFolders.filter(f => f.starred);
  }, [processedFolders]);

  // Extract non-starred items for the bottom section so they do not duplicate
  const unstarredFolders = useMemo(() => {
    return processedFolders.filter(f => !f.starred);
  }, [processedFolders]);
  
  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />
        <div className="dashboard-wrapper">
          <div className="st-workspace-root pj-folder-page">
            <div className="pj-hero-frame">
              <img src={frame1} className="pj-hero-img pj-img-left" alt="" />
              <img src={frame2} className="pj-hero-img pj-img-right-top" alt="" />
              <img src={frame3} className="pj-hero-img pj-img-right-bottom" alt="" />

              <h1 className="pj-dashboard-title">
                Your <span>Studio</span>
              </h1>

              <div className={`pj-search-bar ${isSearchActive || searchTerm ? 'pj-search-bar--expanded' : ''}`}>
                <div className="pj-search-container">
                  <Search className="pj-search-icon-main" size={20} />
                  <input
                    className="pj-search-input"
                    type="text"
                    placeholder="Search your folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => {
                      setTimeout(() => { if (!searchTerm) setIsSearchActive(false) }, 200);
                    }}
                  />
                  {(isSearchActive || searchTerm) && (
                    <div className="pj-clear-wrapper" onClick={clearSearch}>
                      <div className="pj-v-line-search"></div>
                      <X className="pj-search-icon-clear" size={18} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="st-dashboard-wrapper">
              <main className="st-main-content">
                <div className="st-title-row">
                  <h2 className="st-heading-primary st-text">My Workspace</h2>
                </div>

                <div className="st-nav-bar-action">
                  <div className="st-nav-pills-left">
                    <button
                      className="st-nav-tab-item"
                      onClick={() => navigate("/projects")}
                    >
                      <LayoutGrid size={16}/> Projects
                    </button>

                    <button className="st-nav-tab-item st-active">
                      <FolderIcon size={16}/> Folders
                    </button>

                    <button
                      className={`st-nav-tab-item ${selectedIds.length > 0 ? 'st-active' : ''}`}
                      onClick={() => selectedIds.length > 0 && setSelectedIds([])}
                    >
                      {selectedIds.length > 0 ? `Selected (${selectedIds.length})` : 'Select'}
                    </button>
                  </div>

                  <div className="st-nav-tools-right">
                    <button className="st-btn-create-new">
                      <span className="st-create-icon-wrapper">
                        <Plus size={20} />
                      </span>
                      Create new
                    </button>

                    <div className="st-dropdown-wrapper">
                      <select className="st-ui-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option>Last Viewed</option>
                        <option>Alphabetical</option>
                      </select>
                      <ChevronDown size={14} className="st-select-chevron" />
                    </div>

                    <div className="st-dropdown-wrapper">
                      <select className="st-ui-select">
                        <option>All Folders</option>
                        <option>Client Folders</option>
                      </select>
                      <ChevronDown size={14} className="st-select-chevron" />
                    </div>

                    <div className="st-view-toggle-group">
                      <button
                        className={`st-view-btn ${viewMode === 'grid' ? 'st-active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid size={18}/>
                      </button>
                      <button
                        className={`st-view-btn ${viewMode === 'list' ? 'st-active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List size={18}/>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`st-content-area st-${viewMode}-layout`}>
                  {viewMode === 'list' && (
                    <div className="st-list-header">
                      <div className="st-col-title-box">Name</div>
                      <div className="st-col-date">Last Modified</div>
                      <div className="st-col-dim">Items</div>
                      <div className="st-col-file"></div>
                      <div className="st-col-actions"></div>
                    </div>
                  )}

                  {/* STARRED SECTION */}
                  {hasStarred && (
                    <section className="st-projects-section st-starred">
                      <h3 className="st-section-label st-text">
                        Starred <ChevronDown size={14}/>
                      </h3>
                      <div className="st-project-grid">
                        {starredFolders.map(folder => (
                          <FolderCard
                            key={folder.id}
                            folder={folder}
                            onToggle={toggleStar}
                            viewMode={viewMode}
                            isSelected={selectedIds.includes(folder.id)}
                            onSelect={() => toggleSelect(folder.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* FOLDERS SECTION */}
                  <section className="st-projects-section st-all">
                    <h3 className="st-section-label st-text">My Folders</h3>
                    <div className="st-project-grid">
                      {unstarredFolders.map(folder => (
                        <FolderCard
                          key={folder.id}
                          folder={folder}
                          onToggle={toggleStar}
                          viewMode={viewMode}
                          isSelected={selectedIds.includes(folder.id)}
                          onSelect={() => toggleSelect(folder.id)}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FolderCard = ({ folder, onToggle, viewMode, isSelected, onSelect }) => {
  const isList = viewMode === 'list';
  
  return (
    <div
      className={`st-card-container folder-card ${isList ? 'st-list-row' : ''} ${isSelected ? 'st-card-selected' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* 1. SELECTION BOX */}
      <div className={`st-round-select ${isSelected ? 'is-selected' : ''}`}>
        {isSelected && <div className="st-check-icon">✓</div>}
      </div>
 
      {/* 2. STAR BUTTON */}
      <button
        className={`st-card-star-btn ${folder.starred ? 'st-is-starred' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(folder.id);
        }}
      >
        <Star
          size={14}
          strokeWidth={2}
          fill={folder.starred ? "#FFD700" : "none"}
          stroke={folder.starred ? "#FFD700" : (isList ? "#64748b" : "#334155")}
        />
      </button>
 
      {/* 3. CONDITIONAL STRUCTURAL RENDERING */}
      {!isList ? (
        // ================= GRID VIEW LAYOUT =================
        <>
          <div className="st-card-media" style={{ display: 'none' }}></div>
          <div className="st-card-details">
            <div className="st-card-preview">
              <img src={folder_img1} className="st-preview-img img1" alt="" />
              <img src={folder_img2} className="st-preview-img img2" alt="" />
              <img src={folder_img3} className="st-preview-img img3" alt="" />
            </div>

            <div className="st-card-footer">
              <div className="st-folder-badge">
                <FolderIcon size={18} />
              </div>

              <div className="st-footer-text">
                <h4>{folder.name}</h4>
                <p>{folder.items} Items</p>
                <span>Last Modified {folder.lastModified}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        // ================= LIST VIEW LAYOUT =================
        <>
          <div className="st-card-media list-preview-box">
            <img src={folder_img1} className="st-list-preview-thumb" alt="" />
          </div>
          
          <div className="st-card-details">
            <div className="st-col-title-box">
              <h4 className="st-card-title">{folder.name}</h4>
            </div>
            <div className="st-col-date">{folder.lastModified}</div>
            <div className="st-col-dim">{folder.items} items</div>
            <div className="st-col-file"></div>
            
            <button className="st-more-options-btn" onClick={(e) => e.stopPropagation()}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="1.5" fill="#64748b" />
                <circle cx="12" cy="12" r="1.5" fill="#64748b" />
                <circle cx="12" cy="17" r="1.5" fill="#64748b" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Folder;