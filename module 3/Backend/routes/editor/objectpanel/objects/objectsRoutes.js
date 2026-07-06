const express = require("express");
const router = express.Router();
 
const { getObjects } = require("../../../../controllers/editor/objectpanel/objects/objectsController");
 
router.get("/", getObjects);
 
module.exports = router; 