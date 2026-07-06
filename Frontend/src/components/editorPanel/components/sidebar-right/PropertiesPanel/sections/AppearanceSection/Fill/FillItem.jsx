
import { HexColorPicker } from "react-colorful";
import minus from "../../../../../../../../assets/editor-panel/properties/minus.svg";
import solar_eye_linear from "../../../../../../../../assets/editor-panel/properties/solar_eye_linear.svg";

export default function FillItem({
  fill,
  onChange,
  onDelete,
  onClose,
  onOpen,
  isOpen,
}) {

  // const pickerRef = useRef(null);
  // // =========================
  // // OUTSIDE CLICK CLOSE
  // // =========================
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (pickerRef.current && pickerRef.current.contains(e.target)) {
  //       return; // clicked inside → DO NOTHING
  //     }

  //     onClose(); // clicked outside → close
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClose]);

  return (
    <div className="item-row">
      {/* MAIN INPUT */}
      <div className="input-container">
        {/* LEFT */}
        <div className="input-left">
          <div
            className="color-dot"
            style={{ background: fill.color }}
            onClick={onOpen}
          />

          <input
            type="text"
            value={fill.color.replace("#", "")}
            onChange={(e) => onChange({ ...fill, color: "#" + e.target.value })}
            className="color-text"
          />
        </div>

        {/* RIGHT */}
        <div className="input-right">
          <button
            type="button"
            className="eye-btn"
            onClick={() => onChange({ ...fill, visible: !fill.visible })}
          >
            <img src={solar_eye_linear} alt="" />
          </button>

          <div className="divider" />

          {/* <input
        type="number"
        value={fill.opacity}
        onChange={(e) =>
          onChange({ ...fill, opacity: e.target.value })
        }
        className="opacity-input"
      /> */}
          <input
            type="number"
            min="0"
            max="100"
            value={fill.opacity}
            onChange={(e) =>
              onChange({
                ...fill,
                opacity: Number(e.target.value),
              })
            }
            className="opacity-input"
          />
          {/* <span className="percent">{fill.opacity}%</span> */}
        </div>
      </div>

      {/* ❌ MINUS OUTSIDE */}
      <button type="button" className="minus-btn" onClick={onDelete}>
        <img src={minus} alt="" />
      </button>

      {isOpen && (
        <div className="color-popup">
          <HexColorPicker
            color={fill.color}
            onChange={(color) =>
              onChange({
                ...fill,
                color,
              })
            }
          />

          <input
            type="text"
            value={fill.color}
            onChange={(e) =>
              onChange({
                ...fill,
                color: e.target.value,
              })
            }
            className="hex-input"
          />
        </div>
      )}
    </div>
  );
}
