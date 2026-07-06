import React, { useState, useRef, useEffect } from "react";
import search from "../../../assets/search.svg";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import businesscard_one from "../../../assets/Create-Design/businesscard_one.png";
import businesscard_two from "../../../assets/Create-Design/businesscard_two.png";
import businesscard_three from "../../../assets/Create-Design/businesscard_three.png";
import businesscard_four from "../../../assets/Create-Design/businesscard_four.png";
import design1 from "../../../assets/Create-Design/Design-template1.png";
import design2 from "../../../assets/Create-Design/Design-template2.png";
import design3 from "../../../assets/Create-Design/Design-template3.png";
import design4 from "../../../assets/Create-Design/Design-template4.png";
export default function BusinessCard() {
  const scrollRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 
 
  const handleSizeClick = async (item) => {
    try {
      // Handles both "1050x600" and "1050 x 600" splits cleanly
      const [width, height] = item.dimensions
        .toLowerCase()
        .replace("px", "")
        .split("x")
        .map((v) => parseInt(v.trim()));
const payload = {
  title: item.title,
  name: item.title,
  width,
  height,
  type: "business_card",
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
      // Use clean standard card values if template bounds aren't explicitly declared
      const [width, height] = template.dimensions
        ? template.dimensions.toLowerCase().replace("px", "").split("x").map(v => parseInt(v.trim()))
        : [1050, 600];
      const res = await axios.post(
        "http://localhost:5050/api/designs",
        {
          name: template.title,
          width,
          height,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const targetId = res.data.projectId || res.data.data?.design_id;
      navigate(`/editor/${targetId}`, {
        state: {
          selectedTemplate: template,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  const sizes = [
    { title: "Standard", dimensions: "1050x600 px", label: "300 PPI", frame: businesscard_one },
    { title: "Square", dimensions: "752x752 px", label: "300 PPI", frame: businesscard_two },
    { title: "Rounded", dimensions: "1050x600 px", label: "300 PPI", frame: businesscard_three },
    { title: "Folded", dimensions: "1050x1200 px", label: "300 PPI", frame: businesscard_four }
  ];
  const templates = [
    { img: design1, title: "Corporate Business Card", dimensions: "1050 x 600 px" },
    { img: design2, title: "Modern Blue Card", dimensions: "1050 x 600 px" },
    { img: design3, title: "Minimal White Card", dimensions: "1050 x 600 px" },
    { img: design4, title: "Creative Agency Card", dimensions: "1050 x 600 px" },
  ];
  const filteredTemplates = templates.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="tab-inner">
      {/* HEADER */}
      <div className="poster-header-container">
        <div className="poster-search-wrapper">
          <img src={search} className="poster-search-icon" alt="search" />
          <input
            type="text"
            placeholder="Search templates"
            className="poster-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* CONTENT */}
      <div className="poster-content-container">
        <div className="pop">
          <div className="poster-card-container">
            <div className="pop-title">
              <h4>Business Card Sizes</h4>
            </div>
            {/* SCROLL ROW */}
            <div className="card-row" ref={scrollRef}>
              {sizes.map((item, index) => (
                <div key={index} className="size-card" onClick={() => handleSizeClick(item)}>
                  <div className="card-header">
                    <p>{item.title}</p>
                  </div>
                  <div className="card-frame">
                    <img src={item.frame} alt={item.title} />
                  </div>
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
            <div className="popular-template-title">
              <h4>Templates</h4>
            </div>
            <div className="popular-template-cards">
              {filteredTemplates.length === 0 ? (
                <div className="empty-state-wrapper">
                  <p>No templates found</p>
                </div>
              ) : (
                filteredTemplates.map((item, i) => (
                  <div key={i} className="template-card" onClick={() => handleTemplateClick(item)}>
                    <div className="template-image-wrapper">
                      <img src={item.img} className="template-image" alt={item.title} />
                    </div>
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