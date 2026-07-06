import React, { useState, useEffect, useRef } from "react";

function FooterLeft({
  elements,
  setElements,
  template,
  setTemplate,
  historyRef,
  historyIndexRef,
}) {
  const isUndoRedoRef = useRef(false);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const canUndo = historyState.canUndo;
  const canRedo = historyState.canRedo;
  // const [, forceRender] = useState(0);

  useEffect(() => {
    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo: historyIndexRef.current < historyRef.current.length - 1,
    });
  }, [elements, template]);

  const undo = () => {
    console.log("UNDO", historyIndexRef.current, historyRef.current.length);
    if (historyIndexRef.current <= 0) return;

    historyIndexRef.current--;
    // forceRender(v => v + 1);

    isUndoRedoRef.current = true;

    const state = historyRef.current[historyIndexRef.current];
    if (!state) return;

    setElements(structuredClone(state.elements));

    setTemplate(structuredClone(state.template));

    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo: historyIndexRef.current < historyRef.current.length - 1,
    });
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) {
      return;
    }

    historyIndexRef.current++;
    // forceRender(v => v + 1);

    isUndoRedoRef.current = true;

    const state = historyRef.current[historyIndexRef.current];

    if (!state) return;
    setElements(structuredClone(state.elements));

    setTemplate(structuredClone(state.template));

    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo: historyIndexRef.current < historyRef.current.length - 1,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const active = document.activeElement;

      if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") {
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }

      if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="footer-left">
      <button onClick={undo} disabled={!canUndo}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13H20C21.3261 13 22.5979 13.5268 23.5355 14.4645C24.4732 15.4021 25 16.6739 25 18C25 19.3261 24.4732 20.5979 23.5355 21.5355C22.5979 22.4732 21.3261 23 20 23H11M7 13L11 9M7 13L11 17"
            stroke="#020617"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 13H12C10.6739 13 9.40215 13.5268 8.46447 14.4645C7.52678 15.4021 7 16.6739 7 18C7 19.3261 7.52678 20.5979 8.46447 21.5355C9.40215 22.4732 10.6739 23 12 23H21M25 13L21 9M25 13L21 17"
            stroke="#64748B"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Redo
      </button>
    </div>
  );
}

export default FooterLeft;
