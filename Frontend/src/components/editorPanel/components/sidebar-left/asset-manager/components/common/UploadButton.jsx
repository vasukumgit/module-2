import React, {useRef} from "react";
import plus from "../../../../../../../assets/editor-panel/assets-panel/plus.png";

function UploadButton({
  onUpload,
}) {
  const inputRef =
    useRef(null);

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        style={{
          display: "none",
        }}
        accept="image/*"
        onChange={onUpload}
      />

      <div
        className="upload-row"
        onClick={() =>
          inputRef.current.click()
        }
      >
        <div className="upload-circle">
          <img
            src={plus}
            alt=""
          />
        </div>

        <span>
          Upload New Asset
        </span>
      </div>
    </>
  );
}

export default UploadButton;