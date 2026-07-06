const fs = require("fs");
const path = require("path");
require("dotenv").config();

const cloudinary = require("../config/cloudinary");

// ================= FOLDERS
const base = path.resolve(__dirname, "../assets/graphics");

const folders = {
  icons: path.join(base, "icons"),
  illustrations: path.join(base, "illustrations"),
  design: path.join(base, "design-elements")
};

Object.values(folders).forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ================= CLOUDINARY UPLOAD
const upload = async (filePath, type, name) => {
  try {
    await cloudinary.uploader.upload(filePath, {
      folder: `graphics/${type}`,
      resource_type: "image",
      overwrite: true
    });

    console.log(` ${name} uploaded`);
  } catch (err) {
    console.log(` Upload failed: ${name}`);
    console.log(err.message);
  }
};

// ================= SVG HELPER
const createSVG = (content, width, height) => `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  fill="none"
>
  ${content}
</svg>
`;

// ================= COLORS
const COLORS = [
  "#4F46E5",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#EF4444"
];

const getColor = (i) => COLORS[i % COLORS.length];

// ================= ICONS
const axios = require("axios");

const iconList = [
  "user","home","search","settings","menu","x","check","plus","minus",
  "edit","trash","download","upload","share","heart","star","bookmark",
  "bell","mail","phone","camera","image","music","calendar","clock",
  "map","lock","eye","filter","link","shopping-cart","tag","credit-card",
  "wallet","gift","bar-chart","pie-chart","trending-up","grid","list",
  "file","folder","save","copy","clipboard","mic","volume-2","play",
  "pause","arrow-up","arrow-down","arrow-left","arrow-right","chevron-up",
  "chevron-down","log-in","log-out","shield","alert-circle","info",
  "help-circle","database","server"
];

const downloadIcons = async () => {
  console.log("\n Downloading Icons...");

  for (const icon of iconList) {
    try {
      const url = `https://cdn.jsdelivr.net/npm/lucide-static/icons/${icon}.svg`;

      const filePath = path.join(folders.icons, `${icon}.svg`);

      const res = await axios.get(url, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, res.data);

      await upload(filePath, "icons", `${icon}.svg`);

      await delay(50);

    } catch (err) {
      console.log(` icon failed: ${icon}`);
    }
  }

  console.log(" Icons Done");
};

// ================= ILLUSTRATIONS
const illustrationNames = [
  "team-work",
  "mobile-app",
  "design-process",
  "coding-scene",
  "startup-launch",
  "data-analysis",
  "cloud-sync",
  "security-check",
  "payment-flow",
  "dashboard-view"
];

const createIllustrations = async () => {

  console.log("\n Creating Illustrations...");

  for (let i = 1; i <= 20; i++) {

    const c1 = getColor(i);
    const c2 = getColor(i + 2);

    let content = "";

    switch (i % 10) {

      case 0:
        content = `
          <rect width="500" height="400" fill="#F9FAFB"/>
          <rect x="180" y="50" width="140" height="260" rx="20" fill="${c1}"/>
        `;
        break;

      case 1:
        content = `
          <circle cx="150" cy="200" r="60" fill="${c1}"/>
          <circle cx="300" cy="200" r="60" fill="${c2}"/>
        `;
        break;

      case 2:
        content = `
          <rect x="80" y="80" width="340" height="200" rx="20" fill="${c1}"/>
          <rect x="100" y="120" width="200" height="20" fill="white"/>
        `;
        break;

      case 3:
        content = `
          <circle cx="200" cy="150" r="70" fill="${c1}" opacity="0.6"/>
          <rect x="250" y="120" width="120" height="120" rx="20" fill="${c2}"/>
        `;
        break;

      case 4:
        content = `
          <rect x="150" y="120" width="200" height="80" rx="10" fill="${c1}"/>
          <rect x="100" y="220" width="300" height="20" fill="#D1D5DB"/>
        `;
        break;

      case 5:
        content = `
          <rect x="100" y="250" width="40" height="80" fill="${c1}"/>
          <rect x="160" y="200" width="40" height="130" fill="${c2}"/>
          <rect x="220" y="150" width="40" height="180" fill="${c1}"/>
        `;
        break;

      case 6:
        content = `
          <rect x="120" y="100" width="260" height="160" rx="20" fill="${c1}"/>
          <circle cx="160" cy="140" r="20" fill="white"/>
        `;
        break;

      case 7:
        content = `
          <circle cx="200" cy="200" r="60" fill="${c1}"/>
          <circle cx="260" cy="200" r="60" fill="${c2}"/>
        `;
        break;

      case 8:
        content = `
          <rect x="150" y="100" width="200" height="180" rx="20" fill="${c1}"/>
          <rect x="180" y="140" width="140" height="20" fill="white"/>
        `;
        break;

      case 9:
        content = `
          <polygon points="200,50 300,200 100,200" fill="${c1}"/>
          <circle cx="300" cy="250" r="40" fill="${c2}"/>
        `;
        break;
    }

    const svg = createSVG(content, 500, 400);

    const fileName =
      `${illustrationNames[i % illustrationNames.length]}-${i}.svg`;

    const filePath = path.join(folders.illustrations, fileName);

    fs.writeFileSync(filePath, svg, "utf8");

    await upload(filePath, "illustrations", fileName);

    await delay(100);
  }

  console.log(" Illustrations Done");
};

