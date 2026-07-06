import React, { useEffect, useState } from "react";
import "./graphics.css";
import axios from "axios";

// Assets
import Drag from "../../../../../../assets/editor-panel/drag-icon.svg";
import Close from "../../../../../../assets/editor-panel/close.svg";
import Search from "../../../../../../assets/editor-panel/search.svg";
import ChevronDown from "../../../../../../assets/editor-panel/photodropdown/chevron-down.svg";
import LicenseIcon from "../../../../../../assets/editor-panel/photodropdown/key-icon.svg";
import TypeIcon from "../../../../../../assets/editor-panel/photodropdown/settings-icon.svg";
import ColorIcon from "../../../../../../assets/editor-panel/photodropdown/color-wheel.svg";

function Graphics({ setOpen, setActiveMenu, addElements }) {
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("home");

  // API STATES
  const [icons, setIcons] = useState([]);
  const [illustrations, setIllustrations] = useState([]);
  const [designElements, setDesignElements] = useState([]);
  const [recentUsed, setRecentUsed] = useState([]);

  const [loading, setLoading] = useState(false);

  // =========================================
  // FETCH GRAPHICS DATA
  // =========================================

  useEffect(() => {
    fetchGraphics();
    fetchRecentUsed();
  }, []);

  const fetchGraphics = async () => {
    try {
      setLoading(true);

      const [iconsRes, illustrationsRes, elementsRes] = await Promise.all([
        axios.get("http://localhost:5050/api/graphics?type=icon"),

        axios.get("http://localhost:5050/api/graphics?type=illustration"),

        axios.get("http://localhost:5050/api/graphics?type=design-element"),
      ]);

      console.log("icons:", iconsRes.data);
      console.log("illustrations:", illustrationsRes.data);
      console.log("elements:", elementsRes.data);

      // setIcons(
      //   Array.isArray(iconsRes.data)
      //     ? iconsRes.data
      //     : []
      // );

      // setIllustrations(
      //   Array.isArray(illustrationsRes.data)
      //     ? illustrationsRes.data
      //     : []
      // );

      // setDesignElements(
      //   Array.isArray(elementsRes.data)
      //     ? elementsRes.data
      //     : []
      // );

      setIcons(Array.isArray(iconsRes.data.data) ? iconsRes.data.data : []);

      setIllustrations(
        Array.isArray(illustrationsRes.data.data)
          ? illustrationsRes.data.data
          : [],
      );

      setDesignElements(
        Array.isArray(elementsRes.data.data) ? elementsRes.data.data : [],
      );
    } catch (error) {
      console.error("Error fetching graphics:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH RECENT USED ITEMS
  // =========================================

  const fetchRecentUsed = async () => {
    try {
      const response = await axios.get("YOUR_API_ENDPOINT/recent-graphics");

      setRecentUsed(
        Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [],
      );
    } catch (error) {
      console.error("Error fetching recent graphics:", error);
    }
  };

  // =========================================
  // SAVE RECENT USED ITEM
  // =========================================

  const saveRecentUsed = async (item) => {
    try {
      await axios.post("YOUR_API_ENDPOINT/recent-graphics", {
        graphicId: item.id,
        name: item.name,
        url: item.asset_url,
        type: item.type,
      });

      // UPDATE LOCAL STATE
      setRecentUsed((prev) => {
        const current = Array.isArray(prev) ? prev : [];

        const exists = current.find((i) => i.id === item.id);

        if (exists) {
          return current;
        }

        return [item, ...current].slice(0, 10);
      });
    } catch (error) {
      console.error("Error saving recent item:", error);
    }
  };

  // =========================================
  // DRAG START
  // =========================================

  // const handleDragStart = async (e, src) => {
  //   const cleanSrc = src.replace(/%22$/, "");
  //   let finalSrc = cleanSrc;

  //   if (src.startsWith("http") && src.endsWith(".svg")) {
  //     try {
  //       const res = await fetch(src);
  //       const svgText = await res.text();

  //       finalSrc = "data:image/svg+xml," + encodeURIComponent(svgText);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   console.log("DRAG FINALSRC", finalSrc);

  //   e.dataTransfer.setData("shapeSrc", finalSrc);

  //   console.log("DRAG DATA:", e.dataTransfer.getData("shapeSrc"));
  // };
  const handleDragStart = (e, src) => {
    console.log("SETTING:", src);

    e.dataTransfer.setData("shapeSrc", src);

    console.log("READ BACK:", e.dataTransfer.getData("shapeSrc"));
  };

  // =========================================
  // CLICK SHAPE
  // =========================================

  const handleShapeClick = async (item) => {
    let finalSrc = item.asset_url;

    // convert external svg to data svg
    if (item.asset_url.startsWith("http") && item.asset_url.endsWith(".svg")) {
      try {
        const res = await fetch(item.asset_url);

        const svgText = await res.text();

        finalSrc = "data:image/svg+xml," + encodeURIComponent(svgText);
      } catch (err) {
        console.log("SVG convert error", err);
      }
    }

    addElements(finalSrc, "shape");

    // LOCAL RECENT USED
    setRecentUsed((prev) => {
      const current = Array.isArray(prev) ? prev : [];

      const exists = current.find((i) => i.id === item.id);

      if (exists) {
        return current;
      }

      return [item, ...current].slice(0, 10);
    });
  };

  // =========================================
  // SEARCH FILTER
  // =========================================

  const filterShapes = (items = []) => {
    if (!Array.isArray(items)) return [];

    return items.filter((item) =>
      search ? item.name?.toLowerCase().includes(search.toLowerCase()) : true,
    );
  };

  // =========================================
  // RENDER GRID
  // =========================================

  const renderGrid = (items) => (
    <div className="graphics-grid">
      {filterShapes(items).map((item) => (
        <div
          key={item.id}
          className="graphics-item"
          draggable={true}
          onDragStart={(e) => handleDragStart(e, item.asset_url)}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => handleShapeClick(item)}
        >
          <img src={item.asset_url} alt={item.name} draggable={false} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="graphics-dropdown-menu">
      {/* HEADER */}

      <div className="graphics-header">
        <div className="graphics-title-box">
          <img src={Drag} alt="" />
          <span>Graphics</span>
        </div>

        <button
          className="graphics-close-btn"
          onClick={() => {
            setOpen(false);
            setActiveMenu("objects");
          }}
        >
          <img src={Close} alt="" />
        </button>
      </div>

      {/* SEARCH */}

      <div className="graphics-search-section">
        <input
          type="search"
          placeholder="Search in Graphics"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <img src={Search} alt="" className="graphics-search-icon" />
      </div>

      {/* FILTERS */}

      <div className="filter-row">
        <button className="filter-chip">
          <img src={LicenseIcon} alt="" className="chip-icon-left" />

          <span>License</span>

          <img src={ChevronDown} alt="" className="chip-chevron" />
        </button>

        <button className="filter-chip">
          <img src={TypeIcon} alt="" className="chip-icon-left" />

          <span>Type</span>

          <img src={ChevronDown} alt="" className="chip-chevron" />
        </button>

        <button className="filter-chip">
          <img src={ColorIcon} alt="" className="chip-icon-left color-wheel" />

          <span>Color</span>

          <img src={ChevronDown} alt="" className="chip-chevron" />
        </button>
      </div>

      {/* BODY */}

      <div className="graphics-scroll-body">
        {loading && <div className="graphics-loading">Loading graphics...</div>}

        {/* HOME */}

        {activeView === "home" && !loading && (
          <>
            {/* RECENT USED */}

            {recentUsed.length > 0 && (
              <div className="graphics-section">
                <div className="graphics-section-header">
                  <h6 className="graphics-section-label">Recent Used</h6>
                </div>

                {renderGrid(recentUsed)}
              </div>
            )}

            {/* ICONS */}

            <div className="graphics-section">
              <div className="graphics-section-header">
                <h6 className="graphics-section-label">Icons</h6>

                <button
                  className="graphics-see-all"
                  onClick={() => setActiveView("icons")}
                >
                  See all
                </button>
              </div>

              {renderGrid(icons.slice(0, 5))}
            </div>

            {/* ILLUSTRATIONS */}

            <div className="graphics-section">
              <div className="graphics-section-header">
                <h6 className="graphics-section-label">Illustrations</h6>

                <button
                  className="graphics-see-all"
                  onClick={() => setActiveView("illustrations")}
                >
                  See all
                </button>
              </div>

              {renderGrid(illustrations.slice(0, 5))}
            </div>

            {/* DESIGN ELEMENTS */}

            <div className="graphics-section">
              <div className="graphics-section-header">
                <h6 className="graphics-section-label">Design Elements</h6>

                <button
                  className="graphics-see-all"
                  onClick={() => setActiveView("elements")}
                >
                  See all
                </button>
              </div>

              {renderGrid(designElements.slice(0, 5))}
            </div>
          </>
        )}

        {/* ICONS PAGE */}

        {activeView === "icons" && (
          <div className="graphics-section">
            <button
              className="graphics-back-btn"
              onClick={() => setActiveView("home")}
            >
              ← All Icons
            </button>

            {renderGrid(icons)}
          </div>
        )}

        {/* ILLUSTRATIONS PAGE */}

        {activeView === "illustrations" && (
          <div className="graphics-section">
            <button
              className="graphics-back-btn"
              onClick={() => setActiveView("home")}
            >
              ← All Illustrations
            </button>

            {renderGrid(illustrations)}
          </div>
        )}

        {/* ELEMENTS PAGE */}

        {activeView === "elements" && (
          <div className="graphics-section">
            <button
              className="graphics-back-btn"
              onClick={() => setActiveView("home")}
            >
              ← Design Elements
            </button>

            {renderGrid(designElements)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Graphics;
