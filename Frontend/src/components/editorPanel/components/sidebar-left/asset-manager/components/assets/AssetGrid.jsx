import React from "react";
import "../../styles/AssetsPanel.css";
import UploadButton from "../common/UploadButton";

export default function AssetGrid({ assets }) {
  return (
    <div>
      <div className="upload-row">
        <UploadButton />
      </div>
      <div className="assets-grid">
        {assets.map((img, index) => (
          <div key={index} className="asset-image-card">
            <img src={img} alt="asset" />
          </div>
        ))}
      </div>
    </div>
  );
}
