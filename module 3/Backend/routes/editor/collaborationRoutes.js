const express = require("express");

const router = express.Router();

const {
  sendInvite,
  acceptInvite,
  declineInvite,
  getCollaborators,
  updateRole,
  removeCollaborator,
  getSharedWithMe,
  resendInvite
} = require("../../controllers/editor/collaborationController");

const {
  verifyToken
} = require("../../middleware/authMiddleware");

// ─────────────────────────────────────────────
// INVITE
// ─────────────────────────────────────────────
router.post(
  "/invite",
  verifyToken,
  sendInvite
);

// ─────────────────────────────────────────────
// ACCEPT / DECLINE
// ─────────────────────────────────────────────
router.get(
  "/accept",
  acceptInvite
);

// router.get("/accept", (req, res) => {
//   res.json({
//     success: true,
//     token: req.query.token
//   });
// });

router.get(
  "/decline",
  declineInvite
);

// ─────────────────────────────────────────────
// SHARED WITH ME
// ─────────────────────────────────────────────
router.get(
  "/shared-with-me",
  verifyToken,
  getSharedWithMe
);

// ─────────────────────────────────────────────
// GET DESIGN COLLABORATORS
// ─────────────────────────────────────────────
router.get(
  "/design/:design_id",
  verifyToken,
  getCollaborators
);

// ─────────────────────────────────────────────
// UPDATE ROLE
// ─────────────────────────────────────────────
router.put(
  "/role",
  verifyToken,
  updateRole
);

// ─────────────────────────────────────────────
// REMOVE
// ─────────────────────────────────────────────
router.delete(
  "/remove/:collab_id",
  verifyToken,
  removeCollaborator
);

// ─────────────────────────────────────────────
// RESEND
// ─────────────────────────────────────────────
router.post(
  "/resend",
  verifyToken,
  resendInvite
);

// router.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Collaboration route working"
//   });
// });

module.exports = router;