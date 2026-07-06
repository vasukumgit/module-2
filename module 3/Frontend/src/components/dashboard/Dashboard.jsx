import { useState, useEffect } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import DashboardSidebar from "./DashboardLayout/DashboardSidebar";
import {
  FiFolder,
  FiPlus,
  FiBell,
  FiUser,
  FiRefreshCw,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { Crown } from "lucide-react";
import Home from "./Home/Home";
import Templates from "./Templates/Templates";
import Projects from "./Projects/Projects";
import Profile from "./Profile/Profile";
import Notifications from "./Notifications/Notifications";
import TrashView from "./TrashView/TrashView";
import Createdesign from "./Createdesign/Createdesign";

function Dashboard() {
  const [showPricing, setShowPricing] = useState(false);
  const [billing, setBilling] = useState("yearly");
  const [showCreatedesign, setShowCreatedesign] = useState(false);
  const [selectedTab, setSelectedTab] = useState("poster");
  const [clickedBtn, setClickedBtn] = useState(null);

  //toggle theme

  const handleClick = (type) => {
    setClickedBtn(type);

    setTimeout(() => {
      setClickedBtn(null);
    }, 1000); // 1 seconds
  };

  // To open the tabs
  const openCreateDesign = (tab) => {
    setSelectedTab(tab);
    setShowCreatedesign(true);
  };

  const [showProjectSearch, setShowProjectSearch] = useState(false);

  return (
    <div className="dashboard">
      {/* ================= TOP HEADER ================= */}
      {/* <Dashboard_Header
        theme={theme}
        toggleTheme={toggleTheme}
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        userData={userData}
      /> */}

      {/* ================= BODY ================= */}
      <div className="dashboard-body">
        <DashboardSidebar />

        {/* ============ MAIN CONTENT ============ */}

        <Home
          // showSearchDropdown={showSearchDropdown}
          // setShowSearchDropdown={setShowSearchDropdown}
          handleClick={handleClick}
          clickedBtn={clickedBtn}
          openCreateDesign={openCreateDesign}
        />

        {/* {activeMenu === "template" && (
            <Templates
              showProjectSearch={showProjectSearch}
              setShowProjectSearch={setShowProjectSearch}
              handleClick={handleClick}
              clickedBtn={clickedBtn}
            />
          )}

          {activeMenu === "projects" && (
            <Projects
              showProjectSearch={showProjectSearch}
              setShowProjectSearch={setShowProjectSearch}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {activeMenu === "notifications" && (
            <Notifications isOverlay={false} />
          )}

          {showNotification && (
            <Notifications
              isOverlay={true}
              setShowNotification={setShowNotification}
            />
          )}

          {showProfile && (
            <Profile userData={userData} setShowProfile={setShowProfile} />
          )}

          {activeMenu === "trash" && <TrashView />} */}

        {showCreatedesign && (
          <Createdesign
            setShowCreatedesign={setShowCreatedesign}
            initialTab={selectedTab}
          />
        )}

        {showPricing && (
          <div
            className="pricing-modal-overlay"
            onClick={() => setShowPricing(false)}
          >
            <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="pricing-close"
                onClick={() => setShowPricing(false)}
              >
                ✕
              </button>

              <h1 className="pricing-title">
                Choose Your <span>Creative</span> Plan
              </h1>

              {/* Toggle */}
              <div className="billing-toggle">
                <button
                  className={billing === "yearly" ? "active" : ""}
                  onClick={() => setBilling("yearly")}
                >
                  Yearly
                  <span className="save-badge">SAVE UP TO 20%</span>
                </button>

                <button
                  className={billing === "monthly" ? "active" : ""}
                  onClick={() => setBilling("monthly")}
                >
                  Monthly
                </button>
              </div>

              <div className="plans-container">
                {/* FREE */}
                <div className="plan-card">
                  <h3>Free</h3>
                  <h2>
                    ₹0 <span>/month</span>
                  </h2>
                  <p className="sub-text">Start for free</p>

                  <button className="plan-btn disabled">Current Plan</button>

                  <div className="features">
                    <p>✓ Limited templates</p>
                    <p>✓ 1GB storage</p>
                    <p>✓ Export PNG & JPG</p>
                    <p>✓ Max 5 projects</p>
                  </div>
                </div>

                {/* PROFESSIONAL */}
                <div className="plan-card featured">
                  <h3>Professional</h3>
                  <h2>
                    {billing === "yearly" ? "₹799" : "₹999"}
                    <span>/month</span>
                  </h2>
                  <p className="sub-text">
                    {billing === "yearly"
                      ? "Billed annually"
                      : "Billed monthly"}
                  </p>

                  <button className="plan-btn primary">Upgrade</button>

                  <div className="features">
                    <p>✓ Full template library</p>
                    <p>✓ Premium assets</p>
                    <p>✓ 50GB storage</p>
                    <p>✓ PDF export</p>
                    <p>✓ Version history</p>
                  </div>
                </div>

                {/* ENTERPRISE */}
                <div className="plan-card">
                  <h3>Enterprise</h3>
                  <h2>
                    {billing === "yearly" ? "₹2799" : "₹3499"}
                    <span>/month</span>
                  </h2>
                  <p className="sub-text">
                    {billing === "yearly"
                      ? "Billed annually"
                      : "Billed monthly"}
                  </p>

                  <button className="plan-btn">Request a Trial</button>

                  <div className="features">
                    <p>✓ Unlimited storage</p>
                    <p>✓ Advanced version control</p>
                    <p>✓ Team collaboration</p>
                    <p>✓ Priority support</p>
                  </div>
                </div>
              </div>

              <p className="pricing-footer">
                No contracts. Cancel anytime. 100% secure payments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
