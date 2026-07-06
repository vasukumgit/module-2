const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
 
const {
  getProfile,
  updateProfile,
} = require("../../controllers/dashboard/profileController");
 
// GET Profile
router.get("/profile", verifyToken, getProfile);
// UPDATE Profile
router.put("/profile", verifyToken, updateProfile);
 
module.exports = router;