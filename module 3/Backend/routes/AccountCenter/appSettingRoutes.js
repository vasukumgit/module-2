const express = require('express');
const router = express.Router();

// Middleware
 
const { verifyToken } = require('../../middleware/authMiddleware');
const {
    getAppSettings,
    updateAppSettings
} = require('../../controllers/AccountCenter/appSettingController');
 
router.get('/', verifyToken, getAppSettings);
router.put('/', verifyToken, updateAppSettings);
 
module.exports = router;
 