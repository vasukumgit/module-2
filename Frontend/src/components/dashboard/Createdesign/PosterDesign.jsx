import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import design1 from "../../../assets/Create-Design/Design-template1.png";
import design2 from "../../../assets/Create-Design/Design-template2.png";
import design3 from "../../../assets/Create-Design/Design-template3.png";
import design4 from "../../../assets/Create-Design/Design-template4.png";
import design5 from "../../../assets/Create-Design/Design-template5.png";
import design6 from "../../../assets/Create-Design/Design-template6.png";
import design7 from "../../../assets/Create-Design/Design-template7.png";
import design8 from "../../../assets/Create-Design/Design-template8.png";
import back_arrow from "../../../assets/Create-Design/back_arrow.svg";
import move_arrow from "../../../assets/Create-Design/move_arrow.svg";
import dimension_one from "../../../assets/Create-Design/dimension_one.png";
import dimension_two from "../../../assets/Create-Design/dimension_two.png";
import dimension_three from "../../../assets/Create-Design/dimension_three.png";
import dimension_four from "../../../assets/Create-Design/dimension_four.png";
import instagram from "../../../assets/Create-Design/instagram.svg";
import youtube from "../../../assets/Create-Design/youtube.svg";
import linkedin from "../../../assets/Create-Design/linkedin.svg";
import search from "../../../assets/search.svg";
const categories = ["Popular", "Instagram", "Facebook", "X (Twitter)", "Youtube", "Linkedin"];
const sizes = [
  { title: "Instagram Post", dimensions: "1080 x 1350 px", label: "72 PPI", icon: instagram, frame: dimension_one },
  { title: "Instagram Story", dimensions: "1080 x 1920 px", label: "72 PPI", icon: instagram, frame: dimension_two },
  { title: "YouTube Thumbnail", dimensions: "1280 x 720 px", label: "72 PPI", icon: youtube, frame: dimension_three },
  { title: "LinkedIn Post", dimensions: "1080 x 1080 px", label: "72 PPI", icon: linkedin, frame: dimension_four },
  { title: "LinkedIn Banner", dimensions: "1584 x 396 px", label: "72 PPI", icon: linkedin, frame: dimension_one },
  { title: "Instagram Story", dimensions: "1080 x 1920 px", label: "72 PPI", icon: instagram, frame: dimension_two }
];
const templates = [
  { img: design1, title: "Modern Biryani Food Post", dimensions: "1080 x 1350 px" },
  { img: design2, title: "YouTube Growth Thumbnail", dimensions: "1280 x 720 px" },
  { img: design3, title: "Logistics Service Post", dimensions: "1080 x 1080 px" },
  { img: design4, title: "New Collection Coming Soon", dimensions: "1080 x 1350 px" },
  { img: design5, title: "Digital Marketing Poster", dimensions: "1080 x 1350 px" },
  { img: design6, title: "Meeting Room Business Post", dimensions: "1080 x 1080 px" },
  { img: design7, title: "Real Estate Promotion", dimensions: "1080 x 1080 px" },
  { img: design8, title: "Travel Agency Banner", dimensions: "1080 x 1080 px" }
];
export default function PosterDesign() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [searchTerm, setSearchTerm] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);
  const handleLeftClick = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };
  const handleRightClick = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };
  const filteredTemplates = templates.filter((item) => {
    const matchesSearch = (item.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Popular" || (item.category || "").toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  const handleSizeClick = async (item) => {
    try {
      const [width, height] = item.dimensions.toLowerCase().replace("px", "").split("x").map(v => parseInt(v.trim()));
      const payload = {
  title: item.title,
  name: item.title,
  width,
  height,
  type: "poster",
};
 console.log("Sending Payload:", payload);
      const res = await axios.post(
        "http://localhost:5050/api/cloud-status",
         payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const targetId =
      res.data.projectId ||
      res.data.data?.design_id ||
      res.data.data?.project_id;
      navigate(`/editor/${targetId}`);
    } catch (err) {
      console.error(err);
    }
  };
  const handleTemplateClick = async (template) => {
    try {
      const [width, height] = template.dimensions.toLowerCase().replace("px", "").split("x").map(v => parseInt(v.trim()));
      const res = await axios.post(
        "http://localhost:5050/api/designs",
        { name: template.title, width, height },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const targetId = res.data.projectId || res.data.data?.design_id;
      navigate(`/editor/${targetId}`, { state: { selectedTemplate: template } });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="tab-inner">
      {/* HEADER */}
      <div className="poster-header-container">
        <div className="poster-search-wrapper">
          <img src={search} alt="search" className="poster-search-icon" />
          <input
            type="text"
            placeholder="Search templates"
            className="poster-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="poster-nav-tabs">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`poster-tab-btn ${activeCategory === cat ? "poster-tab-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* CONTENT */}
      <div className="poster-content-container">
        <div className="pop">
          <div className="poster-card-container">
            <div className="pop-title">
              <h4>Popular Dimensions</h4>
              <div className="poster-nav-buttons">
                <button onClick={handleLeftClick} disabled={!canScrollLeft} className={`poster-back-arrow ${!canScrollLeft ? "arrow-disabled" : ""}`}>
                  <div className="poster-back-arrow-icon"><img src={back_arrow} alt="back" /></div>
                </button>
                <button onClick={handleRightClick} disabled={!canScrollRight} className={`poster-move-arrow ${!canScrollRight ? "arrow-disabled" : ""}`}>
                  <div className="poster-move-arrow-icon"><img src={move_arrow} alt="next" /></div>
                </button>
              </div>
            </div>
            <div className="card-row" ref={scrollRef}>
              {sizes.map((item, index) => (
                <div key={index} className="size-card" onClick={() => handleSizeClick(item)}>
                  <div className="card-header">
                    <p>{item.title}</p>
                    <img src={item.icon} className={`card-icon ${item.title}`} alt="icon" />
                  </div>
                  <div className="card-frame"><img src={item.frame} alt="frame" /></div>
                  <div className="card-footer">
                    <span className="dimension">{item.dimensions}</span>
                    <span className="label">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* TEMPLATE SECTION */}
          <div className="poster-popular-templates">
            <div className="popular-template-title"><h4>Popular Templates</h4></div>
            <div className="popular-template-cards">
              {filteredTemplates.length === 0 ? (
                <p>No templates found</p>
              ) : (
                filteredTemplates.map((item, index) => (
                  <div key={index} className="template-card" onClick={() => handleTemplateClick(item)}>
                    <div className="template-image-wrapper"><img src={item.img} alt="template" className="template-image" /></div>
                    <div className="template-content">
                      <p className="template-title">{item.title}</p>
                      <span className="template-dimension">{item.dimensions}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}