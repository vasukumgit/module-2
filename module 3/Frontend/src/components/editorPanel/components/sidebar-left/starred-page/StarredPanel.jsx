import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import "./StarredPanel.css";

import SearchIcon from "../../../../../assets/editor-panel/starred-page/search.svg";
import Wrapper from "../../../../../assets/editor-panel/starred-page/wrapper.svg";
import Close from "../../../../../assets/editor-panel/close.svg";

import Star from "../../../../../assets/editor-panel/starred-page/star.svg";
import StarIcon from "../../../../../assets/editor-panel/starred-page/star-icon.svg";

import More from "../../../../../assets/editor-panel/starred-page/more.svg";
import SelectMore from "../../../../../assets/editor-panel/starred-page/select-more.svg";

import Report from "../../../../../assets/editor-panel/starred-page/report.svg";

import Template1 from "../../../../../assets/editor-panel/starred-page/template1.png";


function StarredPanel({ onClose }) {
  const [starredData, setStarredData] = useState({
    templates: [],
    photos: [],
    graphics: [],
    projects: [],
  });

  const [selectedMore, setSelectedMore] = useState(null);

  const [hoveredImage, setHoveredImage] = useState(null);

  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showDetails, setShowDetails] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [totalTemplates, setTotalTemplates] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

  const panelRef = useRef(null);

  const decodeToken = (jwt) => {
    try {
      if (!jwt) return {};
      const payload = jwt.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  };

  const token = localStorage.getItem("token");
  const tokenUser = decodeToken(token);
  // console.log("Token user",tokenUser);
  
  const user_id = tokenUser.id;

  const API = axios.create({
    baseURL: "http://localhost:5050/api",
  });

  // ==========================================
  // FETCH STARRED ITEMS
  // ==========================================

  const fetchStarredItems = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/starred/${user_id}`);

      if (response.data.success) {
        setStarredData({
          templates: response.data.data.templates || [],
          photos: response.data.data.photos || [],
          graphics: response.data.data.graphics || [],
          projects: response.data.data.projects || [],
        });
      }
    } catch (error) {
      console.log("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStarredItems();
  }, []);

  // ==========================================
  // CLOSE DROPDOWN
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSelectedMore(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // UNSTAR
  // ==========================================

  const handleUnstar = async (e, item) => {
    e.stopPropagation();

    try {
       await axios.delete(`http://localhost:5050/api/starred`, {
                data: {
                  user_id: user_id,
                  item_id: item.id,
                  item_type: "template",
                },
              });

      fetchStarredItems();

      setSelectedMore(null);
    } catch (error) {
      console.log("Delete Error:", error.response?.data || error.message);
    }
  };

  // ==========================================
  // MORE BUTTON
  // ==========================================

  const handleMoreClick = (e, currentIndex, cardEl) => {
    e.stopPropagation();

    if (selectedMore === currentIndex) {
      setSelectedMore(null);
      return;
    }

    const cardRect = cardEl.getBoundingClientRect();

    setDropdownPos({
      top: cardRect.top - 130,

      left: cardRect.left - 70,
    });

    setSelectedMore(currentIndex);
  };

  //hand view more
  const handleViewMore = async (template) => {
    try {
      const response = await API.get(`/templates/details/${template.id}`);

      const tags = response.data.template?.tags || [];

      if (tags.length > 0) {
        const relatedTemplates = starredData.templates.filter((t) => {
          const templateTags = [t.tag1, t.tag2, t.tag3, t.tag4, t.tag5].filter(
            Boolean,
          );

          return tags.some((tag) => templateTags.includes(tag));
        });

        setStarredData((prev) => ({
          ...prev,
          templates: relatedTemplates,
        }));
      }

      setSelectedMore(null);
    } catch (error) {
      console.log("VIEW MORE ERROR:", error);
    }
  };
  // ==========================================
  // SEARCH
  // ==========================================

  const filterItems = (items) => {
    return items.filter((item) => {
      const searchableText = `
        ${item.image_name || ""}
        ${item.template_name || ""}
        ${item.title || ""}
        ${item.name || ""}
      `
        .toLowerCase()
        .trim();

      return searchableText.includes(searchTerm.toLowerCase().trim());
    });
  };

  // ==========================================
  // SECTIONS
  // ==========================================

  const sections = [
    {
      title: "Templates",
      type: "template",
      items: filterItems(starredData.templates),
    },
    {
      title: "Photos",
      type: "photo",
      items: filterItems(starredData.photos),
    },
    {
      title: "Graphics",
      type: "graphic",
      items: filterItems(starredData.graphics),
    },
    {
      title: "Projects",
      type: "project",
      items: filterItems(starredData.projects),
    },
  ];

  // ==========================================
  // SELECTED ITEM
  // ==========================================

  let selectedItem = null;

  sections.forEach((section) => {
    section.items.forEach((item) => {
      const key = `${section.type}-${item.id}`;

      if (key === selectedMore) {
        selectedItem = {
          ...item,
          type: section.type,
        };
      }
    });
  });

  // ==========================================
  // DETAILS PAGE
  // ==========================================

  if (showDetails && selectedTemplate) {
    return (
      <div className="starred-panel-wrapper">
        <div className="starred-template-details-container">
          <button
            className="starred-template-back-btn"
            onClick={() => setShowDetails(false)}
          >
            ← Back
          </button>

          <div className="starred-template-details-content">
            <img
              src={selectedTemplate.thumbnail || Template1}
              alt=""
              className="starred-template-details-image"
            />

            <h2>{selectedTemplate.template_name}</h2>

            <p className="starred-template-description">
              {selectedTemplate.description || "No description available"}
            </p>

            <div className="starred-template-detail-box">
              <h4>Created </h4>

              <p>{selectedTemplate.created_by || ""}</p>
            </div>

            <div className="starred-template-detail-box">
              <h4>Total Templates Created</h4>

              <p>{totalTemplates}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="starred-panel-wrapper" ref={panelRef}>
      <div className="starred-panel">
        {/* HEADER */}

        <div className="starred-fixed-top">
          <div className="starred-panel-header">
            <div className="starred-header-left">
              <img src={Wrapper} alt="" draggable={false} />

              <h3>Starred</h3>
            </div>

            <span className="starred-panel-close-btn" onClick={onClose}>
              <img src={Close} alt="close" />
            </span>
          </div>

          {/* SEARCH */}

          <div className="starred-panel-search-container">
            <input
              type="text"
              className="starred-panel-search"
              placeholder="Search in starred"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <img src={SearchIcon} alt="" />
          </div>
        </div>

        {/* BODY */}

        <div className="starred-scroll-area">
          {loading ? (
            <p style={{ padding: "20px" }}>Loading...</p>
          ) : (
            <>
              {sections.map((section, sectionIndex) => {
                if (section.items.length === 0) return null;

                return (
                  <div className="starred-panel-section" key={sectionIndex}>
                    <div className="starred-panel-section-header">
                      <h4>{section.title}</h4>

                      <span>See all</span>
                    </div>

                    <div className="starred-card-row">
                      {section.items.map((item) => {
                        const currentIndex = `${section.type}-${item.id}`;

                        const isActive = selectedMore === currentIndex;

                        return (
                          <div
                            key={currentIndex}
                            className="starred-image"
                            onMouseEnter={() => setHoveredImage(currentIndex)}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            <img
                              src={item.img || Template1}
                              alt=""
                              className="small-card"
                            />

                            <img
                              src={StarIcon}
                              alt=""
                              className="starred-favorite-icon"
                              onClick={(e) => handleUnstar(e, item)}
                            />

                            {(hoveredImage === currentIndex || isActive) && (
                              <img
                                src={isActive ? SelectMore : More}
                                alt=""
                                className="starred-more-icon"
                                onClick={(e) =>
                                  handleMoreClick(
                                    e,
                                    currentIndex,
                                    e.currentTarget.closest(".starred-image"),
                                  )
                                }
                              />
                            )}

                            {/* DROPDOWN */}

                            {isActive && (
                              <div
                                className="starred-panel-more-dropdown"
                                ref={dropdownRef}
                                style={{
                                  position: "fixed",
                                  top: `${dropdownPos.top}px`,
                                  left: `${dropdownPos.left}px`,
                                  zIndex: 999999,
                                }}
                              >
                                <div className="starred-panel-dropdown-top">
                                  <h3>
                                    {item.title || "No Name"}
                                  </h3>

                                  <p>{selectedItem?.created_by || ""}</p>

                                  <button
                                    onClick={() => handleViewMore(selectedItem)}
                                  >
                                    View More
                                  </button>
                                </div>

                                {/* TAGS */}

                                <div className="starred-panel-dropdown-tags">
                                  {[
                                    selectedItem?.tag1,
                                    selectedItem?.tag2,
                                    selectedItem?.tag3,
                                    selectedItem?.tag4,
                                    selectedItem?.tag5,
                                  ]
                                    .filter(Boolean)
                                    .map((tag, index) => (
                                      <span key={index}>{tag}</span>
                                    ))}
                                </div>

                                {/* ACTIONS */}

                                <div className="starred-panel-dropdown-actions">
                                  <div
                                    className="starred-panel-dropdown-item"
                                    onMouseDown={(e) =>
                                      handleUnstar(e, selectedItem)
                                    }
                                  >
                                    <img src={Star} alt="" />

                                    <span>Unstar</span>
                                  </div>

                                  <div
                                    className="starred-panel-dropdown-item"
                                    onClick={() => setSelectedMore(null)}
                                  >
                                    <img src={Report} alt="" />

                                    <span>Report</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StarredPanel;
 