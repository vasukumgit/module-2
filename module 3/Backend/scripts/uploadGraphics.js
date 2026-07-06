const fs = require("fs");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const db = require("../config/db");

// ================= VALID SVG CHECK
const isValidSVG = (content) => {
  return (
    content.includes("<svg") &&
    content.includes("xmlns=")
  );
};

// ================= SINGLE UPLOAD FUNCTION
const uploadFiles = async (
  folderPath,
  cloudFolder,
  type
) => {

  const files = fs.readdirSync(folderPath);

  for (const file of files) {

    // Skip hidden/system files
    if (file.startsWith(".")) continue;

    const filePath = path.join(folderPath, file);

    // Skip folders
    if (!fs.statSync(filePath).isFile()) continue;

    // ================= CHECK EXISTING
    const [existing] = await db.query(
      "SELECT id FROM objects WHERE name=? AND type=?",
      [file, type]
    );

    if (existing.length > 0) {
      console.log(`⚠️ ${file} already exists`);
      continue;
    }

    // ================= SVG VALIDATION
    if (file.endsWith(".svg")) {

      const svgContent = fs.readFileSync(filePath, "utf8");

      if (!isValidSVG(svgContent)) {
        console.log(`❌ Invalid SVG: ${file}`);
        continue;
      }
    }

    try {

      // ================= CLOUDINARY UPLOAD
      const result = await cloudinary.uploader.upload(
        filePath,
        {
          folder: cloudFolder,
          resource_type: "image",
          format: file.endsWith(".svg")
            ? "svg"
            : undefined,
          overwrite: false
        }
      );

      // ================= SAVE DB
      await db.query(
        `
        INSERT INTO objects
        (name, category, type, asset_url)
        VALUES (?, ?, ?, ?)
        `,
        [
          file,
          "graphics",
          type,
          result.secure_url
        ]
      );

      console.log(`✅ ${file} uploaded`);

    } catch (err) {

      console.log(`❌ Upload failed: ${file}`);
      console.log(err.message);

    }
  }
};

// ================= MAIN FUNCTION
const uploadGraphics = async () => {

  try {

    const graphicsFolder = path.join(
      __dirname,
      "../assets/graphics"
    );

    // ================= PATHS
    const iconsFolder = path.join(
      graphicsFolder,
      "icons"
    );

    const illustrationsFolder = path.join(
      graphicsFolder,
      "illustrations"
    );

    const designFolder = path.join(
      graphicsFolder,
      "design-elements"
    );

    // ================= ICONS
    console.log("\n📦 Uploading Icons...");
    await uploadFiles(
      iconsFolder,
      "graphics/icons",
      "icon"
    );

    // ================= ILLUSTRATIONS
    console.log("\n🎨 Uploading Illustrations...");
    await uploadFiles(
      illustrationsFolder,
      "graphics/illustrations",
      "illustration"
    );

    // ================= DESIGN ELEMENTS
    console.log("\n🧩 Uploading Design Elements...");
    await uploadFiles(
      designFolder,
      "graphics/design-elements",
      "design-element"
    );

    console.log("\n🎉 All graphics uploaded successfully");

  } catch (error) {

    console.log("❌ Upload error:");
    console.log(error.message);

  }
};

uploadGraphics();