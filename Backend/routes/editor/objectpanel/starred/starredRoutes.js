const express = require("express");

const router = express.Router();

const {
    starItem,
    unstarItem,
    checkStarred,
    getAllStarredItems
} = require("../../../../controllers/editor/objectpanel/starred/starredController");


// STAR
router.post("/", starItem);


// UNSTAR
router.delete("/", unstarItem);


// CHECK STAR STATUS
router.get("/check", checkStarred);

// GET ALL STARRED ITEMS
router.get("/:user_id", getAllStarredItems);

module.exports = router;