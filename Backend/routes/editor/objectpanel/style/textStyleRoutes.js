const express = require("express");
 
const router = express.Router();
 
const {
  getAllTextStyles,
  createTextStyle,
  updateTextStyle,
  deleteTextStyle,
} = require("../../../../controllers/editor/objectpanel/style/textStyleController.js");
 
router.get("/", getAllTextStyles);
 
router.post("/", createTextStyle);
 
router.put("/:id", updateTextStyle);
 
router.delete("/:id", deleteTextStyle);
 
module.exports = router;
 