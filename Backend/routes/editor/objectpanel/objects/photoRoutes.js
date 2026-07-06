const express = require("express");
const router = express.Router();
const upload = require("../../../../middleware/upload");
const { getPhotos, uploadPhoto } = require("../../../../controllers/editor/objectpanel/objects/photoController");
 
router.get("/", getPhotos);
router.post("/upload", upload.single("image"), uploadPhoto);
 
module.exports = router; 