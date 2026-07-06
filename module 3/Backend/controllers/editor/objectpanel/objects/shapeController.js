// const db = require("../../../../config/db");

// // GET SVG Shapes
// exports.getShapes = async (req, res) => {
//   try {

//     const { search } = req.query;

//     let query = `
//       SELECT *
//       FROM objects
//       WHERE category = 'shapes'
//       AND type = 'svg-vector'
//     `;

//     let values = [];

//     // search by name
//     if (search) {
//       query += " AND name LIKE ?";
//       values.push(`%${search}%`);
//     }

//     const [data] = await db.query(query, values);

//     res.json(data);

//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: "Error fetching SVG shapes"
//     });
//   }
// };
const db = require("../../../../config/db");

// ================= GET ALL SHAPES =================

exports.getShapes = async (req, res) => {

  try {

    const { search } = req.query;

    let query = `
      SELECT *
      FROM objects
      WHERE category = 'shapes'
    `;

    let values = [];

    // optional search
    if (search) {

      query += " AND name LIKE ?";

      values.push(`%${search}%`);

    }

    // latest first
    query += " ORDER BY id DESC";

    // fetch all shapes
    const [data] = await db.query(query, values);

    console.log("Total Shapes:", data.length);

    res.status(200).json(data);

  } catch (err) {

    console.log("Shapes Fetch Error:", err.message);

    res.status(500).json({
      success: false,
      message: "Error fetching shapes"
    });

  }

};