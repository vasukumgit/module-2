import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./PhotoDropdown.css";

// Assets
import Drag from "../../../../../../assets/editor-panel/drag-icon.svg";
import Close from "../../../../../../assets/editor-panel/close.svg";
import Search from "../../../../../../assets/editor-panel/search.svg";
import ChevronDown from "../../../../../../assets/editor-panel/photodropdown/chevron-down.svg";
import LicenseIcon from "../../../../../../assets/editor-panel/photodropdown/key-icon.svg";
import TypeIcon from "../../../../../../assets/editor-panel/photodropdown/settings-icon.svg";
import ColorIcon from "../../../../../../assets/editor-panel/photodropdown/color-wheel.svg";

// LOCAL FALLBACK PHOTOS

import Rectangle1 from "../../../../../../assets/editor-panel/photodropdown/Rectangle-1.png";
import Rectangle2 from "../../../../../../assets/editor-panel/photodropdown/Rectangle-2.png";
import Rectangle3 from "../../../../../../assets/editor-panel/photodropdown/Rectangle-3.png";
import Rectangle4 from "../../../../../../assets/editor-panel/photodropdown/Rectangle-4.png";
import Rectangle5 from "../../../../../../assets/editor-panel/photodropdown/nature-1.jpg";

function PhotoDropdown({ setOpen, setActiveMenu, addImage, addElement }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOCAL FALLBACK PHOTOS
  const fallbackPhotos = [
    {
      id: 1,
      name: "Rectangle-1.png",
      asset_url: Rectangle1,
      layout: "square",
    },
    {
      id: 2,
      name: "Rectangle-2.png",
      asset_url: Rectangle2,
      layout: "portrait",
    },
    {
      id: 3,
      name: "Rectangle-3.png",
      asset_url: Rectangle3,
      layout: "landscape",
    },
    {
      id: 4,
      name: "Rectangle-4.png",
      asset_url: Rectangle4,
      layout: "square",
    },
  ];

  // FETCH PHOTOS FROM API
  // FETCH API PHOTOS
  useEffect(() => {
    fetchPhotos();
  }, [searchTerm]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5050/api/photos", {
        params: {
          source: "all",
          search: searchTerm,
        },
      });

      // API SUCCESS
      if (res.data && res.data.data && res.data.data.length > 0) {
        const formatted = res.data.data.map((item, index) => ({
          id: item.id || index,
          name: item.title || item.name || `photo-${index}`,
          asset_url: item.asset_url,
          layout: "square",
        }));

        setPhotos(formatted);
      } else {
        // EMPTY RESPONSE
        setPhotos(fallbackPhotos);
      }
    } catch (err) {
      console.log("photo fetch error", err);

      // API ERROR
      setPhotos(fallbackPhotos);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  // FILTERED PHOTOS
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [photos, searchTerm]);

  // DRAG PHOTO
  const handlePhotoDragStart = (e, photo) => {
    e.dataTransfer.setData("photoSrc", photo.asset_url);

    setTimeout(() => {
      setRecentPhotos((prev) => {
        const filtered = prev.filter((item) => item.id !== photo.id);

        return [photo, ...filtered].slice(0, 4);
      });
    }, 0);
  };

  // CLICK PHOTO
  const handlePhotoClick = (photo) => {
    if (addImage) {
      addImage(photo.asset_url);
    }

    if (addElement) {
      addElement(photo.asset_url, "photo");
    }

    // RECENT PHOTOS
    setRecentPhotos((prev) => {
      const filtered = prev.filter((item) => item.id !== photo.id);

      return [photo, ...filtered].slice(0, 4);
    });
  };

  return (
    <div className="photos-main-container">
      {/* HEADER */}
      <div className="photos-fixed-header-section">
        <div className="photos-ui-header">
          <div className="photos-title-grp">
            <img src={Drag} alt="drag handle" />
            <h2>Photos</h2>
          </div>

          <button
            className="close-btn"
            onClick={() => {
              setOpen(false);
              setActiveMenu("objects");
            }}
          >
            <img src={Close} alt="close" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="photos-search-area">
          <div className="photos-input-wrapper">
            <input
              type="text"
              placeholder="Search in photos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <img src={Search} alt="search" className="search-icon" />
          </div>
        </div>

        {/* FILTERS */}
        <div className="filter-row">
          <button className="filter-chip">
            <img src={LicenseIcon} alt="" />
            <span>License</span>
            <img src={ChevronDown} alt="" />
          </button>

          <button className="filter-chip">
            <img src={TypeIcon} alt="" />
            <span>Type</span>
            <img src={ChevronDown} alt="" />
          </button>

          <button className="filter-chip">
            <img src={ColorIcon} alt="" />
            <span>Color</span>
            <img src={ChevronDown} alt="" />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="photos-scroll-body">
        {/* LOADING */}
        {loading && <p style={{ padding: "10px" }}>Loading photos...</p>}

        {/* ERROR */}
        {error && (
          <p
            style={{
              padding: "10px",
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        {!loading && (
          <>
            {/* RECENT PHOTOS */}
            {recentPhotos.length > 0 && (
              <div className="photos-section">
                <h4>Recently used</h4>

                <div className="photos-custom-grid">
                  {recentPhotos.map((photo) => (
                    <div
                      key={`recent-${photo.id}`}
                      className={`photos-card ${photo.layout}`}
                      draggable={true}
                      onDragStart={(e) =>
                        handlePhotoDragStart(e, photo)
                      }
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => handlePhotoClick(photo)}
                    >
                      <img src={photo.asset_url} alt={photo.name} draggable={false}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ALL PHOTOS */}
            <div className="photos-section">
              <h4>All Photos</h4>

              <div className="photos-custom-grid">
                {photos.map((photo) => (
                  <div
                    key={`all-${photo.id}`}
                    className={`photos-card ${photo.layout}`}
                    draggable={true}
                    onDragStart={(e) =>
                      handlePhotoDragStart(e, photo)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <img src={photo.asset_url} alt={photo.name} draggable={false}/>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PhotoDropdown;

 