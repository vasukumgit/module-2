const express = require("express");
const router = express.Router();
const {
  saveChart,
  saveTable,
  getEditorData
} =require("../../../../controllers/editor/objectpanel/objects/chartTableController");

//routes for chart and table data in editor.
router.post("/save-chart", saveChart);
router.post("/save-table", saveTable);
router.get("/editor/:design_id", getEditorData);

module.exports = router;