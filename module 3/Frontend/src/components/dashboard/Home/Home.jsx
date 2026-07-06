import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Layers, CreditCard, Presentation, Plus } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import Createdesign from "../Createdesign/Createdesign"; // adjust path
import "./Home.css";

// icons
import frame1 from "../../../assets/Frames/frame1.png";
import frame2 from "../../../assets/Frames/frame2.png";
import frame3 from "../../../assets/Frames/frame3.png";
import Recents_empty_state from "../../../assets/Recents_empty_state.svg";

export default function Home({ handleClick, clickedBtn, openCreateDesign }) {
  // const [showCreatedesign, setShowCreatedesign] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-hero-frame">
          {/* Floating Images */}
          <img src={frame1} className="dashboard-hero-img img-left" />
          <img src={frame2} className="dashboard-hero-img img-right-top" />
          <img src={frame3} className="dashboard-hero-img img-right-bottom" />

          <h1 className="dashboard-title">
            What would you like to <span>create</span> today?
          </h1>

          <SearchBar />
        </div>

        {/* rest of content */}
      </div>

      <div className="recents">
        <div className="recent-actions">
          <h2>Recents</h2>
          <div className="action-buttons">
            <button
              className={`action-btn Poster ${clickedBtn === "Poster" ? "clicked" : ""}`}
              onClick={() => {
                handleClick("Poster");
                openCreateDesign("poster");
              }}
            >
              <div className="left icon-business">
                <Layers size={18} />
              </div>
              <div className="right">
                <span>Poster</span>
              </div>
            </button>

            <button
              className={`action-btn Business ${clickedBtn === "Business Card" ? "clicked" : ""}`}
              onClick={() => {
                handleClick("Business Card");
                openCreateDesign("business");
              }}
            >
              <div className="left icon-card">
                <CreditCard size={18} />
              </div>
              <div className="right">
                <span>Business Card</span>
              </div>
            </button>

            <button
              className={`action-btn Presentation ${clickedBtn === "Presentation" ? "clicked" : ""}`}
              onClick={() => {
                handleClick("Presentation");
                openCreateDesign("presentation");
              }}
            >
              <div className="left icon-presentation">
                <Presentation size={18} />
              </div>
              <div className="right">
                <span>Presentation</span>
              </div>
            </button>

            <button
              className={`action-btn Create-New ${clickedBtn === "Custom Size" ? "clicked" : ""}`}
              onClick={() => {
                handleClick("Custom Size");
                openCreateDesign("custom");
              }}
            >
              <div className="left icon-custom">
                <Plus size={18} />
              </div>
              <div className="right">
                <span>Create New</span>
              </div>
            </button>
          </div>
        </div>
        {/* EMPTY STATE */}
        <div className="recent-card">
          <div className="recent-icons">
            <img src={Recents_empty_state} />
          </div>

          <p>No recent files</p>
          <span>Files you save or create will appear here</span>

          <button
            className='recent-create ${clickedBtn === "Custom Size" ? "clicked" : ""}'
            onClick={() => {
              handleClick("Custom Size");
              openCreateDesign("custom");
            }}
          >
            <FiPlus /> Create new
          </button>
        </div>
      </div>
      {/* 
      {showCreatedesign && (
          <Createdesign setShowCreatedesign={setShowCreatedesign} />
        )} */}
    </div>
  );
}
