const express = require("express");
const router = express.Router();
const { getShapes } = require("../../../../controllers/editor/objectpanel/objects/shapeController");

// Route to get shapes for the editor.

router.get("/", getShapes);

module.exports = router;