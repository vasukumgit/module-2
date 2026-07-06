// const fs = require("fs");
// const path = require("path");
// const cloudinary = require("../config/cloudinary");
// const db = require("../config/db");

// // function to upload one folder
// const uploadFolder = async (folderPath, category) => {
//   const files = fs.readdirSync(folderPath);

//   for (let file of files) {
//     const filePath = path.join(folderPath, file);

//     try {
//       // upload to cloudinary
//       const result = await cloudinary.uploader.upload(filePath, {
//         folder: category
//       });

//       // get file type
//       const ext = file.split(".").pop();

//       // save in database
//       await db.query(
//         "INSERT INTO objects (name, category, type, asset_url) VALUES (?, ?, ?, ?)",
//         [file, category, ext, result.secure_url]
//       );

//       console.log(file + " uploaded successfully");

//     } catch (err) {
//       console.log("Error uploading:", file);
//     }
//   }
// };

// // run upload.
// const startUpload = async () => {
//   await uploadFolder("./assets/icons", "icons");
//   await uploadFolder("./assets/graphics", "graphics");
// //   await uploadFolder("./assets/images", "images");

//   console.log("All files uploaded");
// };

// startUpload();



const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const db = require("../config/db");

// reusable upload function
const uploadFolder = async (folderPath, category, type = null, cloudinaryFolder = null) => {
  try {

    const files = fs.readdirSync(folderPath);

    for (let file of files) {

      // check already exists
      const [existing] = await db.query(
        "SELECT id FROM objects WHERE name=? AND category=?",
        [file, category]
      );

      if (existing.length > 0) {
        console.log(file + " already exists");
        continue;
      }

      const filePath = path.join(folderPath, file);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: cloudinaryFolder || category
      });

      // if type not passed -> take extension
      const fileType = type || file.split(".").pop();

      await db.query(
        "INSERT INTO objects (name, category, type, asset_url) VALUES (?, ?, ?, ?)",
        [file, category, fileType, result.secure_url]
      );

      console.log(file + " uploaded successfully");
    }

  } catch (error) {
    console.log("Upload Error:", error.message);
  }
};

// main function
const uploadAssets = async () => {

  // ================= SHAPES =================
  await uploadFolder(
    path.join(__dirname, "../assets/shapes"),
    "shapes"
  );

  // ================= ICONS =================
  await uploadFolder(
    path.join(__dirname, "../assets/graphics/icons"),
    "graphics",
    "icon",
    "graphics/icons"
  );

  // ================= ILLUSTRATIONS =================
  await uploadFolder(
    path.join(__dirname, "../assets/graphics/illustrations"),
    "graphics",
    "illustration",
    "graphics/illustrations"
  );

  // ================= DESIGN ELEMENTS =================
  await uploadFolder(
    path.join(__dirname, "../assets/graphics/design-elements"),
    "graphics",
    "design-element",
    "graphics/design-elements"
  );

  // ================= PHOTOS =================
  // await uploadFolder(
  //   path.join(__dirname, "../assets/photos"),
  //   "photos"
  // );

  console.log("All Assets Uploaded ");
};

uploadAssets();