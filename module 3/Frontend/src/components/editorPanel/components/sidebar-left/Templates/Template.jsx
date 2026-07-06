import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
 
import Icon from "../../../../../assets/editor-panel/Template/Templateicon.svg";
import Zoom from "../../../../../assets/editor-panel/Template/Zoom.svg";
import License from "../../../../../assets/editor-panel/Template/License.svg";
import Orientation from "../../../../../assets/editor-panel/Template/Orientation.svg";
import Color from "../../../../../assets/editor-panel/Template/Color.svg";
import Downarrow from "../../../../../assets/editor-panel/arrow.svg";
import Star from "../../../../../assets/editor-panel/Template/Star.svg";
import Report from "../../../../../assets/editor-panel/Template/Report.svg";
import BackArrow from "../../../../../assets/editor-panel/Template/Backarrow.svg";
 
import DarkIcon from "../../../../../assets/editor-panel/Template/DarkIcon.svg";
import DarkLicense from "../../../../../assets/editor-panel/Template/DarkLicense.svg";
import DarkOrientation from "../../../../../assets/editor-panel/Template/DarkOrientation.svg";
import DarkZoom from "../../../../../assets/editor-panel/Template/DarkZoom.svg";
import DarkStar from "../../../../../assets/editor-panel/Template/DarkStar.svg";
import DarkReport from "../../../../../assets/editor-panel/Template/DarkReport.svg";
import "./Template.css";
 
