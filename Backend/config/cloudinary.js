const cloudinary = require("cloudinary").v2;
require("dotenv").config();
//config cloudinary.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Connected ✅");
  } catch (error) {
    console.log("Cloudinary Connection Failed ❌");
    console.log(error.message);
  }
})();
 
module.exports = cloudinary;
