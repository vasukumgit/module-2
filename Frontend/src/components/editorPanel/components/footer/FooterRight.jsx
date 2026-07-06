import React, { useEffect, useState } from "react";
import Konva from "konva";

function FooterRight() {
  const [zoom, setZoom] = useState(100);

  const getStage = () => {
    return Konva.stages?.[0];
  };

  const updateZoomText = () => {
    const stage = getStage();

    if (!stage) return;

    const scale = stage.scaleX();

    setZoom(Math.round(scale * 100));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateZoomText();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleZoom = (type) => {
    const stage = getStage();

    if (!stage) return;

    const oldScale = stage.scaleX();

    const scaleBy = 1.1;

    const newScale = type === "in" ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale < 0.1 || newScale > 5) return;

    const center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const mousePointTo = {
      x: (center.x - stage.x()) / oldScale,
      y: (center.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    };

    stage.scale({
      x: newScale,
      y: newScale,
    });

    stage.position(newPos);

    stage.batchDraw();

    setZoom(Math.round(newScale * 100));
  };

  const handleRestore = () => {
    const stage = getStage();

    if (!stage) return;

    stage.scale({
      x: 1,
      y: 1,
    });

    stage.position({
      x: window.innerWidth / 2 - 5000,
      y: window.innerHeight / 2 - 5000,
    });

    stage.batchDraw();

    setZoom(100);
  };

  return (
    // Outer container to hold both sections just like your commented code
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Zoom Controls Container */}
      <div className="editer footer-right">
        {/* Zoom In */}
        <button onClick={() => handleZoom("in")}>+</button>

        {/* Zoom Percentage */}
        <span>{zoom}%</span>

        {/* Zoom Out */}
        <button onClick={() => handleZoom("out")}>−</button>

        {/* Restore */}
        <span
          onClick={handleRestore}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: "10px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.078 7.98927C6.05072 6.31048 7.60039 5.04241 9.43848 4.42117C11.2766 3.79993 13.2778 3.86786 15.0695 4.61231C16.8613 5.35676 18.3214 6.72699 19.178 8.46787C20.0347 10.2087 20.2294 12.2016 19.7261 14.0754C19.2227 15.9492 18.0556 17.5762 16.4419 18.6535C14.8282 19.7308 12.878 20.1849 10.9544 19.9314C9.03082 19.6778 7.26494 18.7338 5.98557 17.2751C4.70621 15.8164 4.00055 13.9425 4 12.0023M9 8.00227H5V4.00228"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Question Mark Container */}
      <div
        className="editer footer-questionMark"
        style={{ marginLeft: "15px", display: "flex", alignItems: "center" }}
      >
        <span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 17.7857V16.1606C12 14.3991 12.9675 12.7881 14.5 12C15.2523 11.6079 15.8842 11.0089 16.3255 10.2697C16.7668 9.53047 17.0003 8.6799 17 7.81243C17 5.17929 14.925 3 12.365 3H12.1063C10.4375 3 8.8375 3.68143 7.65625 4.89514L7 5.57143M11.375 21H12.625"
              stroke="#1E293B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default FooterRight;
