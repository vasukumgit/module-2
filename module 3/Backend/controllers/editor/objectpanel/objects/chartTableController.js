const db = require("../../../../config/db");

// SAVE CHART
exports.saveChart = async (req, res) => {
 
  try {
 
    const {
      design_id,
      chart_type,
      chart_data,
      chart_labels,
      x,
      y,
      width,
      height
    } = req.body;
 
    // VALIDATION
    if (!design_id) {
      return res.status(400).json({
        success: false,
        message: "design_id is required"
      });
    }
 
    await db.query(
      `
      INSERT INTO editor_chart_tables
      (
        design_id,
        chart_type,
        chart_data,
        chart_labels,
        x,
        y,
        width,
        height
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        design_id,
        chart_type,
        JSON.stringify(chart_data),
        JSON.stringify(chart_labels),
        x,
        y,
        width,
        height
      ]
    );
 
    res.status(201).json({
      success: true,
      message: "Chart saved successfully"
    });
 
  } catch (error) {
 
    console.log(error);
 
    res.status(500).json({
      success: false,
      message: error.message
    });
 
  }
 
}; 

// SAVE TABLE
exports.saveTable = async (req, res) => {
  try {

    const {
      design_id,
      table_data,
      x,
      y,
      width,
      height
    } = req.body;

    // VALIDATION
    if (!design_id) {
      return res.status(400).json({
        success: false,
        message: "design_id is required"
      });
    }

    await db.query(
      `INSERT INTO editor
      (design_id, table_data, x, y, width, height)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        design_id,
        JSON.stringify(table_data),
        x,
        y,
        width,
        height
      ]
    );

    res.json({
      success: true,
      message: "Table saved successfully"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error saving table"
    });
  }
};

// GET ALL ELEMENTS OF DESIGN
exports.getEditorData = async (req, res) => {
  try {
    const { design_id } = req.params;

    const [data] = await db.query(
      "SELECT * FROM editor WHERE design_id = ?",
      [design_id]
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};