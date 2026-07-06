import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";
import logo from "../../assets/logo.png"


const Header = () => {
  const navigate = useNavigate();

  // Check system preference and local storage for initial theme
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") : null;
  const prefersDark = typeof window !== 'undefined' ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
  const [isDark, setIsDark] = useState(savedTheme ? savedTheme === "dark" : prefersDark);

  // Apply theme to document
  // const applyTheme = (dark) => {
  //   if (dark) {
  //     document.documentElement.classList.add("dark-mode");
  //     document.documentElement.classList.remove("light-mode");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.add("light-mode");
  //     document.documentElement.classList.remove("dark-mode");
  //     localStorage.setItem("theme", "light");
  //   }
  // };

  // Apply theme on mount
  // useEffect(() => {
  //   applyTheme(isDark);
  // }, []);

  // const toggleTheme = () => {
  //   setIsDark(!isDark);
  //   applyTheme(!isDark);
  // };

  return (

    <header className="header-wrapper">
      <div className="app-header">
        <div className="header-left">
          <Link to="/" className="logo">
            <div className="dashboard-header-logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="dashboard-logo-text">
              <h2 className="dashboard-logo-title">Stackly</h2>
              <p className="dashboard-logo-sub">Studio</p>
            </div>
          </Link>
        </div>

        <nav className="header-center">
          <a href="#" className="nav-link">Design</a>
          <a href="#" className="nav-link">Product</a>
          <a href="#" className="nav-link">Plans</a>
          <a href="#" className="nav-link">Help</a>
        </nav>

        <div className="header-right">
          {/* Theme Toggle Button */}
          {/* <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {isDark ? (
              <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button> */}

          {/* Auth Buttons */}
          <div className="auth-combined">
            <button onClick={() => navigate("/login")}>
              Signup | Login
            </button>
            {/* <span className="button-divider"> / </span>
            <button onClick={() => navigate("/login")}>
              Login
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
 