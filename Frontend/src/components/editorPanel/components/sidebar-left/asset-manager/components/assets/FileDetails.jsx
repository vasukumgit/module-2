import React from "react";
import folder from "../../../../../../../assets/editor-panel/assets-panel/folder.png";
import DetailsHeader from "../common/DetailsHeader";

function FileDetails({
  selectedImage,
  onBack,
}) {
  return (
    <div className="assets-details-container">
      <DetailsHeader
        title={selectedImage?.name || "File Details"}
        onBack={onBack}
      />

      <div className="details-card">
        <img
          src={selectedImage?.image}
          alt=""
          className="details-image"
        />

        <div className="details-content">
          <h4>Details</h4>

          <div className="detail-row">
            <span>Saved in</span>
            <span>
              <img
                src={folder}
                alt=""
                className="folds"
              />
            </span>
            {selectedImage?.folder || "Uploads"}
          </div>

          <div className="detail-row">
            <span>Type</span>
            <span>{selectedImage?.type || "Image"}</span>
          </div>

          <div className="detail-row">
            <span>Size</span>
            <span>{selectedImage?.size}</span>
          </div>

          <div className="detail-row">
            <span>Dimensions</span>
            <span>{selectedImage?.dimensions}</span>
          </div>

          <div className="detail-row">
            <span>Created By</span>
            <span>{selectedImage?.createdBy}</span>
          </div>

          <div className="detail-row">
            <span>Date Created</span>
            <span>{selectedImage?.createdAt}</span>
          </div>

          <div className="detail-row">
            <span>Date Modified</span>
            <span>{selectedImage?.modifiedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileDetails;