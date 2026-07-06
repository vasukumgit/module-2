import { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeft, FiEdit2, FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5050/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfileData(res.data);
      } catch (error) {
        console.log("Profile fetch error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5050/api/profile",
        {
          full_name: profileData.full_name,
          profile_image: profileData.profile_image,
          role: profileData.role,
          time_zone: profileData.time_zone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);
      alert("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="profile-page-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page-container">
        {/* Header */}
        <div className="profile-page-header">
          <Link to="/dashboard" className="back-button">
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
          {!isEditing ? (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FiEdit2 />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="profile-page-card">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <img
                src={profileData.profile_image || "https://i.pravatar.cc/150"}
                alt="Profile"
                className="profile-page-avatar"
              />
              {isEditing && (
                <button className="change-avatar-btn">
                  <FiEdit2 />
                  Change Photo
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details-section">
            <h1 className="profile-name">
              {profileData.full_name || "New User"}
            </h1>
            <p className="profile-email">
              {profileData.email || "No email"}
            </p>

            {/* Form Fields */}
            <div className="profile-form">
              <div className="form-group">
                <label>
                  <FiUser />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={profileData.full_name || ""}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <span>{profileData.full_name || "Not provided"}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FiMail />
                  Email Address
                </label>
                <span>{profileData.email || "Not provided"}</span>
              </div>

              <div className="form-group">
                <label>
                  <FiPhone />
                  Phone Number
                </label>
                <span>{profileData.phone || "Not provided"}</span>
              </div>

              <div className="form-group">
                <label>
                  <FiMapPin />
                  Location
                </label>
                <span>{profileData.location || "Not provided"}</span>
              </div>

              <div className="form-group">
                <label>
                  <FiUser />
                  Current Plan
                </label>
                <span className="plan-badge">
                  {profileData.plan_name || "Free Trial"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
