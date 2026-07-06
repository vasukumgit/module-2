const express = require("express");

const router = express.Router();

const {
  getAllTemplates,
  getRecentTemplates,
  toggleStarTemplate,
  getStarredTemplates,
  searchTemplates,
  filterTemplates,
  updateLastUsed,
  getTemplateDetails
} = require(
  "../../../../controllers/editor/objectpanel/template/editortemplateController"
);


// GET ALL
router.get("/", getAllTemplates);

// RECENT
router.get("/recent", getRecentTemplates);

// STARRED
router.get(
  "/starred/:user_id",
  getStarredTemplates
);

// STAR / UNSTAR
router.post(
  "/star/:user_id/:template_id",
  toggleStarTemplate
);

// SEARCH
router.get(
  "/search",
  searchTemplates
);

// FILTER
router.get(
  "/filter",
  filterTemplates
);

// LAST USED
router.put(
  "/last-used/:template_id",
  updateLastUsed
);

// VIEW MORE DETAILS
router.get(
  "/details/:template_id",
  getTemplateDetails
);

module.exports = router;