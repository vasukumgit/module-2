const aboutData = {
  app: {
    description: "Stackly Studio is a browser-based design platform.",
    version: "0.0.0",
    release_tag: "Alpha Release"
  },
  company: {
    product_by: "The Stackly",
    headquarters: "Coimbatore, India",
    contact: "support@stacklystudio.com",
    website: "https://thestackly.com/"
  },
  legal: {
    links: [
      { label: "Terms of Service", url: "/api/about/legal/terms" },
      { label: "Privacy Policy", url: "/api/about/legal/privacy" },
      { label: "Cookie Policy", url: "/api/about/legal/cookies" },
      { label: "Acceptable Use Policy", url: "/api/about/legal/acceptable-use" },
      { label: "Third-Party Licenses", url: "/api/about/legal/third-party-licenses" }
    ],
    disclaimer: "All third-party assets belong to respective owners."
  },
  technology: {
    note: "This product uses open-source software.",
    attribution_info: "Details available in licenses section."
  },
  availability: {
    info: "Available globally via web browsers.",
    language_note: "Language support may vary."
  },
  copyright: "© 2026 The Stackly. All rights reserved."
};
 
exports.openWebsite = (req, res) => {
  res.redirect("https://thestackly.com/");
};
 
 
//  Main About API
exports.getAbout = (req, res) => {
  res.json(aboutData);
};
 
//  Legal APIs
exports.getTerms = (req, res) => {
  res.send("Terms of Service: Dummy content...");
};
 
exports.getPrivacy = (req, res) => {
  res.send("Privacy Policy: Dummy content...");
};
 
exports.getCookies = (req, res) => {
  res.send("Cookie Policy: Dummy content...");
};
 
exports.getAcceptableUse = (req, res) => {
  res.send("Acceptable Use Policy: Dummy content...");
};
 
exports.getThirdParty = (req, res) => {
  res.send("Third Party Licenses: Dummy content...");
};