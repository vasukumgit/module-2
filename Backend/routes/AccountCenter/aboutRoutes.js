const express = require("express");
const router = express.Router();
 
const {
  getAbout,
  getTerms,
  getPrivacy,
  getCookies,
  getAcceptableUse,
  getThirdParty,
  openWebsite
} = require("../../controllers/AccountCenter/aboutController");
 
// About
router.get("/", getAbout);
router.get("/website", openWebsite);
 
 
// Legal
router.get("/legal/terms", getTerms);
router.get("/legal/privacy", getPrivacy);
router.get("/legal/cookies", getCookies);
router.get("/legal/acceptable-use", getAcceptableUse);
router.get("/legal/third-party-licenses", getThirdParty);
 
 
module.exports = router;