import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Arrow from "../../../../../assets/editor-panel/arrow.svg";
import Notsaved from "../../../../../assets/editor-panel/notsaved.png";
import Saving from "../../../../../assets/editor-panel/saving.png";
import Saved from "../../../../../assets/editor-panel/saved.png";
import File from "../../../../../assets/editor-panel/file.png";
function PrimaryPanel({ design, designId, elements }) {
  const firstLoad = useRef(true);
  const socketRef = useRef(null);

  const [status, setStatus] = useState("notsaved");

  const [title, setTitle] = useState(design?.name || "Untitled");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (design?.name) {
      setTitle(design.name);
    }
  }, [design]);

  const saveDesign = async () => {
    try {
      const token = localStorage.getItem("token");

      // UPDATE CLOUD STATUS TITLE
      await axios.patch(
        `http://localhost:5050/api/cloud-status/${designId}/title`,
        {
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // UPDATE DESIGN
      await axios.put(
        `http://localhost:5050/api/designs/${designId}`,
        {
          name: title,
          width: design?.width,
          height: design?.height,
          template_id: design?.template_id || null,
          type: design?.type || "custom",
          // design_data: design?.design_data || null,
          design_data: elements || [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      socketRef.current?.emit("design-saved", {
        designId: designId,
      });
      setTimeout(() => {
        setStatus("saved");
      }, 500);
    } catch (error) {
      console.log(error);
      socketRef.current?.emit("design-save-error", {
        designId: designId,
      });
      setStatus("notsaved");
    }
  };

  // ==========================================
  // AUTO SAVE WHEN DESIGN CHANGES//BE change
  // ==========================================

  useEffect(() => {
    if (!design) return;

    // FIRST LOAD SKIP
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    console.log("USER EDITING...");
    setStatus("saving");

    socketRef.current?.emit("saving-design", {
      designId: designId,
    });

    const timer = setTimeout(() => {
      saveDesign();
    }, 2000);

    return () => clearTimeout(timer);
  }, [elements, title]);

  return (
    <>
      <div className="layer-box">
        <span>
          <img src={File} alt="" />
        </span>
        <img src={Arrow} alt="" />
      </div>

      <div className="title-wrap gap-[16px]">
        <div className="title-box">
          <div className="flex items-center">
            <h6>
              {isEditing ? (
                <input
                  size={3}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  className="title-input"
                />
              ) : (
                <span
                  className="title-text"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {title}
                </span>
              )}
            </h6>
            <span className="title-arrow">
              <img src={Arrow} alt="" />
            </span>
          </div>

          <p>{design?.folder_name || "No folder selected"}</p>
        </div>

        <div className="cloud-btn">
          {status === "saving" && (
            <>
              <img src={Saving} alt="" />
              <span>Saving</span>
            </>
          )}
          {status === "saved" && (
            <>
              <img src={Saved} alt="" />
              <span>Saved</span>
            </>
          )}
          {status === "notsaved" && (
            <>
              <img src={Notsaved} alt="" />
              <span> Not saved</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PrimaryPanel;
