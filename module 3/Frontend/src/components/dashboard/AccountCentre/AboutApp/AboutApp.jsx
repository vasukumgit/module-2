import React, { useState, useEffect } from "react";
import "./AboutApp.css";
import StarImage from "../../../../assets/AccountCentre/star.svg";
import Logo from "../../../../assets/logo.png";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import DashboardSidebar from "../../DashboardLayout/DashboardSidebar";

export default function AboutApp() {
  // CHANGED: Added new fields (release_tag, description, legalLinks)
  const [aboutdata, setAboutdata] = useState({
    version: "0.0.0",
    release_tag: "Alpha Release", // CHANGED
    company: "The Stackly",
    city: "Coimbatore, India",
    email: "support@stacklystudio.com",
    website: "www.stacklystudio.com",
    appname: "Stackly Studio",
    description: "", // CHANGED
    legalLinks: [], // CHANGED
  });

  // CHANGED: Added loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/about")
      .then((res) => {
        if (res?.data) {
          // CHANGED: Replaced merge logic with explicit mapping
          setAboutdata({
            version: res.data.app?.version || "0.0.0", // CHANGED
            release_tag: res.data.app?.release_tag || "Alpha Release", // CHANGED
            appname: res.data.app?.name || "Stackly Studio", // CHANGED
            description: res.data.app?.description || "", // CHANGED
            company: res.data.company?.product_by || "The Stackly", // CHANGED
            city: res.data.company?.headquarters || "Coimbatore, India", // CHANGED
            email: res.data.company?.contact || "support@stacklystudio.com", // CHANGED
            website: res.data.company?.website || "www.stacklystudio.com", // CHANGED
            legalLinks: res.data.legal?.links || [], // CHANGED
          });
        }

        // CHANGED: stop loading
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching about data:", err);

        // CHANGED: stop loading on error
        setLoading(false);
      });
  }, []);

  // CHANGED: New function for opening legal pages
  const openLegalPage = (url) => {
    window.open(`http://localhost:5050${url}`, "_blank");
  };

  // CHANGED: Added loading UI
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-body">
          <DashboardSidebar />
          <div className="dashboard-wrapper">
            <div className="container-inner-page">
              <Sidebar />
              <div className="right-container">
                <div className="about-container">
                  <p>Loading...</p> {/* CHANGED */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="container-inner-page">
            <Sidebar />
            <div className="right-container">
              <div className="about-container">
                <h1 className="about-title">About Tool</h1>

                <div className="brand-block">
                  <img src={Logo} alt="Stackly logo" className="about-logo" />
                  <div>
                    <p className="brand-title">Stackly</p>
                    <p className="brand-subtitle">S t u d i o</p>
                  </div>
                </div>

                {/* CHANGED: description now dynamic */}
                <p className="about-info">
                  {aboutdata.description ||
                    "Stackly Studio is a browser-based design platform that helps individuals and teams create, collaborate, and export professional graphics with ease."}
                </p>

                <div className="version-section">
                  <p className="version-text">
                    Current Version {aboutdata.version}
                  </p>
                  <div className="version-badge">
                    <img src={StarImage} alt="Star" />

                    {/* CHANGED: release tag dynamic */}
                    <span>{aboutdata.release_tag}</span>
                  </div>
                </div>

                <div className="section">
                  <h2 className="section-title">Company</h2>
                  <div className="section-text">
                    <p>Product by: {aboutdata.company}</p>
                    <p>Headquarters: {aboutdata.city}</p>
                    <p>Contact: {aboutdata.email}</p>
                    {/* <p>Website: <span className="section-span">{aboutdata.website}</span></p> */}
                    <p>
                      Website:{" "}
                      <span className="section-span">
                        <a
                          href="http://localhost:5050/api/about/website"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {aboutdata.website}
                        </a>
                      </span>
                    </p>
                  </div>
                </div>

                <div className="section">
                  <h2 className="section-title">Legal & Policies</h2>
                  <div className="link-list">
                    {/* CHANGED: dynamic legal links */}
                    {aboutdata.legalLinks.length > 0 ? (
                      aboutdata.legalLinks.map((link, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLegalPage(link.url); // CHANGED
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {link.label}
                        </a>
                      ))
                    ) : (
                      // CHANGED: fallback links
                      <>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLegalPage("/api/about/legal/terms");
                          }}
                        >
                          Terms of Service
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLegalPage("/api/about/legal/privacy");
                          }}
                        >
                          Privacy Policy
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLegalPage("/api/about/legal/cookies");
                          }}
                        >
                          Cookie Policy
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLegalPage("/api/about/legal/acceptable-use");
                          }}
                        >
                          Acceptable Use Policy
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLegalPage(
                              "/api/about/legal/third-party-licenses",
                            );
                          }}
                        >
                          Third-Party Licenses
                        </a>
                      </>
                    )}
                  </div>

                  <p className="muted-text">
                    All third-party trademarks, assets, and brand names remain
                    the property of their respective owners.
                  </p>
                </div>

                <div className="section">
                  <h2 className="section-title">Technology & Attribution</h2>
                  <p className="muted-text">
                    This product uses licensed open-source and third-party
                    software components. Full attribution details are available
                    in the Third-Party Licenses section.
                  </p>
                </div>

                <div className="section">
                  <h2 className="section-title">Availability</h2>
                  <p className="muted-text">
                    {aboutdata.appname} is accessible via modern web browsers
                    and optimized for global users. Language support and
                    features may vary by region.
                  </p>
                </div>

                <p className="footer-text">
                  © 2026 {aboutdata.company}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
