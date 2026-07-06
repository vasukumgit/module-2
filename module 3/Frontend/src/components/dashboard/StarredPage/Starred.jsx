import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import "./Starred.css";
import DashboardSidebar from "../DashboardLayout/DashboardSidebar";

// Frames
import frame1 from "../../../assets/Frames/frame1.png";
import frame2 from "../../../assets/Frames/frame2.png";
import frame3 from "../../../assets/Frames/frame3.png";

// Fallback Images
import templates1 from "../../../assets/Starred-page-image/templates1.png";
import photos1 from "../../../assets/Starred-page-image/Photos1.png";
import graphics1 from "../../../assets/Starred-page-image/Graphics1.png";

const API_URL = "http://localhost:5050/api/dashboardStarred";

function Starred({ showProjectSearch, setShowProjectSearch }) {
  const [starredItems, setStarredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    let token = localStorage.getItem("token");

    if (!token) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        token = user?.token;
      } catch (err) {
        console.error(err);
      }
    }

    return token;
  };

  const fetchStarredItems = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Starred API Response:", response.data);

      setStarredItems(response.data || []);
    } catch (err) {
      console.error("Starred fetch error:", err);

      if (err.response) {
        setError(
          `Error ${err.response.status}: ${
            err.response.data?.message || "Failed to load starred items"
          }`
        );
      } else {
        setError("Backend server is not running.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStarredItems();
  }, []);

  const handleUnstar = async (designId) => {
    try {
      const token = getToken();

      await axios.delete(`${API_URL}/${designId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStarredItems((prev) =>
        prev.filter((item) => item.id !== designId)
      );
    } catch (err) {
      console.error("Unstar error:", err);
      alert("Failed to remove starred item");
    }
  };

  const filteredItems = starredItems.filter((item) => {
    const title = item.title || item.name || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getImage = (item) => {
    if (item.thumbnail_url) return item.thumbnail_url;

    const type = (item.type || item.item_type || "").toLowerCase();

    if (type === "photo") return photos1;
    if (type === "graphic") return graphics1;

    return templates1;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="starred-page">

            {/* Banner */}
            <div className="background-frame">
              <h1 className="starred-page-title">
                Starred <span>Collection</span>
              </h1>

              <img
                src={frame1}
                className="background-img img-left"
                alt=""
              />

              <img
                src={frame2}
                className="background-img img-right-top"
                alt=""
              />

              <img
                src={frame3}
                className="background-img img-right-bottom"
                alt=""
              />

              {/* Search */}
              <div
                className={`starred-search ${
                  showProjectSearch ? "active" : ""
                }`}
              >
                <div
                  className="starred-search-box"
                  onClick={() => setShowProjectSearch(true)}
                >
                  <FiSearch className="starred-search-icon" />

                  <input
                    type="text"
                    placeholder="Search starred items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowProjectSearch(true)}
                    onBlur={() => setShowProjectSearch(false)}
                  />
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="starred-loading">
                Loading starred items...
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="starred-error">
                {error}
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredItems.length === 0 && (
                <div className="starred-empty">
                  No starred items found.
                </div>
              )}

            {/* Grid */}
            {!loading &&
              !error &&
              filteredItems.length > 0 && (
                <div className="starred-grid">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="starred-card"
                    >
                      <div className="starred-image-wrapper">
                        <img
                          src={getImage(item)}
                          alt={item.title || item.name}
                          className="starred-image"
                        />

                        <button
                          className="unstar-btn"
                          onClick={() =>
                            handleUnstar(item.id)
                          }
                          title="Remove Star"
                        >
                          ★
                        </button>
                      </div>

                      <div className="starred-card-content">
                        <h4>
                          {item.title ||
                            item.name ||
                            "Untitled"}
                        </h4>

                        <p>
                          {item.type ||
                            item.item_type ||
                            "Design"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Starred;