const express =
  require("express");

const router =
  express.Router();

const {
  verifyToken,
} = require(
  "../../../../middleware/authMiddleware"
);

const upload =
  require(
    "../../../../middleware/upload"
  );

const assetController =
  require(
    "../../../../controllers/editor/objectpanel/assets/assetController"
  );


// Upload Asset
router.post(
  "/upload",
  verifyToken,
  upload.single(
    "file"
  ),
  assetController.uploadAsset
);


// Get All Assets
router.get(
  "/",
  verifyToken,
  assetController.getAssets
);


// Search Asset
router.get(
  "/search",
  verifyToken,
  assetController.searchAssets
);


// Recent Assets
router.get(
  "/recent",
  verifyToken,
  assetController.recentAssets
);


// Favorite Assets
router.get(
  "/favorites",
  verifyToken,
  assetController.favoriteAssets
);


// Toggle Favorite
router.put(
  "/favorite/:id",
  verifyToken,
  assetController.toggleFavorite
);


// Get Assets By Folder
router.get(
  "/folder/:folderId",
  verifyToken,
  assetController.getAssetsByFolder
);


// Move Asset
router.put(
  "/move/:id",
  verifyToken,
  assetController.moveAsset
);


// Rename Asset
router.put(
  "/rename/:id",
  verifyToken,
  assetController.renameAsset
);


// Trash Assets
router.get(
  "/trash",
  verifyToken,
  assetController.getTrashAssets
);


// Restore Asset
router.put(
  "/restore/:id",
  verifyToken,
  assetController.restoreAsset
);


// Get Single Asset
router.get(
  "/:id",
  verifyToken,
  assetController.getSingleAsset
);


// Delete Asset
router.delete(
  "/:id",
  verifyToken,
  assetController.deleteAsset
);

module.exports =
  router;