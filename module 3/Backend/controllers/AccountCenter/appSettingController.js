const db = require('../../config/db');
 
// GET /api/account/app-settings
const getAppSettings = async (req, res) => {
    try {
        const userId = req.user.id;
 
        const [rows] = await db.execute(
            'SELECT * FROM app_settings WHERE user_id = ?',
            [userId]
        );
 
        // Create default row if user has no settings yet.
        if (rows.length === 0) {
            await db.execute(
                `INSERT INTO app_settings (
                    user_id,
                    theme,
                    email_notifications,
                    push_notifications,
                     export_format,
                    export_quality,
                    app_language
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    'dark',
                    true,
                    true,
                    'default',
                    'default',
                    'en-IN'
 
                ]
            );
 
            const [newRows] = await db.execute(
                 'SELECT * FROM app_settings WHERE user_id = ?',
                [userId]
            );
 
            return res.status(200).json({
                success: true,
                settings: newRows[0]
            });
        }
 
        return res.status(200).json({
            success: true,
            settings: rows[0]
        });
    } catch (error) {
        console.error('Get App Settings Error:', error);
        return res.status(500).json({
            success: false,
             message: 'Failed to fetch app settings'
        });
    }
};
 
// PUT /api/account/app-settings
const updateAppSettings = async (req, res) => {
    try {
        const userId = req.user.id;
 
        const {
            theme = 'light',
            email_notifications = 1,
            push_notifications = 1,
            export_format = 'png',
            export_quality = 'high',
            app_language = 'en'
        } = req.body;
 
        await db.execute(
            `INSERT INTO app_settings (
                user_id,
                theme,
                email_notifications,
                push_notifications,
                export_format,
                export_quality,
                app_language
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                theme = VALUES(theme),
                email_notifications = VALUES(email_notifications),
                push_notifications = VALUES(push_notifications),
                export_format = VALUES(export_format),
                export_quality = VALUES(export_quality),
                app_language = VALUES(app_language)`,
            [
                userId,
                theme,
                email_notifications,
                push_notifications,
                export_format,
                export_quality,
                app_language
            ]
        );
 
        const [rows] = await db.execute(
            `SELECT * FROM app_settings WHERE user_id = ?`,
            [userId]
        );
 
        return res.status(200).json({
            success: true,
            message: 'App settings updated successfully',
            settings: rows[0]
        });
 
    } catch (error) {
        console.error('Update App Settings Error:', error);
 
        return res.status(500).json({
            success: false,
            message: 'Failed to update app settings',
            error: error.message
        });
    }
};
 
 
module.exports = {
    getAppSettings,
    updateAppSettings
}; 