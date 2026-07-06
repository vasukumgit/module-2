import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import "./AppSetting.css";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import DashboardSidebar from "../../DashboardLayout/DashboardSidebar";

const AppSetting = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [exportFormat, setExportFormat] = useState("Ask everytime(Default)");
  const [exportQuality, setExportQuality] = useState("Ask everytime(Default)");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/appsetting", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data.settings;
        setEmailNotif(data?.email_notifications ?? true);
        setPushNotif(data?.push_notifications ?? true);

        setExportFormat(data?.export_format ?? "Ask everytime(Default)");
        setExportQuality(data?.export_quality ?? "Ask everytime(Default)");
        setLanguage(data?.app_language ?? "en");
      } catch (err) {
        console.log(err);
      }
    };

    fetchSettings();
  }, []);

  //update function

  const updateSettings = async (updatedData) => {
    try {
      const payload = {
        email_notifications: updatedData.email_notifications ?? emailNotif,
        push_notifications: updatedData.push_notifications ?? pushNotif,
        export_format: updatedData.export_format ?? exportFormat,
        export_quality: updatedData.export_quality ?? exportQuality,
        app_language: updatedData.app_language ?? language,
      };

      if (updatedData.export_format) setExportFormat(updatedData.export_format);
      if (updatedData.export_quality)
        setExportQuality(updatedData.export_quality);
      if (updatedData.app_language) setLanguage(updatedData.app_language);

      await axios.put("http://localhost:5050/api/appsetting", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="container-inner-page">
            <Sidebar />
            <div className="right-container">
              <div className="settings-page">
                <header className="settings-header">
                  <h3 className="settings-main-title">App Settings</h3>
                  <p className="settings-main-desc">
                    Manage your preferences and personalize your experience.
                  </p>
                </header>

                {/* Notifications */}
                <section className="settings-section">
                  <h4 className="section-title-app">Notification</h4>
                  <p className="section-desc">
                    Control how you receive updates and alerts.
                  </p>

                  <div className="settings-row">
                    <div className="settings-info">
                      <h4 className="settings-label">Email Notification</h4>
                      <p className="settings-help-text">
                        Receive important updates, billing alerts, and product
                        announcements via email.
                      </p>
                    </div>

                    <Toggle //BE change for DB
                      active={emailNotif}
                      onClick={() => {
                        const newvalue = !emailNotif;
                        setEmailNotif(newvalue);
                        updateSettings({ email_notifications: newvalue });
                      }}
                    />
                  </div>

                  <div className="settings-row">
                    <div className="settings-info">
                      <h4 className="settings-label">Push Notification</h4>
                      <p className="settings-help-text">
                        Get real-time in-app notifications for comments,
                        mentions, and shared projects.
                      </p>
                    </div>
                    <Toggle
                      active={pushNotif} //BE change
                      onClick={() => {
                        const newvalue = !pushNotif;
                        setPushNotif(newvalue);
                        updateSettings({ push_notifications: newvalue });
                      }}
                    />
                  </div>
                </section>

                {/* Export Defaults */}
                <section className="settings-section-default">
                  <h4 className="section-title-app">Export Defaults</h4>
                  <p className="section-desc">
                    Set your default export behavior.
                  </p>

                  <div className="settings-row">
                    <div className="settings-info">
                      <h4 className="settings-label">Export Format</h4>
                      <p className="settings-help-text">
                        Choose your preferred file format when exporting
                        designs.
                      </p>
                    </div>

                    <Dropdown
                      options={[
                        { label: "Ask everytime(Default)", value: "default" },
                        { label: "PNG", value: "png" },
                        { label: "JPG", value: "jpg" },
                        { label: "PDF", value: "pdf" },
                        { label: "JPEG", value: "jpeg" },
                        { label: "SVG", value: "svg" },
                      ]}
                      defaultValue={exportFormat}
                      onChange={(val) => updateSettings({ export_format: val })}
                    />
                  </div>

                  <div className="settings-row">
                    <div className="settings-info">
                      <h4 className="settings-label">Export Quality</h4>
                      <p className="settings-help-text">
                        Set the default resolution or quality for exports.
                      </p>
                    </div>
                    <Dropdown
                      options={[
                        { label: "Ask everytime(Default)", value: "default" },
                        { label: "Low", value: "low" }, //Be changes for DB
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" },
                      ]}
                      defaultValue="Ask everytime(Default)"
                      onChange={(val) =>
                        updateSettings({ export_quality: val })
                      }
                    />
                  </div>
                </section>

                {/* Language */}
                <section className="settings-section-language">
                  <h4 className="section-title-app">Language Settings</h4>
                  <p className="section-desc">Customize your app language.</p>

                  <div className="settings-row">
                    <div className="settings-info">
                      <h4 className="settings-label">App Language</h4>
                      <p className="settings-help-text">
                        Select your preferred language for the interface.
                      </p>
                    </div>
                    <Dropdown
                      options={[
                        { label: "English (India)", value: "en" },
                        { label: "English (UK)", value: "en-uk" },
                      ]}
                      defaultValue="English (India)"
                      showSearch
                      onChange={(val) => updateSettings({ app_language: val })}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const Toggle = ({ active, onClick }) => (
  <button
    onClick={onClick}
    className={`toggle-container ${active ? "toggle-on" : "toggle-off"}`}
    type="button"
  >
    <span
      className={`toggle-dot ${active ? "translate-on" : "translate-off"}`}
    />
  </button>
);

const Dropdown = ({ options, defaultValue, showSearch, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="custom-select-trigger"
        type="button"
      >
        <span>{selected}</span>
        <ChevronDown
          size={20}
          className={
            isOpen ? "rotate-180 transition-transform" : "transition-transform"
          }
        />
      </button>

      {isOpen && (
        <div className="dropdown-panel">
          {showSearch && (
            <div className="search-container">
              <div className="search-icon-wrapper">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                autoFocus
              />
            </div>
          )}
          <div className="dropdown-scroll-area">
            {options.map((opt) => (
              <button
                key={opt.value}
                className="dropdown-option"
                //BE change
                onClick={() => {
                  setSelected(opt.label);
                  setIsOpen(false);
                  onChange && onChange(opt.value);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSetting;
