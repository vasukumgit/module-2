const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const { createDesign, getDesigns,getSingleDesign , updateDesign,deleteDesign, restoreDesign,createFolder,getFolders } = require("../../controllers/dashboard/designController");
 
router.post("/folders", verifyToken, createFolder);
router.get("/folders", verifyToken, getFolders);
router.post("/", verifyToken, createDesign);
router.get("/", verifyToken, getDesigns);
router.get("/:id", verifyToken, getSingleDesign);
router.put("/:id",  verifyToken,updateDesign);
router.delete("/:id",  verifyToken,deleteDesign);
router.put("/restore/:id", verifyToken, restoreDesign);

 
module.exports = router;

 