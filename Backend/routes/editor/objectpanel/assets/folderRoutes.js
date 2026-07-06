const express =
  require("express");

const router =
  express.Router();

const {
  verifyToken,
} = require(
  "../../../../middleware/authMiddleware"
);

const folderController =
  require(
    "../../../../controllers/editor/objectpanel/assets/folderController"
  );


// Create Folder
router.post(
  "/",
  verifyToken,
  folderController.createFolder
);


// Get Folders
router.get(
  "/",
  verifyToken,
  folderController.getFolders
);


// Search Folder
router.get(
  "/search",
  verifyToken,
  folderController.searchFolders
);


// Folder Tree
router.get(
  "/tree",
  verifyToken,
  folderController.folderTree
);


// Rename Folder
router.put(
  "/rename/:id",
  verifyToken,
  folderController.renameFolder
);


// Delete Folder
router.delete(
  "/:id",
  verifyToken,
  folderController.deleteFolder
);

module.exports =
  router;