const express = require("express");
const router = express.Router();
const controller = require("../../controllers/editor/editorToolController");
 
router.post("/tool", controller.setTool);
router.get("/tool", controller.getTool);
router.get("/tools", controller.getAllTools);
 
module.exports = router;