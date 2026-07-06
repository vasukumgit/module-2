const express = require("express");
const router = express.Router();
 
const {
  createTeam,
  getMyTeams,
  getTeamMembers,
  addMember,
  removeMember,
  updateRole
} = require("../../controllers/AccountCenter/teamController");
 
const { verifyToken } = require("../../middleware/authMiddleware");
 
// CREATE TEAM
router.post("/", verifyToken, createTeam);
 
// TEAM LIST (IMPORTANT FIRST)
router.get("/list", verifyToken, getMyTeams);
 
// GET MEMBERS
router.get("/:teamId", verifyToken, getTeamMembers);
 
// ADD MEMBER
router.post("/add-member", verifyToken, addMember);
 
// REMOVE MEMBER
router.delete("/remove-member/:id", verifyToken, removeMember);
 
// UPDATE ROLE
router.put("/update-role", verifyToken, updateRole);
 
module.exports = router;
 