const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const {
  createProject,
  getUserProjects,
  deleteProject
} = require("../../controllers/dashboard/projectsController");
 
// CREATE PROJECT
router.post("/", verifyToken, createProject);
 
// GET USER PROJECTS
router.get("/", verifyToken, getUserProjects);
 
// DELETE PROJECT
router.delete("/:id", verifyToken, deleteProject);
 
module.exports = router;
 