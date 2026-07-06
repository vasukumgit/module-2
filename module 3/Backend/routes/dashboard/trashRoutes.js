const express = require("express");
const router = express.Router();
const trashController = require("../../controllers/dashboard/trashController");
const { verifyToken } = require("../../middleware/authMiddleware");
 
// GET all trash (user based)
router.get("/", verifyToken, trashController.getTrash);
 
// ADD to trash
router.post("/", verifyToken, trashController.addToTrash);
 
// Recover item
router.put("/recover/:id", verifyToken, trashController.recoverTrash);
 
// Delete permanently
router.delete("/:id", verifyToken, trashController.deleteTrash);
 
// Empty trash
router.delete("/", verifyToken, trashController.emptyTrash);
 
module.exports = router;
 