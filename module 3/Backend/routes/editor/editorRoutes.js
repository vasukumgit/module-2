const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const {
  createElement,
  getElements,
  getSingleElement,
  updateElement,
  deleteElement
} = require("../../controllers/editor/editorController");



router.post("/", verifyToken, createElement);
router.get("/element/:id", verifyToken, getSingleElement);
router.get("/:designId", verifyToken, getElements);
router.put("/:id", verifyToken, updateElement);
router.delete("/:id", verifyToken, deleteElement);

module.exports = router;