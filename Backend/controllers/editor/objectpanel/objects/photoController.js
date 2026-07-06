const axios = require("axios");
const db = require("../../../../config/db");
const cloudinary = require("../../../../config/cloudinary");
const fs = require("fs");
 
const getPhotos = async (req, res) => {
  try {
    const { search = "", source = "db", page = 1, limit = 20 } = req.query;
 
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
 
    let dbPhotos = [];
    let externalPhotos = [];
 
    // 🔹 DB PHOTOS
    if (source === "db" || source === "all") {
      let query = "SELECT * FROM objects WHERE type = 'image'";
      let values = [];
 
      if (search) {
  query += " AND LOWER(name) LIKE LOWER(?)";
  values.push(`%${search}%`);
}
 
      query += " LIMIT ? OFFSET ?";
      values.push(limitNum, offset);
 
      const [rows] = await db.query(query, values);
 
      dbPhotos = rows.map(item => ({
        id: item.id,
        name: item.name,
        type: "image",
        category: "photos",
        asset_url: item.asset_url
      }));
    }
 
    // 🔹 EXTERNAL PHOTOS (PEXELS)
    if (source === "external" || source === "all") {
      console.log("CALLING PEXELS API");
 
      const response = await axios.get(
        "https://api.pexels.com/v1/search",
        {
          params: {
            query: search || "nature",
            per_page: limitNum,
            page: pageNum
          },
          headers: {
            Authorization: process.env.PEXELS_API_KEY
          }
        }
      );
 
      externalPhotos = response.data.photos.map(photo => ({
        id: photo.id,
        name: photo.photographer,
        type: "image",
        category: "external",
        asset_url: photo.src.medium
      }));
    }
 
    // 🔹 MERGE
    const allPhotos = [...dbPhotos, ...externalPhotos];
 
    res.json({
      page: pageNum,
      limit: limitNum,
      count: allPhotos.length,
      data: allPhotos
    });
 
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
 
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
};
 
const uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
 
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
 
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
  folder: "photos"
});
 
    // Save to DB
    const query = `
      INSERT INTO objects (name, category, type, asset_url)
      VALUES (?, 'photos', 'image', ?)
    `;
 
    const [dbResult] = await db.query(query, [
      file.originalname,
      result.secure_url
    ]);
 
    // Delete temp file
//    fs.unlinkSync(file.path);
 
    res.status(201).json({
      message: "Photo uploaded successfully",
      id: dbResult.insertId,
      url: result.secure_url
    });
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
module.exports = {
  getPhotos,
  uploadPhoto
}; 