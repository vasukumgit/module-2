import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import crown from "../../../assets/crown.svg"
import { useNavigate } from "react-router-dom";

import {
  FiChevronRight,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiBookOpen,
  FiLogOut
} from "react-icons/fi";

function Profile({ setShowProfile }) {

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileContainer = document.querySelector('.profile-container');
      if (profileContainer && !profileContainer.contains(event.target)) {
        setShowProfile(false);
      }
    };

    // document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowProfile]);
 
  useEffect(() => {
 
    const fetchProfile = async () => {
 
      const token = localStorage.getItem("token");
 
      if (!token) {
        setLoading(false);
        return; // just stop, don't redirect
      }
 
      try {
 
        const res = await axios.get(
          "http://localhost:5050/api/profile/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
 
        setUserData(res.data);
 
      } catch (error) {
 
        console.log("Profile fetch error:", error);
 
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setUserData({});
          setLoading(false);
        }
 
      } finally {
        setLoading(false);
      }
 
    };
 
    fetchProfile();
 
  }, []);
 
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
 
  return (
    <div
      className="profile-container"
    >
      <div className="profile-card">
 
        {loading ? (
          <div className="profile-loading">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-info">
 
                <img
                  src={userData.profile_image || "https://i.pravatar.cc/150"}
                  alt="profile"
                  className="profile-avatar"
                />
 
                <div>
                  <h3>{userData.name || "New User"}</h3>
                  <p>{userData.email || "No email"}</p>
                </div>
 
              </div>
 
              <div className="arrow" onClick={()=>{navigate("/profile-settings")}}>
                <FiChevronRight className="profile-arrow" />
              </div>
            </div>
 
            <div className="plan-section">
              <div className="plan-inner">
                
                <p className="plan-label">Current Plan</p>

                <div className="plan-grid">
                  <div className="plan-left">
                    <h4>{userData.plan_name || "Free Trial"}</h4>
                    <p>Best for trying out before making a purchase</p>
                  </div>

                  <div className="plan-right">
                    <h4>${userData.plan_price || 0}</h4>
                    <span>per month</span>
                  </div>
                </div>

                <button className="upgrade-btn">
                  <img src={crown} alt="" />
                  Upgrade to premium
                </button>

              </div>
            </div>
 
            <div className="links">
 
              <div className="link-item" onClick={()=>{navigate("/team-management")}}>
                <FiUsers />
                <span>Team Management</span>
              </div>
 
              <div className="link-item" onClick={()=>{navigate("/app-settings")}}>
                <FiSettings />
                <span>App Settings</span>
              </div>
 
              <div className="link-item">
                <FiHelpCircle />
                <span>Help Center</span>
              </div>
 
              <div className="link-item">
                <FiBookOpen />
                <span>Tutorials</span>
              </div>
 
            </div>
 
            <div className="signout" onClick={logout}>
              <FiLogOut />
              <span>Signout</span>
            </div>
 
          </>
        )}
 
      </div>
    </div>
  );
}

export default Profile;
