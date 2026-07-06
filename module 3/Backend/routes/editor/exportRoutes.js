const express = require("express");
const router = express.Router();

const {
  createExport,
  getUserExports,
} = require("../../controllers/editor/exportController");

const { verifyToken } = require("../../middleware/authMiddleware");

router.post("/", verifyToken, createExport);
router.get("/", verifyToken, getUserExports);

module.exports = router;