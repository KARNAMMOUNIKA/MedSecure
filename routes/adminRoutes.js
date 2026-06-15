const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  toggleUserSuspension,
  getSecurityLogs,
  getAllScanLogs,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply protection & admin guard to all routes
router.use(protect);
router.use(admin);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleUserSuspension);
router.get('/security-logs', getSecurityLogs);
router.get('/scan-logs', getAllScanLogs);

module.exports = router;
