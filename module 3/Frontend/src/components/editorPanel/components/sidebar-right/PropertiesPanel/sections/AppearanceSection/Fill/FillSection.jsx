import React, { useEffect, useState, useRef } from "react";
import FillItem from "./FillItem";
import plus from "../../../../../../../../assets/editor-panel/properties/plus.svg";

export default function FillSection({
  selectedElements,
  updateElementMultiple,
}) {
  const el = selectedElements?.[0];
  const [openPickerId, setOpenPickerId] = useState(null);
  const [fills, setFills] = useState([]);
  const sectionRef = useRef(null);
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

  // close picker on element change
  useEffect(() => {
    setOpenPickerId(null);
  }, [el?.id]);

  // sync fills
  useEffect(() => {
    if (!el) {
      setFills([]);
      return;
    }

    setFills(el.fills ? [...el.fills] : []);
  }, [el?.id]);

  if (!el) return null;

  // =========================
  // UPDATE
  // =========================
  const updateFill = (id, updatedFill) => {
    const updatedFills = fills.map((f) => (f.id === id ? updatedFill : f));

    console.log("APPLYING FILL:", updatedFills);

    setFills(updatedFills);

    updateElementMultiple({
      fills: updatedFills,
      fillColor:
        updatedFills.find((f) => f.visible)?.color ||
        updatedFills[0]?.color ||
        "#000000",
    });
  };

  // =========================
  // DELETE (FIXED)
  // =========================
  const deleteFill = (id) => {
    const updatedFills = fills.filter((f) => f.id !== id);

    setFills(updatedFills);

    updateElementMultiple({
      fills: updatedFills,
      fillColor: updatedFills.find((f) => f.visible)?.color || "#000000",
    });
  };

  // =========================
  // ADD
  // =========================
  const addFill = () => {
    const updatedFills = [
      {
        id: Date.now(),
        color: "#000000",
        opacity: 100,
        visible: true,
      },

      ...fills,
    ];

    setFills(updatedFills);

    updateElementMultiple({
      fills: updatedFills,
      fillColor: updatedFills.find((f) => f.visible)?.color || "#000000",
    });
  };

  return (
    <div className="block"  ref={sectionRef}>
      <div className="block-header">
        <span>Fill</span>

        <button onClick={addFill}>
          <img src={plus} />
        </button>
      </div>

      {fills.map((fill, index) => (
        <FillItem
          key={`${fill.id}-${index}`}
          fill={fill}
          isOpen={openPickerId === fill.id}
          onOpen={() => setOpenPickerId(fill.id)}
          onClose={() => setOpenPickerId(null)}
          onChange={(updated) => updateFill(fill.id, updated)}
          onDelete={() => deleteFill(fill.id)}
        />
      ))}
    </div>
  );
}