// ================= DESIGN ELEMENTS
const designNames = [
  "abstract-shape",
  "gradient-blob",
  "wave-style",
  "modern-circle",
  "soft-blob",
  "fluid-shape",
  "mesh-gradient",
  "organic-shape",
  "minimal-pattern",
  "creative-blob"
];

const createDesignElements = async () => {

  console.log("\n Creating Design Elements...");

  for (let i = 1; i <= 20; i++) {

    const c = getColor(i);

    let content = "";

    switch (i % 10) {

      case 0:
        content = `
          <path d="M150 50 Q250 150 150 250 Q50 150 150 50Z"
            fill="${c}"/>
        `;
        break;

      case 1:
        content = `
          <defs>
            <linearGradient id="g${i}">
              <stop offset="0%" stop-color="${c}"/>
              <stop offset="100%" stop-color="#ffffff"/>
            </linearGradient>
          </defs>

          <circle
            cx="150"
            cy="150"
            r="100"
            fill="url(#g${i})"
          />
        `;
        break;

      case 2:
        content = `
          <polyline
            points="0,150 50,100 100,150 150,100 200,150"
            stroke="${c}"
            fill="none"
            stroke-width="10"
          />
        `;
        break;

      case 3:
        content = `
          <rect x="60" y="60" width="150" height="150"
            fill="${c}" opacity="0.6"/>

          <rect x="90" y="90" width="150" height="150"
            fill="${c}" opacity="0.3"/>
        `;
        break;

      case 4:
        content = `
          <circle cx="50" cy="50" r="10" fill="${c}"/>
          <circle cx="100" cy="100" r="10" fill="${c}"/>
          <circle cx="150" cy="150" r="10" fill="${c}"/>
        `;
        break;

      case 5:
        content = `
          <path
            d="M0 150 Q75 100 150 150 T300 150"
            stroke="${c}"
            fill="none"
            stroke-width="10"
          />
        `;
        break;

      case 6:
        content = `
          <polygon
            points="150,50 250,250 50,250"
            fill="${c}"
          />
        `;
        break;

      case 7:
        content = `
          <circle
            cx="150"
            cy="150"
            r="100"
            stroke="${c}"
            stroke-width="20"
            fill="none"
          />
        `;
        break;

      case 8:
        content = `
          <rect x="0" y="0" width="300" height="20" fill="${c}"/>
          <rect x="0" y="40" width="300" height="20" fill="${c}"/>
        `;
        break;

      case 9:
        content = `
          <polygon
            points="150,50 250,150 150,250 50,150"
            fill="${c}"
          />
        `;
        break;
    }

    const svg = createSVG(content, 300, 300);

    const fileName =
      `${designNames[i % designNames.length]}-${i}.svg`;

    const filePath = path.join(folders.design, fileName);

    fs.writeFileSync(filePath, svg, "utf8");

    await upload(filePath, "design-elements", fileName);

    await delay(100);
  }

  console.log(" Design Elements Done");
};

// ================= RUN
const run = async () => {

  try {

    console.log("☁️ Cloudinary Connected");

    await downloadIcons();

    await createIllustrations();

    await createDesignElements();

    console.log("\n ALL FILES GENERATED SUCCESSFULLY");

  } catch (err) {

    console.log(" ERROR:");
    console.log(err.message);

  }
};

run();