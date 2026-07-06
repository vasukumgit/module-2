const router = require("express").Router();
const ctrl = require("../../controllers/dashboard/starredController");
const { verifyToken } = require("../../middleware/authMiddleware");

router.post("/", verifyToken, ctrl.addStar);
router.delete("/:design_id", verifyToken, ctrl.removeStar);
router.get("/", verifyToken, ctrl.getStars);

module.exports = router;