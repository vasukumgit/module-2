import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Folder,
  Star,
  Trash2,
  LayoutGrid,
  Plus,
  ChevronDown,
  List,
  Grid,
  X,
  FileText,
  Monitor,
  CreditCard,
  Check,
} from "lucide-react";
import DashboardSidebar from "../DashboardLayout/DashboardSidebar.jsx";
import FolderList from "./FolderList.jsx";
import "./Projects.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Project1 from "../../../assets/Project_Images/Project1.png";
import Project2 from "../../../assets/Project_Images/Project2.png";
import Project3 from "../../../assets/Project_Images/Project3.png";
import Project4 from "../../../assets/Project_Images/Project4.png";
import Project5 from "../../../assets/Project_Images/Project5.png";
import Project6 from "../../../assets/Project_Images/Project6.png";
import Project7 from "../../../assets/Project_Images/Project7.png";
import frame1 from "../../../assets/Frames/frame1.png";
import frame2 from "../../../assets/Frames/frame2.png";
import frame3 from "../../../assets/Frames/frame3.png";
import Createdesign from "../Createdesign/Createdesign.jsx";

const projectImages = [
  Project1,
  Project2,
  Project3,
  Project4,
  Project5,
  Project6,
  Project7,
];

const StylizedMoreIcon = ({ size = 20, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="1.5" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="12" cy="17" r="1.5" fill={color} />
  </svg>
);

const Workspace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [sortBy, setSortBy] = useState("Last Viewed");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCreateDesign, setShowCreateDesign] = useState(false);

  const [projects, setProjects] = useState([]);

  // MODULE 3 ADDED: Fetch owned projects + accepted shared projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const ownedRes = await axios.get("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sharedRes = await axios.get(
        "/api/collaboration/shared-with-me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const ownedProjects = ownedRes.data.map((p, index) => ({
        id: p.id,
        designId: p.design_id,
        title: p.title,
        type: "image",
        date: new Date(p.created_at).toLocaleString(),
        info: p.description || "Project",
        img: projectImages[index % projectImages.length],
        starred: false,
        shared: false,
      }));

      const sharedProjects = (sharedRes.data.data || []).map((p, index) => ({
        id: `shared-${p.design_id}`,
        designId: p.design_id,
        title: p.name,
        type: "image",
        date: new Date(p.updated_at).toLocaleString(),
        info: `${
          p.role === "admin"
            ? "Admin access"
            : p.role === "editor"
              ? "Edit access"
              : "View access"
        } • Shared by ${p.owner_name}`,
        img: projectImages[
          (ownedProjects.length + index) % projectImages.length
        ],
        starred: false,
        shared: true,
      }));

      setProjects([...ownedProjects, ...sharedProjects]);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleStar = (id) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)),
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      const token = localStorage.getItem("token");

      const ownedOnlyIds = selectedIds.filter(
        (id) => !String(id).startsWith("shared-"),
      );

      await Promise.all(
        ownedOnlyIds.map((id) =>
          axios.delete(`/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      await fetchProjects();
      setSelectedIds([]);

      navigate("/trash");
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
  };

  const hasStarred = projects.some((p) => p.starred);

  const processedProjects = useMemo(() => {
    let list = [...projects].filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortBy === "Alphabetical") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
  }, [projects, sortBy, searchTerm]);

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="st-workspace-root">
            <div className="pj-hero-frame">
              <img src={frame1} className="pj-hero-img pj-img-left" alt="" />
              <img
                src={frame2}
                className="pj-hero-img pj-img-right-top"
                alt=""
              />
              <img
                src={frame3}
                className="pj-hero-img pj-img-right-bottom"
                alt=""
              />

              <h1 className="pj-dashboard-title">
                Your <span>Studio</span>
              </h1>

              <div
                className={`pj-search-bar ${isSearchActive || searchTerm ? "pj-search-bar--expanded" : ""}`}
              >
                <div className="pj-search-container">
                  <Search className="pj-search-icon-main" size={20} />

                  <input
                    className="pj-search-input"
                    type="text"
                    placeholder="Search your projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!searchTerm) setIsSearchActive(false);
                      }, 200);
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
                      className={`st-nav-tab-item ${activeTab === "projects" ? "st-active" : ""}`}
                      onClick={() => setActiveTab("projects")}
                    >
                      <LayoutGrid size={16} /> Projects
                    </button>

                    <button
                      className={`st-nav-tab-item ${activeTab === "folders" ? "st-active" : ""}`}
                      onClick={() => navigate("/projects/folders")}
                    >
                      <Folder size={16} /> Folders
                    </button>

                    <button
                      className={`st-nav-tab-item ${selectedIds.length > 0 ? "st-active" : ""}`}
                      onClick={() =>
                        selectedIds.length > 0 && setSelectedIds([])
                      }
                    >
                      {selectedIds.length > 0
                        ? `Selected (${selectedIds.length})`
                        : "Select"}
                    </button>

                    <button
                      className="st-nav-tab-item"
                      onClick={handleDelete}
                      disabled={selectedIds.length === 0}
                      style={{
                        opacity: selectedIds.length > 0 ? 1 : 0.5,
                        cursor:
                          selectedIds.length > 0 ? "pointer" : "not-allowed",
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>

                  <div className="st-nav-tools-right">
                    <button
                      className="st-btn-create-new"
                      onClick={() => setShowCreateDesign(true)}
                    >
                      <span className="st-create-icon-wrapper">
                        <Plus size={20} />
                      </span>
                      Create new
                    </button>

                    <div className="st-dropdown-wrapper">
                      <select
                        className="st-ui-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option>Last Viewed</option>
                        <option>Alphabetical</option>
                      </select>
                      <ChevronDown size={14} className="st-select-chevron" />
                    </div>

                    <div className="st-dropdown-wrapper">
                      <select className="st-ui-select">
                        <option>All Projects</option>
                        <option>Client Project</option>
                      </select>
                      <ChevronDown size={14} className="st-select-chevron" />
                    </div>

                    <div className="st-view-toggle-group">
                      <button
                        className={`st-view-btn ${viewMode === "grid" ? "st-active" : ""}`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid size={18} />
                      </button>

                      <button
                        className={`st-view-btn ${viewMode === "list" ? "st-active" : ""}`}
                        onClick={() => setViewMode("list")}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`st-content-area st-${viewMode}-layout`}>
                  {activeTab === "projects" && (
                    <>
                      {viewMode === "list" && (
                        <div className="st-list-header">
                          <div className="st-col-title-box">Name</div>
                          <div className="st-col-date">Last Modified</div>
                          <div className="st-col-dim">Dimensions</div>
                          <div className="st-col-file">Size</div>
                          <div className="st-col-actions"></div>
                        </div>
                      )}

                      {hasStarred && (
                        <section className="st-projects-section st-starred">
                          <h3 className="st-section-label st-text">
                            Starred <ChevronDown size={14} />
                          </h3>

                          <div className="st-project-grid">
                            {processedProjects
                              .filter((p) => p.starred)
                              .map((item) => (
                                <ProjectCard
                                  key={item.id}
                                  item={item}
                                  onToggle={toggleStar}
                                  viewMode={viewMode}
                                  isSelected={selectedIds.includes(item.id)}
                                  onSelect={() => toggleSelect(item.id)}
                                  onOpen={() =>
                                    navigate(`/editor/${item.designId}`)
                                  }
                                />
                              ))}
                          </div>
                        </section>
                      )}

                      <section className="st-projects-section st-all">
                        <h3 className="st-section-label st-text">Projects</h3>

                        <div className="st-project-grid">
                          {processedProjects
                            .filter((p) => !p.starred)
                            .map((item) => (
                              <ProjectCard
                                key={item.id}
                                item={item}
                                onToggle={toggleStar}
                                viewMode={viewMode}
                                isSelected={selectedIds.includes(item.id)}
                                onSelect={() => toggleSelect(item.id)}
                                onOpen={() =>
                                  navigate(`/editor/${item.designId}`)
                                }
                              />
                            ))}
                        </div>
                      </section>
                    </>
                  )}

                  {activeTab === "folders" && (
                    <FolderList viewMode={viewMode} />
                  )}
                </div>
              </main>
            </div>
          </div>

          {showCreateDesign && (
            <Createdesign
              setShowCreatedesign={setShowCreateDesign}
              initialTab="custom"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({
  item,
  onToggle,
  viewMode,
  isSelected,
  onSelect,
  onOpen,
}) => {
  const isList = viewMode === "list";
  const infoParts = item.info.split(" • ");
  const dimensions = infoParts[0];
  const fileSize = infoParts[1];

  return (
    <div
      className={`st-card-container project-card ${isList ? "st-list-row" : ""} ${isSelected ? "st-card-selected" : ""}`}
      onClick={onSelect}
      onDoubleClick={onOpen}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <div className={`st-round-select ${isSelected ? "is-selected" : ""}`}>
        {isSelected && <Check size={12} color="white" strokeWidth={4} />}
      </div>

      <button
        className={`st-card-star-btn ${item.starred ? "st-is-starred" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(item.id);
        }}
      >
        <Star
          size={14}
          fill={item.starred ? "#FFD700" : "none"}
          stroke={item.starred ? "#FFD700" : isList ? "#64748b" : "white"}
        />
      </button>

      {item.shared && <span className="st-shared-badge">Shared</span>}

      <div className="st-card-media">
        {isList && (
          <div className={`st-list-icon-overlay st-type-${item.type}`}>
            {item.type === "card" ? (
              <CreditCard size={10} />
            ) : item.type === "presentation" ? (
              <Monitor size={10} />
            ) : (
              <FileText size={10} />
            )}
          </div>
        )}

        <img src={item.img} alt={item.title} className="st-card-img" />
      </div>

      <div className="st-card-details">
        {!isList ? (
          <>
            <div className="st-card-info-row">
              <div className={`st-type-icon-box st-type-${item.type}`}>
                {item.type === "card" ? (
                  <CreditCard size={20} />
                ) : item.type === "presentation" ? (
                  <Monitor size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>

              <div className="st-text-stack">
                <h4 className="st-card-title">{item.title}</h4>

                <div className="st-card-meta">
                  <span className="st-meta-date">{item.date}</span>
                  <span className="st-meta-dim">{item.info}</span>
                </div>
              </div>
            </div>

            <button
              className="st-more-options-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <StylizedMoreIcon />
            </button>
          </>
        ) : (
          <>
            <div className="st-col-title-box">
              <h4 className="st-card-title">{item.title}</h4>
            </div>

            <div className="st-col-date">{item.date}</div>
            <div className="st-col-dim">{dimensions}</div>
            <div className="st-col-file">{fileSize}</div>

            <button
              className="st-more-options-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <StylizedMoreIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Workspace;