function Template({ open, onClose ,templateId}) {
  const [isDark, setIsDark] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [blurTemplates, setBlurTemplates] = useState(false);
 
  const [recentTemplates, setRecentTemplates] = useState([]);
    const [tags, setTags] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [starredTemplates, setStarredTemplates] = useState([]);
  const [searchText, setSearchText] = useState("");
 
  const [licenseFilter, setLicenseFilter] = useState("");
  const [orientationFilter, setOrientationFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
 
  const [originalTemplates, setOriginalTemplates] = useState([]);
 
  const [position, setPosition] = useState({ x: 80, y: 100 });
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [dragging, setDragging] = useState(false);
 
  const dragRef = useRef({ offsetX: 0, offsetY: 0 });
  const menuRef = useRef(null);
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
 
  const userId = tokenUser.id;
/*
  =====================================================
  INITIAL LOAD
  =====================================================
  */
   useEffect(() => {
    if (!templateId) return;
    fetchTemplates();
    fetchRecentTemplates(); //changed here
    // loadRecentTemplates();
    fetchStarredTemplates();
  }, [templateId]);
 
 
  /*
  =====================================================
  CLICK OUTSIDE
  =====================================================
  */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
        setBlurTemplates(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  /*
  =====================================================
  GET ALL TEMPLATES
  =====================================================
  */
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/templates/related-templates/${templateId}`,
      );
      const templates = response.data.templates || [];
      console.log("related templates",templates);
     
      setAllTemplates(templates);
      setOriginalTemplates(templates);
    } catch (error) {
      console.log("GET TEMPLATE ERROR:", error);
    }
  };
 
  /*
  =====================================================
  GET RECENT TEMPLATES
  =====================================================
  */
  const fetchRecentTemplates = async () => {    //chaned here
    try {
      const response = await axios.get(
        "http://localhost:5050/api/templates/recent"
      );
      console.log("recent templates",response.data.templates);
     
      setRecentTemplates((response.data.templates || []).slice(0, 3));
    } catch (error) {
      console.log("GET RECENT TEMPLATE ERROR:", error);
    }
  };
  // const loadRecentTemplates = () => {
  //   const templates = JSON.parse(localStorage.getItem("recentTemplates")) || [];
  //   console.log("Recent Templates:", templates);
  //   setRecentTemplates(templates.slice(0, 3));
  //   // setRecentTemplates(templates);
  // }; //still here
 
  /*
  =====================================================
  GET STARRED TEMPLATES
  ✅ CHANGED: now uses /api/starred endpoint (same as StarredPanel)
  so both panels stay in sync
  =====================================================
  */
  const fetchStarredTemplates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/starred/${userId}`,
      );
      // ✅ CHANGED: read from response.data.data.templates
      const starredIds = (response.data.data?.templates || []).map(
        (item) => item.id,
      );
      setStarredTemplates(starredIds);
    } catch (error) {
      console.log("GET STARRED TEMPLATE ERROR:", error);
    }
  };
 
  /*
  =====================================================
  SEARCH TEMPLATE
  =====================================================
  */
  const searchTemplates = async (value) => {
    try {
      setSearchText(value);
      if (value.trim() === "") {
        fetchTemplates();
        return;
      }
      const response = await axios.get(
        `http://localhost:5050/api/templates/search?search=${value}`,
      );
      setAllTemplates(response.data.data || []);
    } catch (error) {
      console.log("SEARCH TEMPLATE ERROR:", error);
    }
  };
 
  /*
  =====================================================
  FILTER TEMPLATE
  =====================================================
  */
  const filterTemplates = async (license, orientation, color) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/templates/filter`,
        {
        params: {
      category: license, // adjust based on your backend
      type: orientation,
      industry: color
    }},
      );
      setAllTemplates(response.data.template || []);
    } catch (error) {
      console.log("FILTER TEMPLATE ERROR:", error);
    }
  };
 
  /*
  =====================================================
  STAR / UNSTAR TEMPLATE
  ✅ CHANGED: now uses /api/starred endpoint (same as StarredPanel)
  so both panels stay in sync
  =====================================================
  */
  const handleStar = async (templateId) => {
    console.log("starre template id",templateId);
   
    try {
      const isStarred = starredTemplates.includes(templateId);
 
      if (isStarred) {
        // ✅ CHANGED: unstar via DELETE /api/starred
        await axios.delete(`http://localhost:5050/api/starred`, {
          data: {
            user_id: userId,
            item_id: templateId,
            item_type: "template",
          },
        });
        // ✅ optimistic update
        setStarredTemplates((prev) => prev.filter((id) => id !== templateId));
      } else {
        // ✅ CHANGED: star via POST /api/starred
        await axios.post(`http://localhost:5050/api/starred`, {
          user_id: userId,
          item_id: templateId,
          item_type: "template",
        });
        // ✅ optimistic update
        setStarredTemplates((prev) => [...prev, templateId]);
      }
 
      // re-fetch to stay in sync with DB
      fetchStarredTemplates();
 
      setActiveMenu(null);
      setBlurTemplates(false);
    } catch (error) {
      console.log("STAR TEMPLATE ERROR:", error);
    }
  };
 
  /*
  =====================================================
  UPDATE LAST USED
  =====================================================
  */
  const updateLastUsed = async (templateId) => {
    try {
     await axios.post(
  `http://localhost:5050/api/templates/${templateId}/use`
);
      fetchRecentTemplates();
      // loadRecentTemplates();
    } catch (error) {
      console.log("UPDATE LAST USED ERROR:", error);
    }
  };
 
  /*
  =====================================================
  VIEW MORE
  =====================================================
  */
  const handleViewMore = async (template) => {
  try {
    const response = await axios.get(
      `http://localhost:5050/api/templates/details/${template.id}`
    );
 
    const templateData = response.data.templates;
 
    const tags = [
      templateData.tag1,
      templateData.tag2,
      templateData.tag3,
      templateData.tag4,
      templateData.tag5,
    ].filter(Boolean);
    console.log("TAGS:", tags);
 
    setTags(tags);
 
    if (tags.length > 0) {
      const related = originalTemplates.filter((t) => {
        const tTags = [t.tag1, t.tag2, t.tag3, t.tag4, t.tag5];
        return tags.some((tag) => tTags.includes(tag));
      });
 
      setAllTemplates(related);
    }
 
    setActiveMenu(null);
    setBlurTemplates(false);
  } catch (error) {
    console.log("VIEW MORE ERROR:", error);
  }
};
 
  /*
  =====================================================
  TAG SEARCH
  =====================================================
  */
  const handleTagSearch = (tag) => {
    const filtered = originalTemplates.filter((template) => {
      const tags = [
        template.tag1,
        template.tag2,
        template.tag3,
        template.tag4,
        template.tag5,
      ];
      return tags.includes(tag);
    });
    setAllTemplates(filtered);
    setActiveMenu(null);
    setBlurTemplates(false);
  };
 
  /*
  =====================================================
  FILTER BUTTON FUNCTIONS
  =====================================================
  */
  const handleLicenseFilter = (value) => {
    setLicenseFilter(value);
    filterTemplates(value, orientationFilter, colorFilter);
  };
 
  const handleOrientationFilter = (value) => {
    setOrientationFilter(value);
    filterTemplates(licenseFilter, value, colorFilter);
  };
 
  const handleColorFilter = (value) => {
    setColorFilter(value);
    filterTemplates(licenseFilter, orientationFilter, value);
  };
 
 
  /*
  =====================================================
  DRAG FUNCTIONS
  =====================================================
  */
  const handleMouseDown = (e) => {
    setDragging(true);
    dragRef.current = {
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
  };
 
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragRef.current.offsetX,
      y: e.clientY - dragRef.current.offsetY,
    });
  };
 
  const handleMouseUp = () => setDragging(false);
 
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);
 
  /*
  =====================================================
  HELPER — collect non-empty tags from a template
  =====================================================
  */
  const getTemplateTags = (template) => {
    return [
      template.tag1,
      template.tag2,
      template.tag3,
      template.tag4,
      template.tag5,
    ].filter(Boolean);
  };
 
  if (!open) return null;
 
  return (
    <div
      className={`editorpanel-template-overlay ${isDark ? "dark-mode" : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="editorpanel-template-container">
        {/* HEADER */}
        <div className="editor-panel-template-header">
          <div
            className="editorpanel-template-drag-area"
            onMouseDown={handleMouseDown}
          >
            <img
              src={activeMenu ? BackArrow : Icon}
              alt=""
              className="editorpanel-template-dot-icon-svg"
              onClick={() => {
                if (activeMenu) {
                  setActiveMenu(null);
                  setBlurTemplates(false);
                }
              }}
            />
          </div>
 
          <h3 className="editor-panel-template-template-heading">Templates</h3>
 
          <button className="editorpanel-template-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
 
        {/* BODY */}
        <div className="editorpanel-template-scroll">
          {/* SEARCH */}
          <div className="editor-panel-template-body">
            <div className="editorpanel-template-searchbox">
              <input
                type="text"
                placeholder="Search in templates"
                className="editorpanel-template-search-input"
                value={searchText}
                onChange={(e) => searchTemplates(e.target.value)}
              />
              <img
                src={isDark ? DarkZoom : Zoom}
                alt=""
                className="editorpanel-template-zoom-icon-svg"
              />
            </div>
          </div>
 
          {/* FILTERS */}
          <div className="editor-panel-template-filterbuttons">
            <button
              className="editor-panel-template-filterbuttons1"
              onClick={() => handleLicenseFilter("free")}
            >
              <img src={isDark ? DarkLicense : License} alt="" />
              License
              <img
                src={Downarrow}
                alt=""
                className="editorpanel-template-icon-svg"
              />
            </button>
 
            <button
              className="editor-panel-template-filterbuttons2"
              onClick={() => handleOrientationFilter("portrait")}
            >
              <img src={isDark ? DarkOrientation : Orientation} alt="" />
              Orientation
              <img
                src={Downarrow}
                alt=""
                className="editorpanel-template-icon-svg"
              />
            </button>
 
            <button
              className="editor-panel-template-filterbuttons3"
              onClick={() => handleColorFilter("blue")}
            >
              <img src={Color} alt="" />
              Color
              <img
                src={Downarrow}
                alt=""
                className="editorpanel-template-icon-svg"
              />
            </button>
          </div>
 
          {/* RECENTLY USED */}
          <h3 className="editor-template-recently-used">Recently used</h3>
 
          <div className="editor-panel-template-space">
            <div className="editor-panel-recent-grid">
              {recentTemplates.map((item) => (
                <div
                  key={item.id}
                  className="editor-panel-template-cards"
                  onClick={() => updateLastUsed(item.id)}
                >
                  {starredTemplates.includes(item.id) && (
                    <div className="editor-template-star-badge">⭐</div>
                  )}
 
                  {item.license === "premium" && (
                    <div className="editor-panel-template-premium-icon">👑</div>
                  )}
                  {/* <p>{item?.details?.template_name||item?.details?.title }</p> */}
 
                  {/* <img src={item.thumbnail} alt={item.template_name} />  //changed here */}
                  <img
                    src={item.img}
                    alt={item.title || "Template"}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/104x137?text=Template";
                    }}
                  />
                 
 
                  <div
                    className={`editor-template-dot-hover-more ${
                      activeMenu === item.id ? "editor-template-dot-active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPopupPosition({
                        top: rect.top,
                        left: rect.right + 12,
                      });
                      if (activeMenu === item.id) {
                        setActiveMenu(null);
                        setBlurTemplates(false);
                      } else {
                        setActiveMenu(item.id);
                        setBlurTemplates(true);
                      }
                    }}
                  >
                    ⋯
                  </div>
 
                  {activeMenu === item.id && (
                    <div
                      className="editor-template-popup-menu"
                      ref={menuRef}
                      style={{
                        position: "fixed",
                        top: popupPosition.top,
                        left: popupPosition.left,
                        zIndex: 9999,
                      }}
                    >
                      <h3>{item.title}</h3>
 
                      <p className="editor-template-popup-item">
                        {item.orientation}
                      </p>
 
                      {/* ✅ CHANGED: added e.stopPropagation() to prevent
                            card onClick from firing and adding to recently used */}
                      <button
                        className="editor-template-popup-item-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMore(item);
                        }}
                      >
                        View More
                      </button>
 
                      <hr />
 
                      <div className="editor-panel-buttons-header">
                     {getTemplateTags(item).map((tag) => (
                          <button
                            key={tag}
                            className={
                              tag === "Photos"
                                ? "editorpanel-template-photos"
                                : tag === "Aesthetics"
                                  ? "editorpanel-template-asthetics"
                                  : tag === "Business"
                                    ? "editorpanel-template-business"
                                    : "editorpanel-template-tags"
                            }
                            onClick={() => handleTagSearch(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
 
                      <hr />
 
                      <div className="editor-panel-template-icons-footer">
                        <div
                          className="editor-panel-template-icons-footer-svg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(item.id);
                          }}
                        >
                          <img src={isDark ? DarkStar : Star} alt="" />
                          <span>
                            {starredTemplates.includes(item.id)
                              ? "Starred"
                              : "Star"}
                          </span>
                        </div>
 
                        <div className="editor-panel-template-icons-footer-svg">
                          <img src={isDark ? DarkReport : Report} alt="" />
                          <span>Report</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
 
          {/* ALL TEMPLATES */}
          <h3 className="editor-template-recently-used">All Templates</h3>
 
          <div className="editor-panel-template-space">
            <div className="editor-panel-alltemplate-grid">
              {allTemplates && allTemplates.length > 0 ? (
                allTemplates.map((item) => (
                  <div
                    key={item.id}
                    className={`editor-panel-template-cards ${
                      blurTemplates && activeMenu !== item.id
                        ? "template-blur"
                        : ""
                    }`}
                    onClick={() => updateLastUsed(item.id)}
                  >
                    {starredTemplates.includes(item.id) && (
                      <div className="editor-template-star-badge">⭐</div>
                    )}
 
                    {item.license === "premium" && (
                      <div className="editor-panel-template-premium-icon">
                        👑
                      </div>
                    )}
 
                    <img
                      src={item.img}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200";
                      }}
                    />
 
                    <div
                      className={`editor-template-dot-hover-more ${
                        activeMenu === item.id
                          ? "editor-template-dot-active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPopupPosition({
                          top: rect.top,
                          left: rect.right + 12,
                        });
                        if (activeMenu === item.id) {
                          setActiveMenu(null);
                          setBlurTemplates(false);
                        } else {
                          setActiveMenu(item.id);
                          setBlurTemplates(true);
                        }
                      }}
                    >
                      ⋯
                    </div>
 
                    {activeMenu === item.id && (
                      <div
                        className="editor-template-popup-menu"
                        ref={menuRef}
                        style={{
                          position: "fixed",
                          top: popupPosition.top,
                          left: popupPosition.left,
                          zIndex: 9999,
                        }}
                      >
                        <h3>{item.title}</h3>
 
                        <p className="editor-template-popup-item">
                          {item.orientation}
                        </p>
 
                        {/* ✅ CHANGED: added e.stopPropagation() to prevent
                            card onClick from firing and adding to recently used */}
                        <button
                          className="editor-template-popup-item-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMore(item);
                          }}
                        >
                          View More
                        </button>
 
                        <hr />
 
                        <div className="editor-panel-buttons-header">
                          {getTemplateTags(item).map((tag) => (
                            <button
                              key={tag}
                              className={
                                tag === "Photos"
                                  ? "editorpanel-template-photos"
                                  : tag === "Aesthetics"
                                    ? "editorpanel-template-asthetics"
                                    : tag === "Business"
                                      ? "editorpanel-template-business"
                                      : "editorpanel-template-tags"
                              }
                              onClick={() => handleTagSearch(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
 
                        <hr />
 
                        <div className="editor-panel-template-icons-footer">
                          <div
                            className="editor-panel-template-icons-footer-svg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStar(item.id);
                            }}
                          >
                            <img src={isDark ? DarkStar : Star} alt="" />
                            <span>
                              {starredTemplates.includes(item.id)
                                ? "Starred"
                                : "Star"}
                            </span>
                          </div>
 
                          <div className="editor-panel-template-icons-footer-svg">
                            <img src={isDark ? DarkReport : Report} alt="" />
                            <span>Report</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No templates found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Template;
 
 