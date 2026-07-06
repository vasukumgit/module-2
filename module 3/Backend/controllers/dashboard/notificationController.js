const db = require("../../config/db");

// ===============================
// CREATE NOTIFICATION (Internal)
// ===============================
exports.createNotification = async (
  user_id,
  sender_id,
  type,
  reference_id,
  message,
  status = null
) => {
  try {
    const sql = `
      INSERT INTO notifications
      (user_id, sender_id, type, reference_id, message, status, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      user_id,
      sender_id,
      type,
      reference_id,
      message,
      status,
      0,
    ]);
  } catch (error) {
    console.error("Notification Error:", error);
  }
};

// ===============================
// GET ALL NOTIFICATIONS
// ===============================
exports.getNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const sql = `
      SELECT
        n.*,
        sender.name AS sender_name,
        receiver.name AS receiver_name,
        d.name AS project_name
      FROM notifications n
      LEFT JOIN users sender ON n.sender_id = sender.id
      LEFT JOIN users receiver ON n.user_id = receiver.id
      LEFT JOIN designs d ON n.reference_id = d.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `;

    const [rows] = await db.execute(sql, [user_id]);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// MARK SINGLE NOTIFICATION AS READ
// ===============================
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const sql = `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.execute(sql, [id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// MARK ALL AS READ
// ===============================
exports.markAllAsRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const sql = `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND is_read = 0
    `;

    await db.execute(sql, [user_id]);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UNREAD COUNT
// ===============================
exports.getUnreadCount = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const sql = `
      SELECT COUNT(*) as unreadCount
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `;

    const [rows] = await db.execute(sql, [user_id]);

    return res.status(200).json({
      success: true,
      unreadCount: rows[0].unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// DELETE NOTIFICATION
// ===============================
exports.deleteNotification = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const ids = req.body?.ids;

    let sql;
    let values;

    if (Array.isArray(ids) && ids.length > 0) {
      const placeholders = ids.map(() => "?").join(",");

      sql = `
        DELETE FROM notifications
        WHERE user_id = ? AND id IN (${placeholders})
      `;

      values = [user_id, ...ids];
    } else if (id) {
      sql = `
        DELETE FROM notifications
        WHERE id = ? AND user_id = ?
      `;

      values = [id, user_id];
    } else {
      return res.status(400).json({
        success: false,
        message: "Provide id or ids",
      });
    }

    const [result] = await db.execute(sql, values);

    return res.status(200).json({
      success: true,
      deletedRows: result.affectedRows,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// ACCEPT REQUEST
// ===============================
exports.acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    const notification = rows[0];

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const [senderRows] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [notification.sender_id]
    );

    const senderName = senderRows[0]?.name || "Someone";

    const [receiverRows] = await db.execute(
      "SELECT name, email FROM users WHERE id = ?",
      [user_id]
    );

    const receiverName = receiverRows[0]?.name || "User";
    const receiverEmail = receiverRows[0]?.email;

    const [collabRows] = await db.execute(
      `SELECT role 
       FROM editor_collaborators
       WHERE design_id = ?
       AND invitee_email = ?
       AND status = 'pending'
       LIMIT 1`,
      [notification.reference_id, receiverEmail]
    );

    const role = collabRows[0]?.role || "editor";
    const accessText = role === "viewer" ? "view" : "edit";

    await db.execute(
      `UPDATE editor_collaborators
       SET status = 'accepted',
           user_id = ?,
           accepted_at = NOW(),
           invite_token = NULL
       WHERE design_id = ?
       AND invitee_email = ?`,
      [user_id, notification.reference_id, receiverEmail]
    );

    await db.execute(
      `UPDATE notifications
       SET status = 'accepted',
           type = 'access_accepted',
           message = ?,
           is_read = 1
       WHERE id = ? AND user_id = ?`,
      [`You accepted ${senderName}'s ${accessText} request`, id, user_id]
    );

    await db.execute(
      `INSERT INTO notifications
       (user_id, sender_id, type, reference_id, message, status, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        notification.sender_id,
        user_id,
        "access_accepted",
        notification.reference_id,
        `${receiverName} accepted your ${accessText} access request`,
        "accepted",
        0,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Request accepted",
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// REJECT REQUEST
// ===============================
exports.rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    const notification = rows[0];

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const [senderRows] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [notification.sender_id]
    );

    const senderName = senderRows[0]?.name || "Someone";

    const [receiverRows] = await db.execute(
      "SELECT email FROM users WHERE id = ?",
      [user_id]
    );

    const receiverEmail = receiverRows[0]?.email;

    const [collabRows] = await db.execute(
      `SELECT role 
       FROM editor_collaborators
       WHERE design_id = ?
       AND invitee_email = ?
       LIMIT 1`,
      [notification.reference_id, receiverEmail]
    );

    const role = collabRows[0]?.role || "editor";
    const accessText = role === "viewer" ? "view" : "edit";

    await db.execute(
      `DELETE FROM editor_collaborators
       WHERE design_id = ?
       AND invitee_email = ?`,
      [notification.reference_id, receiverEmail]
    );

    await db.execute(
      `UPDATE notifications
       SET status = 'rejected',
           type = 'access_rejected',
           message = ?,
           is_read = 1
       WHERE id = ? AND user_id = ?`,
      [`You rejected ${senderName}'s ${accessText} request`, id, user_id]
    );

    return res.status(200).json({
      success: true,
      message: "Request rejected",
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// MARK BULK READ
// ===============================
exports.markBulkRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No IDs provided",
      });
    }

    const placeholders = ids.map(() => "?").join(",");

    const sql = `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND id IN (${placeholders})
    `;

    await db.execute(sql, [user_id, ...ids]);

    return res.status(200).json({
      success: true,
      message: "Bulk marked as read",
    });
  } catch (error) {
    next(error);
  }
};