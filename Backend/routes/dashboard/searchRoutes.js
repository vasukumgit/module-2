const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/dashboard/searchController");
 
router.get("/", searchController.searchProjects);
 
module.exports = router;
 