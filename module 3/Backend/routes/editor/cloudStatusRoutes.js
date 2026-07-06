const express = require("express");
const router = express.Router();

const controller = require("../../controllers/editor/cloudStatusController");

const { verifyToken } = require("../../middleware/authMiddleware");

// ======================================================
// CREATE DESIGN
// ======================================================
router.post(
  "/",
  verifyToken,
  controller.createDesign
);

// ======================================================
// GET ALL USER DESIGNS
// ======================================================
router.get(
  "/user/:user_id",
  controller.getUserDesigns
);

// ======================================================
// GET SINGLE DESIGN
// ======================================================
router.get(
  "/:design_id",
  controller.getDesign
);

// ======================================================
// UPDATE TITLE
// ======================================================
router.patch(
  "/:design_id/title",
  controller.updateTitle
);

// ======================================================
// AUTO SAVE
// ======================================================
router.patch(
  "/:design_id/autosave",
  controller.autoSaveDesign
);

// ======================================================
// UPDATE CLOUD STATUS
// ======================================================
router.patch(
  "/:design_id/cloud-status",
  controller.updateCloudStatus
);

// ======================================================
// UPDATE FOLDER NAME
// ======================================================
router.patch(
  "/:design_id/folder",
  controller.updateFolderName
);

// ======================================================
// DELETE DESIGN
// ======================================================
router.delete(
  "/:design_id",
  controller.deleteDesign
);

module.exports = router;