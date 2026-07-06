const express = require("express");
const router = express.Router();
 
const {
  getNotifications,
  markAsRead,
  getUnreadCount,
  markAllAsRead,
  deleteNotification,
  acceptRequest,
  rejectRequest,
  markBulkRead  
} = require("../../controllers/dashboard/notificationController");
 
const { verifyToken } = require("../../middleware/authMiddleware");
 
// Get all notifications
router.get("/", verifyToken, getNotifications);
 
// Mark notification as read
router.put("/:id/read", verifyToken, markAsRead);
 
// Get unread count
router.get("/unread/count", verifyToken, getUnreadCount);
router.put("/mark-all-read", verifyToken, markAllAsRead);
router.put("/:id/accept", verifyToken, acceptRequest);
router.put("/:id/reject", verifyToken, rejectRequest);
router.delete("/:id", verifyToken, deleteNotification);
router.delete("/bulk/delete", verifyToken, deleteNotification);
router.put("/bulk/read", verifyToken, markBulkRead);
 
module.exports = router;