import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Drag from "../../../../../assets/editor-panel/drag-icon.svg";
import Close from "../../../../../assets/editor-panel/close.svg";
import Search from "../../../../../assets/editor-panel/search.svg";

// LOCAL FALLBACK SHAPES
import Circle from "../../../../../assets/editor-panel/shapes/shape-1.svg";
import Square from "../../../../../assets/editor-panel/shapes/shape-2.svg";
import Triangle from "../../../../../assets/editor-panel/shapes/shape-3.svg";
import Star from "../../../../../assets/editor-panel/shapes/shape-4.svg";

function ShapesDropdown({ setOpen, setActiveMenu, addElement }) {
  const [shapes, setShapes] = useState([]);
  const [recentShapes, setRecentShapes] = useState([]);
  const [search, setSearch] = useState("");

  // fallback local shapes
  const fallbackShapes = [
    {
      id: 1,
      name: "shape-1.svg",
      asset_url:
        "https://res.cloudinary.com/dyuuzbqbu/image/upload/v1775565196/shapes/yipiwqqkzfbnlclgpdey.svg",
    },
    {
      id: 2,
      name: "shape-2.svg",
      asset_url:
        "https://res.cloudinary.com/dyuuzbqbu/image/upload/v1775565561/shapes/xs36mrg8m2nqujmnzvuv.svg",
    },
    {
      id: 3,
      name: "shape-3.svg",
      asset_url:
        "https://res.cloudinary.com/dyuuzbqbu/image/upload/v1775565663/shapes/ar9pl8kybdxygkv6z9go.svg",
    },
    {
      id: 4,
      name: "shape-4.svg",
      asset_url: Star,
    },
  ];

  useEffect(() => {
    fetchShapes();
  }, []);

  const fetchShapes = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/shapes");

      // if api data exists
      if (res.data && res.data.length > 0) {
        setShapes(res.data);
      } else {
        // if api returns empty array
        setShapes(fallbackShapes);
      }
    } catch (error) {
      console.log("shape fetch error", error);

      // if api fails
      setShapes(fallbackShapes);
    }
  };

  // const handleDragStart = (e, src) => {
  //   // let finalSrc = src;

  //   // if (src.startsWith("http") && src.endsWith(".svg")) {
  //   //   try {
  //   //     const res = await fetch(src);
  //   //     const svgText = await res.text();

  //   //     finalSrc = "data:image/svg+xml," + encodeURIComponent(svgText);
  //   //   } catch (err) {
  //   //     console.log(err);
  //   //   }
  //   // }

  //   console.log("DRAG START", src);

  //   e.dataTransfer.setData("shapeSrc", finalSrc);
  //   e.dataTransfer.setData("type", "shape");
  // };

  const handleDragStart = (e, src) => {
    console.log("SETTING:", src);

    e.dataTransfer.setData("shapeSrc", src);

    console.log("READ BACK:", e.dataTransfer.getData("shapeSrc"));
  };

  const handleShapeClick = async (shape) => {
    let finalSrc = shape.asset_url;

    // convert external svg to data svg
    if (
      shape.asset_url.startsWith("http") &&
      shape.asset_url.endsWith(".svg")
    ) {
      try {
        const res = await fetch(shape.asset_url);

        const svgText = await res.text();

        finalSrc = "data:image/svg+xml," + encodeURIComponent(svgText);
      } catch (err) {
        console.log("SVG convert error", err);
      }
    }

    addElement(finalSrc, "shape");

    setRecentShapes((prev) => {
      const filtered = prev.filter((item) => item.id !== shape.id);

      return [shape, ...filtered].slice(0, 4);
    });
  };

  const filteredShapes = useMemo(() => {
    return shapes.filter((shape) =>
      shape.name
        .replace(".svg", "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, shapes]);

  return (
    <div className="dropdown-menu shapes-menu">
      <div className="editor-dropdown-header">
        <div className="flex items-center gap-[7px] dropdown-title-box">
          <img src={Drag} alt="" />
          <span>Shapes</span>
        </div>

        <button
          className="cursor-pointer"
          onClick={() => {
            setOpen(false);
            setActiveMenu("objects");
          }}
        >
          <img src={Close} alt="" />
        </button>
      </div>

      <div className="editor-dropdown-search">
        <input
          type="search"
          placeholder="Search in Shapes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <img src={Search} alt="" />
      </div>

      <div className="shapes-wrapper">
        <div className="shapes-dropdown-icons recent">
          <h6 className="!mb-[10px]">Recently used</h6>

          <div className="shapes-grid">
            {recentShapes.map((shape) => (
              <div
                key={shape.id}
                draggable={true}
                onDragStart={(e) => {
                  console.log("DIV DRAG START");
                  handleDragStart(e, shape.asset_url);
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleShapeClick(shape)}
              >
                <img src={shape.asset_url} alt={shape.name} draggable={false} />
              </div>
            ))}
          </div>
        </div>

        <div className="shapes-dropdown-icons !mt-[18px]">
          <h6 className="!mb-[10px]">All Shapes</h6>

          <div className="shapes-grid">
            {filteredShapes.map((shape) => (
              <div
                key={shape.id}
                draggable={true}
                onDragStart={(e) => {
                  console.log("DIV DRAG START");
                  handleDragStart(e, shape.asset_url);
                }}
                onDragOver={(e) => e.preventDefault()}

                onClick={() => handleShapeClick(shape)}
              >
                <img
                  src={shape.asset_url}
                  alt={shape.name}
                  draggable={false}
                  
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShapesDropdown;
