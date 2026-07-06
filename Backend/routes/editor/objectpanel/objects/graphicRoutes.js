const express = require("express");
const router = express.Router();
const { getGraphics } = require("../../../../controllers/editor/objectpanel/objects/graphicController");

// Route to get graphics for the editor.

router.get("/", getGraphics);

module.exports = router;