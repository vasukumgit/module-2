const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const db = require("../config/db");

const folder = path.resolve(__dirname, "../assets/shapes");

// create folder if not exists
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

// ================= DOWNLOAD SVG SHAPES =================

const downloadShapes = async () => {
  try {

    console.log("Fetching SVG Shapes...");

    const response = await axios.get(
      "https://api.github.com/repos/feathericons/feather/contents/icons",
      {
        headers: {
          "User-Agent": "node.js",
        },
      }
    );

    const files = response.data;

    console.log("Total Shapes:", files.length);

    // download only first 50 svg files
    for (let file of files.slice(0, 50)) {

      // only svg files
      if (!file.name.endsWith(".svg")) continue;

      const rawUrl = file.download_url;

      const filePath = path.join(folder, file.name);

      // download svg
      const svg = await axios.get(rawUrl, {
        responseType: "arraybuffer",
      });

      // save locally
      fs.writeFileSync(filePath, svg.data);

      console.log(file.name + " downloaded");
    }

    console.log("50 SVG Shapes Downloaded ✅");

  } catch (error) {

    console.log("Download Error:", error.message);

  }
};

// ================= UPLOAD SVG SHAPES =================

const uploadShapes = async () => {

  try {

    const files = fs.readdirSync(folder);

    console.log("Files Found:", files.length);

    // upload only first 50 svg files
    for (let file of files.slice(0, 50)) {

      try {

        // only svg
        if (!file.endsWith(".svg")) continue;

        console.log("Processing:", file);

        // check already exists
        const [existing] = await db.query(
          "SELECT id FROM objects WHERE name=? AND category=?",
          [file, "shapes"]
        );

        if (existing.length > 0) {
          console.log(file + " already exists");
          continue;
        }

        const filePath = path.join(folder, file);

        console.log("Uploading to Cloudinary...");

        // upload svg vector
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "shapes",
          resource_type: "image"
        });

        console.log("Uploaded URL:", result.secure_url);

        // insert into DB
        const sql = `
          INSERT INTO objects
          (name, category, type, asset_url)
          VALUES (?, ?, ?, ?)
        `;

        const values = [
          file,
          "shapes",
          "svg",
          result.secure_url
        ];

        const [insertData] = await db.query(sql, values);

        console.log("Inserted ID:", insertData.insertId);

        console.log(file + " uploaded successfully ✅");

      } catch (innerError) {

        console.log("Error in file:", file);
        console.log(innerError.message);

      }
    }

    console.log("50 SVG Vector Shapes Uploaded ✅");

  } catch (error) {

    console.log("Upload Function Error:", error.message);

  }
};

// ================= MAIN =================

const start = async () => {

  await downloadShapes();

  await uploadShapes();

};

start();