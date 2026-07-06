const express = require("express");

const router = express.Router();

const controller =
require("../../controllers/dashboard/templateController");

// CREATE
router.post("/", controller.createTemplate);

// SEARCH
router.get("/search", controller.searchTemplates);

// FILTER
router.get("/filter", controller.filterTemplates);

router.get(
  "/",
  controller.getTemplates
);

router.get(
  "/recent",
  controller.getRecentTemplates
);

router.get(
  "/details/:id",
  controller.getTemplateDetails
);

router.get(
  "/related-templates/:id",
  controller.getTemplatesBySizeAndCategory
);

router.get(
  "/related-tags/:id",
  controller.getRelatedTemplates
);

router.get(
  "/:id",
  controller.getTemplateById
);

router.post(
  "/:id/use",
  controller.useTemplate
);

module.exports = router;