const db =
  require("../../../../config/db");


// ======================================================
// CREATE FOLDER
// ======================================================

exports.createFolder =
  async (req, res) => {

    try {

      const {
        folder_name,
        parent_folder_id,
      } = req.body;

      const created_by =
        req.user.id;

      // =========================================
      // VALIDATION
      // =========================================

      if (!folder_name) {
        return res.status(400).json({
          success: false,
          message:
            "Folder name is required",
        });
      }

      if (
        folder_name.trim().length < 2
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Folder name must be at least 2 characters",
        });
      }

      if (
        folder_name.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Folder name must be less than 100 characters",
        });
      }

      // =========================================
      // CHECK DUPLICATE FOLDER
      // =========================================

      const [existingFolder] =
        await db.query(
          `
          SELECT id
          FROM editor_asset_folders
          WHERE folder_name = ?
          AND created_by = ?
          AND parent_folder_id <=> ?
          AND is_deleted = false
          `,
          [
            folder_name.trim(),
            created_by,
            parent_folder_id || null,
          ]
        );

      if (
        existingFolder.length > 0
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Folder name already exists",
        });
      }

      // =========================================
      // CREATE FOLDER
      // =========================================

      const sql = `
        INSERT INTO editor_asset_folders
        (
          folder_name,
          parent_folder_id,
          created_by,
          created_at
        )
        VALUES (?, ?, ?, NOW())
      `;

      const [result] =
        await db.query(
          sql,
          [
            folder_name.trim(),
            parent_folder_id || null,
            created_by,
          ]
        );

      res.status(201).json({
        success: true,
        message:
          "Folder created successfully",
        folderId:
          result.insertId,
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
// GET ALL FOLDERS
// ======================================================

exports.getFolders =
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            af.id,
            af.folder_name,
            af.parent_folder_id,

            af.created_at,
            af.updated_at,

            af.is_deleted,

            af.created_by,

            u.name AS creator_name,

            DATE_FORMAT(
              af.created_at,
              '%d-%m-%Y %h:%i %p'
            ) AS created_date,

            DATE_FORMAT(
              af.updated_at,
              '%d-%m-%Y %h:%i %p'
            ) AS updated_date,

          COUNT(
               CASE
               WHEN a.is_deleted = 0
               THEN a.id
               END
              ) AS asset_count

          FROM editor_asset_folders af

          LEFT JOIN editor_assets a
          ON af.id = a.folder_id

          LEFT JOIN users u
          ON af.created_by = u.id

          WHERE
            af.is_deleted = false
          AND
            af.created_by = ?

          GROUP BY
            af.id,
            af.folder_name,
            af.parent_folder_id,
            af.created_at,
            af.updated_at,
            af.is_deleted,
            af.created_by,
            u.name

          ORDER BY
            af.created_at DESC
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
// SEARCH FOLDERS
// ======================================================

exports.searchFolders =
  async (req, res) => {

    try {

      const {
        search = "",
      } = req.query;

      const [rows] =
        await db.query(
          `
          SELECT
            af.id,
            af.folder_name,
            af.parent_folder_id,

            af.created_at,
            af.updated_at,

            af.is_deleted,

            DATE_FORMAT(
              af.created_at,
              '%d-%m-%Y %h:%i %p'
            ) AS created_date,

            DATE_FORMAT(
              af.updated_at,
              '%d-%m-%Y %h:%i %p'
            ) AS updated_date,

             COUNT(
               CASE
               WHEN a.is_deleted = 0
               THEN a.id
               END
              ) AS asset_count

          FROM editor_asset_folders af

          LEFT JOIN editor_assets a
          ON af.id = a.folder_id

          WHERE
            af.folder_name LIKE ?
          AND
            af.created_by = ?
          AND
            af.is_deleted = false

          GROUP BY
            af.id,
            af.folder_name,
            af.parent_folder_id,
            af.created_at,
            af.updated_at,
            af.is_deleted

          ORDER BY
            af.created_at DESC
          `,
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
// RENAME FOLDER
// ======================================================

exports.renameFolder =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        folder_name,
      } = req.body;

      // =========================================
      // VALIDATION
      // =========================================

      if (!folder_name) {
        return res.status(400).json({
          success: false,
          message:
            "Folder name is required",
        });
      }

      // =========================================
      // CHECK DUPLICATE
      // =========================================

      const [duplicateFolder] =
        await db.query(
          `
          SELECT id
          FROM editor_asset_folders
          WHERE folder_name = ?
          AND created_by = ?
          AND id != ?
          AND is_deleted = false
          `,
          [
            folder_name.trim(),
            req.user.id,
            id,
          ]
        );

      if (
        duplicateFolder.length > 0
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Folder name already exists",
        });
      }

      // =========================================
      // RENAME FOLDER
      // =========================================

      await db.query(
        `
        UPDATE editor_asset_folders
        SET
          folder_name = ?,
          updated_at = NOW()
        WHERE id = ?
        AND created_by = ?
        `,
        [
          folder_name.trim(),
          id,
          req.user.id,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Folder renamed successfully",
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
// DELETE FOLDER
// ======================================================

exports.deleteFolder =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      // =========================================
      // CHECK FOLDER EXISTS
      // =========================================

      const [folder] =
        await db.query(
          `
          SELECT id
          FROM editor_asset_folders
          WHERE id = ?
          AND is_deleted = false
          `,
          [id]
        );

      if (folder.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Folder not found",
        });
      }

      // =========================================
      // DELETE FOLDER
      // =========================================

      await db.query(
        `
        UPDATE editor_asset_folders
        SET
          is_deleted = true,
          updated_at = NOW()
        WHERE id = ?
        `,
        [id]
      );

      // =========================================
      // DELETE ALL ASSETS
      // INSIDE THE FOLDER
      // =========================================

      await db.query(
        `
        UPDATE editor_assets
        SET
          is_deleted = true,
          updated_at = NOW()
        WHERE folder_id = ?
        `,
        [id]
      );

      res.status(200).json({
        success: true,
        msg: "Folder and assets moved to trash",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

// ======================================================
// MOVE FOLDER
// ======================================================

exports.moveFolder =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        parent_folder_id,
      } = req.body;

      // =========================================
      // MOVE FOLDER
      // =========================================

      await db.query(
        `
        UPDATE editor_asset_folders
        SET
          parent_folder_id = ?,
          updated_at = NOW()
        WHERE id = ?
        AND created_by = ?
        `,
        [
          parent_folder_id || null,
          id,
          req.user.id,
        ]
      );

      // =========================================
      // GET UPDATED FOLDER
      // =========================================

      const [rows] =
        await db.query(
          `
          SELECT
            af.id,
            af.folder_name,
            af.parent_folder_id,

            af.created_at,
            af.updated_at,

            DATE_FORMAT(
              af.created_at,
              '%d-%m-%Y %h:%i %p'
            ) AS created_date,

            DATE_FORMAT(
              af.updated_at,
              '%d-%m-%Y %h:%i %p'
            ) AS updated_date,

           COUNT(
               CASE
               WHEN a.is_deleted = 0
               THEN a.id
               END
              ) AS asset_count

          FROM editor_asset_folders af

          LEFT JOIN editor_assets a
          ON af.id = a.folder_id

          WHERE af.id = ?

          GROUP BY
            af.id,
            af.folder_name,
            af.parent_folder_id,
            af.created_at,
            af.updated_at
          `,
          [id]
        );

      res.status(200).json({
        success: true,
        message:
          "Folder moved successfully",
        data:
          rows[0],
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
// FOLDER TREE
// ======================================================

exports.folderTree =
  async (req, res) => {

    try {

      const [folders] =
        await db.query(
          `
          SELECT
            af.id,
            af.folder_name,
            af.parent_folder_id,

            af.created_at,
            af.updated_at,

            af.created_by,

            u.name AS creator_name,

            DATE_FORMAT(
              af.created_at,
              '%d-%m-%Y %h:%i %p'
            ) AS created_date,

            DATE_FORMAT(
              af.updated_at,
              '%d-%m-%Y %h:%i %p'
            ) AS updated_date,

            COUNT(
               CASE
               WHEN a.is_deleted = 0
               THEN a.id
               END
              ) AS asset_count

          FROM editor_asset_folders af

          LEFT JOIN editor_assets a
          ON af.id = a.folder_id

          LEFT JOIN users u
          ON af.created_by = u.id

          WHERE
            af.is_deleted = false
          AND
            af.created_by = ?

          GROUP BY
            af.id,
            af.folder_name,
            af.parent_folder_id,
            af.created_at,
            af.updated_at,
            af.created_by,
            u.name

          ORDER BY
            af.created_at DESC
          `,
          [req.user.id]
        );

      const buildTree =
        (
          parentId = null
        ) => {

          return folders
            .filter(
              (folder) =>
                folder.parent_folder_id ===
                parentId
            )
            .map(
              (folder) => ({
                ...folder,
                children:
                  buildTree(
                    folder.id
                  ),
              })
            );

        };

      res.status(200).json({
        success: true,
        data:
          buildTree(),
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