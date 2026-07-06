import React, { useEffect, useState, useRef } from "react";
import StrokeItem from "./StrokeItem";
import plus from "../../../../../../../../assets/editor-panel/properties/plus.svg";

export default function StrokeSection({
  selectedElements,
  updateElementMultiple,
}) {
  const el = selectedElements?.[0];

  const [openPickerId, setOpenPickerId] = useState(null);
  const [strokes, setStrokes] = useState([]);
  const sectionRef = useRef(null);

  // close picker on element change
  useEffect(() => {
    setOpenPickerId(null);
  }, [el?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target)) {
        setOpenPickerId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // sync strokes
  useEffect(() => {
    if (!el) {
      setStrokes([]);
      return;
    }

    setStrokes(el.strokes ? [...el.strokes] : []);
  }, [el?.id]);

  if (!el) return null;

  // =========================
  // UPDATE
  // =========================

  const updateStroke = (id, updatedStroke) => {
    const updatedStrokes = strokes.map((s) =>
      s.id === id ? updatedStroke : s,
    );
    console.log("UPDATED STROKES", updatedStrokes);
    setStrokes(updatedStrokes);

    updateElementMultiple({
      strokes: updatedStrokes,

      strokeColor:
        updatedStrokes.find((s) => s.visible)?.color ||
        updatedStrokes[0]?.color ||
        "#000000",
    });
  };

  // =========================
  // DELETE
  // =========================

  const deleteStroke = (id) => {
    const updatedStrokes = strokes.filter((s) => s.id !== id);

    setStrokes(updatedStrokes);

    updateElementMultiple({
      strokes: updatedStrokes,

      strokeColor: updatedStrokes.find((s) => s.visible)?.color || "#000000",
    });
  };

  // =========================
  // ADD
  // =========================

  const addStroke = () => {
    const updatedStrokes = [
      {
        id: Date.now(),
        color: "#000000",
        opacity: 100,
        visible: true,
        width: 2,
      },

      ...strokes,
    ];
    console.log("ADDING STROKE", updatedStrokes);
    setStrokes(updatedStrokes);

    updateElementMultiple({
      strokes: updatedStrokes,

      strokeColor: updatedStrokes.find((s) => s.visible)?.color || "#000000",
    });

    setTimeout(() => {
      console.log("ELEMENT AFTER UPDATE", el);
    }, 500);
  };

  return (
    <div className="block" ref={sectionRef}>
      <div className="block-header">
        <span>Stroke</span>

        <button onClick={addStroke}>
          <img src={plus} alt="" />
        </button>
      </div>

      {strokes.map((stroke, index) => (
        <StrokeItem
          key={`${stroke.id}-${index}`}
          stroke={stroke}
          isOpen={openPickerId === stroke.id}
          onOpen={() => setOpenPickerId(stroke.id)}
          onClose={() => setOpenPickerId(null)}
          onChange={(updated) => updateStroke(stroke.id, updated)}
          onDelete={() => deleteStroke(stroke.id)}
        />
      ))}
    </div>
  );
}
