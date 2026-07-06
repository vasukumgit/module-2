import { Link } from "react-router-dom";
import "./Auth.css";

import D1 from "../../assets/Auth-Frame/Auth-Frame.png";
import Folder from "../../assets/Auth-Frame/folder.png";
import Gallery from "../../assets/Auth-Frame/File.png";
import Peoples from "../../assets/Auth-Frame/people.png";

// logo
import logo from "../../assets/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page">
      {/* ================= MAIN CONTENT ================= */}
      <div className="auth-content">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <Link to="/" className="auth-logo">
            <div>
              <img src={logo} alt="logo" />
            </div>

            <div className="auth-logo-text">
              <h2 className="auth-logo-title">Stackly</h2>
              <p className="auth-logo-sub">Studio</p>
            </div>
          </Link>

          {children}
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="design-preview">
            <section className="auth-design">
              {/* TEXT */}
              <div className="auth-design-text">
                <h1 className="auth-design-title">
                  Everything You Need to Design
                </h1>

                <p className="auth-design-subtitle">
                  Create graphics, collaborate with your team, and manage your
                  design workflow seamlessly in one unified creative workspace.
                </p>
              </div>

              {/* VISUAL */}
              <div className="auth-design-visual">
                <div className="auth-design-circle">
                  {/* CENTER IMAGE */}
                  <div className="auth-design-center">
                    <img src={D1} className="auth-design-image" alt="Design" />
                    <div className="auth-design-shadow"></div>
                  </div>

                  {/* INNER RING - TOP */}
                  <div className="orbit ring-inner">
                    <div className="orbit-item item-top green">
                      <img src={Folder} alt="gallery" />
                    </div>
                  </div>

                  {/* MIDDLE RING - LEFT */}
                  <div className="orbit ring-middle">
                    <div className="orbit-item item-left blue">
                      <img src={Gallery} alt="folder" />
                    </div>
                  </div>

                  {/* OUTER RING - RIGHT */}
                  <div className="orbit ring-outer">
                    <div className="orbit-item item-right purple">
                      <img src={Peoples} alt="people" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
