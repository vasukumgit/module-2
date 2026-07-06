const db =
  require("../../../../config/db");


// ======================================================
// UPLOAD ASSET
// ======================================================

exports.uploadAsset =
  async (req, res) => {

    try {

      const {
        title,
        category,
        folder_id,
        tags,
      } = req.body;

      // =========================================
      // VALIDATION
      // =========================================

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Image is required",
          });
      }

      const file =
        req.file;

      // =========================================
      // INSERT ASSET
      // =========================================

      const sql = `
        INSERT INTO editor_assets
        (
          title,
          category,
          folder_id,
          tags,
          file_name,
          file_url,
          mime_type,
          file_size,
          uploaded_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const [result] =
        await db.query(
          sql,
          [
            title ||
              file.originalname,

            category ||
              "general",

            folder_id ||
              null,

            tags || null,

            file.filename,

            `/uploads/${file.filename}`,

            file.mimetype,

            file.size,

            req.user.id,
          ]
        );

      res
        .status(201)
        .json({
          success: true,
          message:
            "Asset uploaded successfully",

          assetId:
            result.insertId,

          imageUrl:
            `http://localhost:5050/uploads/${file.filename}`,
        });

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });

    }

  };


// ======================================================
// GET ALL ASSETS
// ======================================================

exports.getAssets =
  async (req, res) => {

    try {

      const sql = `
        SELECT
          a.id,
          a.title,
          a.category,
          a.tags,

          a.file_name,
          a.file_url,

          a.mime_type,
          a.file_size,

          a.created_at,
          a.updated_at,

          a.is_favorite,
          a.is_deleted,

          af.folder_name,

          u.name AS createdBy,

          DATE_FORMAT(
            a.created_at,
            '%d %M %Y'
          ) AS created_date,

          DATE_FORMAT(
            a.updated_at,
            '%d %M %Y'
          ) AS updated_date,

          ROUND(
            a.file_size / 1024,
            2
          ) AS size_kb,

          ROUND(
            a.file_size / (1024 * 1024),
            2
          ) AS size_mb

        FROM editor_assets a

        LEFT JOIN editor_asset_folders af
        ON a.folder_id = af.id

        LEFT JOIN users u
        ON a.uploaded_by = u.id

        WHERE
          a.is_deleted = false
        AND
          a.uploaded_by = ?

        ORDER BY
          a.created_at DESC
      `;

      const [rows] =
        await db.query(
          sql,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        data: rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// GET SINGLE ASSET
// ======================================================

exports.getSingleAsset =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const sql = `
        SELECT
          a.id,
          a.title,
          a.category,

          a.file_url,
          a.file_name,

          a.file_size,
          a.mime_type,

          af.folder_name
          AS saved_in,

          u.name
          AS createdBy,

          a.created_at,
          a.updated_at,

          DATE_FORMAT(
            a.created_at,
            '%d %M %Y'
          ) AS created_date,

          DATE_FORMAT(
            a.updated_at,
            '%d %M %Y'
          ) AS updated_date,

          ROUND(
            a.file_size / 1024,
            2
          ) AS size_kb

        FROM editor_assets a

        LEFT JOIN editor_asset_folders af
        ON a.folder_id = af.id

        LEFT JOIN users u
        ON a.uploaded_by = u.id

        WHERE
          a.id = ?
        AND
          a.uploaded_by = ?
        AND
          a.is_deleted = false
      `;

      const [rows] =
        await db.query(
          sql,
          [
            id,
            req.user.id,
          ]
        );

      if (!rows.length) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Asset not found",
          });

      }

      res.status(200).json({
        success: true,
        data: rows[0],
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// SEARCH ASSETS
// ======================================================

exports.searchAssets =
  async (req, res) => {

    try {

      const {
        search = "",
      } = req.query;

      const sql = `
        SELECT
          a.id,
          a.title,
          a.category,

          a.file_name,
          a.file_url,

          a.file_size,
          a.created_at,

          af.folder_name,

          u.name
          AS createdBy,

          DATE_FORMAT(
            a.created_at,
            '%d %M %Y'
          ) AS created_date

        FROM editor_assets a

        LEFT JOIN editor_asset_folders af
        ON a.folder_id = af.id

        LEFT JOIN users u
        ON a.uploaded_by = u.id

        WHERE
          a.title LIKE ?
        AND
          a.is_deleted = false
        AND
          a.uploaded_by = ?

        ORDER BY
          a.created_at DESC
      `;

      const [rows] =
        await db.query(
          sql,
          [
            `%${search}%`,
            req.user.id,
          ]
        );

      res.status(200).json({
        success: true,
        data: rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// GET ASSETS BY FOLDER
// ======================================================

exports.getAssetsByFolder =
  async (req, res) => {

    try {

      const {
        folderId,
      } = req.params;

      const sql = `
        SELECT
          a.id,
          a.title,

          a.file_name,
          a.file_url,

          a.file_size,
          a.created_at,

          af.folder_name,

          u.name
          AS createdBy,

          DATE_FORMAT(
            a.created_at,
            '%d %M %Y'
          ) AS created_date

        FROM editor_assets a

        LEFT JOIN editor_asset_folders af
        ON a.folder_id = af.id

        LEFT JOIN users u
        ON a.uploaded_by = u.id

        WHERE
          a.folder_id = ?
        AND
          a.is_deleted = false
        AND
          a.uploaded_by = ?

        ORDER BY
          a.created_at DESC
      `;

      const [rows] =
        await db.query(
          sql,
          [
            folderId,
            req.user.id,
          ]
        );

      res.status(200).json({
        success: true,
        data: rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// RECENT ASSETS
// ======================================================

exports.recentAssets =
  async (req, res) => {

    try {

      const sql = `
        SELECT
          a.id,
          a.title,

          a.file_url,
          a.created_at,

          af.folder_name,

          u.name
          AS createdBy

        FROM editor_assets a

        LEFT JOIN editor_asset_folders af
        ON a.folder_id = af.id

        LEFT JOIN users u
        ON a.uploaded_by = u.id

        WHERE
          a.is_deleted = false
        AND
          a.uploaded_by = ?

        ORDER BY
          a.created_at DESC

        LIMIT 10
      `;

      const [rows] =
        await db.query(
          sql,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        data: rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// TOGGLE FAVORITE
// ======================================================

exports.toggleFavorite =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await db.query(
        `
        UPDATE editor_assets
        SET
          is_favorite =
          NOT is_favorite,

          updated_at = NOW()

        WHERE id = ?
        AND uploaded_by = ?
        `,
        [
          id,
          req.user.id,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Favorite updated",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// FAVORITE ASSETS
// ======================================================

exports.favoriteAssets =
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT *
          FROM editor_assets

          WHERE
            is_favorite = true
          AND
            is_deleted = false
          AND
            uploaded_by = ?

          ORDER BY
            created_at DESC
          `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        data: rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// MOVE ASSET
// ======================================================

exports.moveAsset =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        folder_id,
      } = req.body;

      await db.query(
        `
        UPDATE editor_assets
        SET
          folder_id = ?,
          updated_at = NOW()

        WHERE id = ?
        AND uploaded_by = ?
        `,
        [
          folder_id || null,
          id,
          req.user.id,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Asset moved successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

// ======================================================

// RENAME ASSET

// ======================================================
 
exports.renameAsset =

  async (req, res) => {
 
    try {
 
      const { id } =

        req.params;
 
      const { title } =

        req.body;
 
      // =========================================

      // VALIDATION

      // =========================================
 
      if (!title) {

        return res.status(400).json({

          success: false,

          msg: "Title is required",

        });

      }
 
      // =========================================

      // CHECK DUPLICATE TITLE

      // =========================================
 
      const [existingAsset] =

        await db.query(

          `

          SELECT id

          FROM editor_assets

          WHERE title = ?

          AND uploaded_by = ?

          AND id != ?

          AND is_deleted = false

          `,

          [

            title,

            req.user.id,

            id,

          ]

        );
 
      if (existingAsset.length > 0) {

        return res.status(400).json({

          success: false,

          msg: "File name already exists",

        });

      }
 
      // =========================================

      // RENAME ASSET

      // =========================================
 
      await db.query(

        `

        UPDATE editor_assets

        SET

          title = ?,

          updated_at = NOW()

        WHERE id = ?

        AND uploaded_by = ?

        `,

        [

          title,

          id,

          req.user.id,

        ]

      );
 
      res.status(200).json({

        success: true,

        msg:

          "Asset renamed successfully",

      });
 
    } catch (error) {
 
      res.status(500).json({

        success: false,

        msg:

          error.message,

      });
 
    }
 
  };
 
// ======================================================
// GET TRASH ASSETS
// ======================================================

exports.getTrashAssets =
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT *
          FROM editor_assets

          WHERE
            is_deleted = true
          AND
            uploaded_by = ?

          ORDER BY
            created_at DESC
          `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        data: rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// RESTORE ASSET
// ======================================================

exports.restoreAsset =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await db.query(
        `
        UPDATE editor_assets
        SET
          is_deleted = false,
          updated_at = NOW()

        WHERE id = ?
        AND uploaded_by = ?
        `,
        [
          id,
          req.user.id,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Asset restored successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


// ======================================================
// DELETE ASSET
// ======================================================

exports.deleteAsset =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const [result] =
        await db.query(
          `
          UPDATE editor_assets
          SET
            is_deleted = true,
            updated_at = NOW()

          WHERE id = ?
          AND uploaded_by = ?
          `,
          [
            id,
            req.user.id,
          ]
        );

      if (
        result.affectedRows === 0
      ) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Asset not found",
          });

      }

      res.status(200).json({
        success: true,
        message:
          "Moved to trash",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };