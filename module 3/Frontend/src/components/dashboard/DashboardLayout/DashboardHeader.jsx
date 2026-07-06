import "./DashboardHeader.css";
import Profile from "../Profile/Profile";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Notifications from "../Notifications/Notifications"


// header images
// logo
import logo from "../../../assets/logo.png";
// icons
import moon from "../../../assets/Svg/moon.svg";
import settings from "../../../assets/Svg/settings.svg";
import notification from "../../../assets/Svg/notification.svg";
import sun from "../../../assets/Svg/sun.svg";

function DashboardHeader() {
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // useEffect(() => {
  //   const root = document.documentElement;

  //   if (theme === "dark") {
  //     root.classList.add("dark");
  //   } else {
  //     root.classList.remove("dark");
  //   }

  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  // };
  useEffect(() => {
    const admin = document.querySelector(".admin-body");

    if (!admin) return; // safety check

    if (theme === "dark") {
      admin.classList.add("dark");
    } else {
      admin.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const handleClick = (type) => {
    setClickedBtn(type);

    setTimeout(() => {
      setClickedBtn(null);
    }, 1000); // 1 seconds
  };

  const [userData] = useState(() => {
    const firstNames = [
      "John",
      "Jane",
      "Michael",
      "Sarah",
      "David",
      "Emily",
      "Robert",
      "Lisa",
      "James",
      "Maria",
    ];
    const lastNames = [
      "Doe",
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
    ];

    const randomIndex = Math.floor(Math.random() * firstNames.length);
    const firstName = firstNames[randomIndex];
    const lastName = lastNames[randomIndex];

    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
    };
  });
  return (
    <>
      <header className="header">
        {/* LEFT SECTION */}
        <div className="header-left">
          <div className="dashboard-header-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="dashboard-logo-text">
            <h2 className="dashboard-logo-title">Stackly</h2>
            <p className="dashboard-logo-sub">Studio</p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="header-icons">
          {/* DARK MODE (optional later) */}
          <div className="icon-container" onClick={toggleTheme}>
            <div className="icon-inner">
              <img
                src={theme === "dark" ? sun : moon}
                alt="theme toggle"
                className="icon theme-icon"
              />
            </div>
          </div>

          {/* SETTINGS */}
          <NavLink
            // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
            className={({ isActive }) => `icon-container ${isActive ? "active" : ""}`}
            to="/profile-settings"
          >
            <div className="icon-inner">
              <img src={settings} alt="settings" className="icon" />
            </div>
          </NavLink>


          {/* NOTIFICATION */}
            <div
            className="icon-container"
            onClick={() => setShowNotification(!showNotification)}
          >
            <div className="icon-inner">
              <img src={notification} alt="notification" className="icon" />
            </div>
          </div>

          <div
            className="profile-wrapper"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            <div className="profile-avatar">
              <img src="https://i.pravatar.cc/40" alt="profile" />
            </div>

            {showProfile && (
              <Profile userData={userData} setShowProfile={setShowProfile} />
            )}
          </div>
        </div>
      </header>

      {/* {activeMenu === "notifications" && (
        <Notifications isOverlay={false} />
      )} */}

      {showNotification && (
        <Notifications
          isOverlay={true}
          setShowNotification={setShowNotification}
        />
      )}

    </>
  );
}

export default DashboardHeader;
