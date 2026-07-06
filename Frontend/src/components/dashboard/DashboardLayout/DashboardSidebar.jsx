import "./DashboardSidebar.css";
import { NavLink } from "react-router-dom";
import { FiHome, FiImage, FiFolder, FiTrash2 } from "react-icons/fi";

function DashboardSidebar({ activeMenu, setActiveMenu }) {
  const activePaths = ["/templates", "/templates-inner"];

  const isTemplate = activePaths.some((path) =>
    location.pathname.startsWith(path),
  );
  return (
    <aside className="sidebar">
      {/* <div className="sidebar-top"
                onMouseLeave={() => setShowProfile(false)}
            >
            <div
              className="profile-wrapper"
              onMouseLeave={() => setShowProfile(false)}
            >
              <div
                className="avatar"
                onMouseEnter={() => setShowProfile(true)}
              ></div>
            </div>

            <FiBell
              className="bell-icon"
              onClick={() => setShowNotification(!showNotification)}
            />
          </div> */}

      <nav className="sidebar-menu">
        <NavLink
          // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          to="/dashboard"
        >
          <FiHome />
          <span>Home</span>
        </NavLink>

        <NavLink
          // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
          className={`menu-item ${isTemplate ? "active" : ""}`}
          to="/templates"
        >
          <FiImage />
          <span>Template</span>
        </NavLink>

        <NavLink
          // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          to="/projects"
        >
          <FiFolder />  
          <span>Projects</span>
        </NavLink>

        <NavLink
          // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          to="/starred"
        >
          <FiFolder />  
          <span>Starred</span>
        </NavLink>

        {/* <div
          className={`menu-item ${activeMenu === "home" ? "active" : ""}`}
          onClick={() => setActiveMenu("home")}
        >
          <FiHome />
          <span>Home</span>
        </div>

        <div
          className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
          onClick={() => setActiveMenu("template")}
        >
          <FiImage />
          <span>Template</span>
        </div> */}

        {/* <div
          className={`menu-item ${activeMenu === "projects" ? "active" : ""}`}
          onClick={() => setActiveMenu("projects")}
        >
          <FiFolder />
          <span>Projects</span>
        </div> */}
      </nav>

      {/* Bottom Trash */}
      {/* <div
        className={`sidebar-bottom ${activeMenu === "trash" ? "active" : ""}`}
        onClick={() => setActiveMenu("trash")}
      >
        <FiTrash2 />
      </div> */}

      <NavLink
        // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
        className={({ isActive }) =>
          `sidebar-bottom ${isActive ? "active" : ""}`
        }
        to="/trash"
      >
        <FiTrash2 />
        {/* <span>Template</span> */}
      </NavLink>
    </aside>
  );
}

export default DashboardSidebar;
