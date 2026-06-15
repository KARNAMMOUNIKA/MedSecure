const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');
const { getEmergencyProfile, getMyScanLogs } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

router.route('/me').get(protect, getMyProfile).put(protect, updateMyProfile);
router.get('/scans', protect, getMyScanLogs);
router.get('/emergency/:qrToken', getEmergencyProfile);

module.exports = router;
