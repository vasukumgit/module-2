import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, RotateCcw, Trash2, CheckCircle2, Check, ChevronDown, Layers, CreditCard, Presentation, ChevronLeft, X } from "lucide-react";
import "./TrashView.css";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../DashboardLayout/DashboardSidebar.jsx";


// Assets
import Trash1 from "../../../assets/Trash-Images/Trash1.png";
import Trashp2 from "../../../assets/Trash-Images/Trash2.png";
import Trash3 from "../../../assets/Trash-Images/Trash3.png";
import Trash4 from "../../../assets/Trash-Images/Trash4.png";
import frame1 from "../../../assets/Frames/frame1.png";
import frame2 from "../../../assets/Frames/frame2.png";
import frame3 from "../../../assets/Frames/frame3.png";

const TrashView = () => {
  const [trashItems, setTrashItems] = useState([
    { id: 1, title: "Hiring Post", date: "1 days ago", size: "984 KB", type: "Poster", img: Trash1 },
    { id: 2, title: "Social Media Poster", date: "1 days ago", size: "984 KB", type: "Poster", img: Trashp2 },
    { id: 3, title: "Business Card", date: "1 days ago", size: "984 KB", type: "Business Card", img: Trash3 },
    { id: 4, title: "Report Presentation", date: "1 days ago", size: "984 KB", type: "Presentation", img: Trash4 },
    { id: 5, title: "Card report", date: "1 days ago", size: "984 KB", type: "Presentation", img: Trash1 },
  ]);
  // const [trashItems, setTrashItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // --- Search States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Toggle the selection mode (Frame 351-1 style)
  const handleToggleMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) setSelectedIds([]);
  };

  // Logic for the Select All circle
 const handleSelectAllCircle = (e) => {
  e.stopPropagation();

  // Don't do anything until selection mode is active
  if (!isSelectionMode) return;

  if (selectedIds.length === trashItems.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(trashItems.map(item => item.id));
  }
};

  const toggleItem = (id) => {
    if (!isSelectionMode) return;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // --- Search Helper ---
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "Poster": return <Layers size={18} />;
      case "Business Card": return <CreditCard size={18} />;
      case "Presentation": return <Presentation size={18} />;
      default: return <Layers size={18} />;
    }
  };

  const anySelected = selectedIds.length > 0;
  const isAllSelected = selectedIds.length === trashItems.length && trashItems.length > 0;

  const fetchTrash = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5050/api/trash", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const mapped = res.data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        originalId: item.originalId,
        date: "Recently",
        size: "N/A",
        img: Trash1
      }));

      setTrashItems(mapped);

    } catch (err) {
      console.error("Error fetching trash:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrash();
  }, []);

  const handleRestore = async () => {
    try {
      const token = localStorage.getItem("token");

      for (const id of selectedIds) {
        await axios.put(
          `http://localhost:5050/api/trash/recover/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      fetchTrash();
      setSelectedIds([]);
      setModalType(null);

      navigate("/projects");

    } catch (err) {
      console.error("Restore error:", err);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5050/api/trash", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchTrash();
      setModalType(null);

    } catch (err) {
      console.error("Empty trash error:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className={`rd-trash-page`}>
            <div className="rd-hero-frame">
              <img src={frame1} className="rd-hero-img rd-img-left" alt="" />
              <img src={frame2} className="rd-hero-img rd-img-right-top" alt="" />
              <img src={frame3} className="rd-hero-img rd-img-right-bottom" alt="" />
              <h1 className="rd-dashboard-title">Manage your deleted <span>items</span></h1>

              {/* Updated Expanding Search Bar Wrapper */}
              <div className={`rd-search-bar ${isSearchActive || searchTerm ? 'rd-search-bar--expanded' : ''}`}>
                <div className="rd-search-container">
                  <Search className="rd-search-icon-main" size={20} />
                  <input
                    className="rd-search-input"
                    type="text"
                    placeholder="Search your projects or folders"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => {
                      setTimeout(() => { if (!searchTerm) setIsSearchActive(false) }, 200);
                    }}
                  />
                  {(isSearchActive || searchTerm) && (
                    <div className="rd-clear-wrapper" onClick={clearSearch}>
                      <div className="rd-v-line-search"></div>
                      <X className="rd-search-icon-clear" size={18} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rd-content-container">
              <h2 className="rd-section-title">Trash</h2>

              <div className="rd-toolbar">
                <div className="rd-tabs">
                  <button className="rd-tab active">Projects</button>
                  <button className="rd-tab">Folders</button>
                </div>

                <div className="rd-actions">
                  {/* SELECT ALL PILL */}
                  <div className={`rd-select-pill ${isSelectionMode ? "mode-open" : ""}`}>
                    <button
  type="button"
  className="rd-pill-main"
  onClick={handleToggleMode}
>
                      <div
                        className={`rd-check-circle ${isAllSelected ? "is-active" : ""}`}
                        onClick={handleSelectAllCircle}
                      >
                        {isAllSelected && <Check size={14} strokeWidth={4} color="white" />}
                      </div>
                      <span className="rd-select-text">
                        {isSelectionMode ? "Select all" : "Select"}
                      </span>
                    </button>

                    {isSelectionMode && (
                      <div className="rd-pill-divider">
                        <div className="rd-v-line"></div>
                        <ChevronLeft size={18} className="rd-back-arrow" />
                      </div>
                    )}
                  </div>

                  {isSelectionMode && (
                    <button
                      className="rd-btn-restore visible"
                      onClick={() => anySelected && setModalType("restore")}
                    >
                      <RotateCcw size={18} /> Restore
                    </button>
                  )}

                  <button className="rd-btn-empty" onClick={() => setModalType("delete")}>
                    <Trash2 size={18} /> Empty Trash
                  </button>
                </div>
              </div>

              <div className="rd-grid">
                {/* Added Search Filtering Logic */}
                {trashItems
                  .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item) => (
                    <div key={item.id} className={`rd-card ${isSelectionMode ? "selectable" : ""}`}>
                      <div className="rd-card-media" onClick={() => toggleItem(item.id)}>
                        <img src={item.img} alt={item.title} />
                        {isSelectionMode && (
                          <div className={`rd-card-overlay-check ${selectedIds.includes(item.id) ? "active" : ""}`}>
                            {selectedIds.includes(item.id) && <Check size={16} strokeWidth={4} color="white" />}
                          </div>
                        )}
                      </div>
                      <div className="rd-card-info">
                        <div className={`rd-icon-container rd-icon-${item.type.toLowerCase().replace(" ", "-")}`}>
                          {getIcon(item.type)}
                        </div>
                        <div className="rd-text">
                          <h3>{item.title}</h3>
                          <p>Edited {item.date}</p>
                          <span>1080x1080px • {item.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {modalType && (
              <div className="rd-modal-overlay">
                <div className="rd-modal-box">
                  <div className={`rd-modal-icon ${modalType === "restore" ? "blue" : "red"}`}>
                    {modalType === "restore" ? <RotateCcw size={32} color="#1666ED" /> : <Trash2 size={32} color="#F24E1E" />}
                  </div>
                  <h2>{modalType === "restore" ? "Restore Project?" : "Delete Project?"}</h2>
                  <p>Are you sure you want to {modalType === "restore" ? "restore" : "delete"} the selected projects?</p>
                  <div className="rd-modal-btns">
                    <button
                      className="rd-cancel"
                      onClick={() => setModalType(null)}
                    >
                      Cancel
                    </button>

                    <button
                      className={`rd-confirm ${modalType === "restore" ? "bg-blue" : "bg-red"}`}
                      onClick={() => {
                        if (modalType === "restore") {
                          handleRestore();
                        } else {
                          handleEmptyTrash();
                        }
                      }}
                    >
                      {modalType === "restore" ? "Restore" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashView;