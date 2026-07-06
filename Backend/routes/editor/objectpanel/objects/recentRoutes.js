const express = require("express");
const router = express.Router();
const {
  addRecent,
  getRecent
} = require("../../../../controllers/editor/objectpanel/objects/recentController");

router.post("/add", addRecent);
router.get("/", getRecent);

module.exports = router;