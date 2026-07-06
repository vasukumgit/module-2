const db = require("../../../../config/db");

// ==========================
// STAR ITEM
// ==========================
exports.starItem = async (req, res) => {

    try {

        const {
            user_id,
            item_id,
            item_type
        } = req.body;

        if (!user_id || !item_id || !item_type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // check existing
        const checkQuery = `
            SELECT * FROM editor_starred_items
            WHERE user_id = ?
            AND item_id = ?
            AND item_type = ?
        `;

        const [checkResult] = await db.query(
            checkQuery,
            [user_id, item_id, item_type]
        );

        // already starred
        if (checkResult.length > 0) {
            return res.json({
                success: true,
                message: "Already starred"
            });
        }

        // insert
        const insertQuery = `
            INSERT INTO editor_starred_items
            (
                user_id,
                item_id,
                item_type,
                is_starred
            )
            VALUES (?, ?, ?, true)
        `;

        const [insertResult] = await db.query(
            insertQuery,
            [user_id, item_id, item_type]
        );

        res.json({
            success: true,
            message: "Item starred successfully",
            data: insertResult
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ==========================
// UNSTAR ITEM
// ==========================
exports.unstarItem = async (req, res) => {

    try {

        const {
            user_id,
            item_id,
            item_type
        } = req.body;

        const deleteQuery = `
            DELETE FROM editor_starred_items
            WHERE user_id = ?
            AND item_id = ?
            AND item_type = ?
        `;

        await db.query(
            deleteQuery,
            [user_id, item_id, item_type]
        );

        res.json({
            success: true,
            message: "Item unstarred successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ==========================
// CHECK STAR STATUS
// ==========================
exports.checkStarred = async (req, res) => {

    try {

        const {
            user_id,
            item_id,
            item_type
        } = req.query;

        const query = `
            SELECT * FROM editor_starred_items
            WHERE user_id = ?
            AND item_id = ?
            AND item_type = ?
        `;

        const [result] = await db.query(
            query,
            [user_id, item_id, item_type]
        );

        res.json({
            success: true,
            isStarred: result.length > 0
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ==========================
// GET ALL STARRED ITEMS
// ==========================
exports.getAllStarredItems = async (req, res) => {

    try {

        const user_id = req.params.user_id;

        // get all starred records
        // ✅ CHANGED: starred_items → editor_starred_items
        const [starredItems] = await db.query(`
            SELECT * FROM editor_starred_items
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [user_id]);

        // grouped response
        const groupedData = {
            templates: [],
            projects: [],
            photos: [],
            graphics: []
        };

        // loop through all starred items
        for (const item of starredItems) {

            const {
                item_id,
                item_type
            } = item;

            // ==========================
            // TEMPLATE
            // ✅ CHANGED: "templates" → "editor_templates"
            // ==========================
            if (item_type === "template") {

                const [templateData] = await db.query(`
                    SELECT * FROM templates
                    WHERE id = ?
                `, [item_id]);

                if (templateData.length > 0) {
                    groupedData.templates.push(templateData[0]);
                }
            }

            // ==========================
            // PROJECT
            // ==========================
            if (item_type === "project") {

                const [projectData] = await db.query(`
                    SELECT * FROM projects
                    WHERE id = ?
                `, [item_id]);

                if (projectData.length > 0) {
                    groupedData.projects.push(projectData[0]);
                }
            }

            // ==========================
            // PHOTO
            // ==========================
            if (item_type === "photo") {

                const [photoData] = await db.query(`
                    SELECT * FROM objects
                    WHERE id = ?
                `, [item_id]);

                if (photoData.length > 0) {
                    groupedData.photos.push(photoData[0]);
                }
            }

            // ==========================
            // GRAPHIC
            // ==========================
            if (item_type === "graphic") {

                const [graphicData] = await db.query(`
                    SELECT * FROM objects
                    WHERE id = ?
                `, [item_id]);

                if (graphicData.length > 0) {
                    groupedData.graphics.push(graphicData[0]);
                }
            }
        }

        // final response
        res.json({
            success: true,
            data: groupedData
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};