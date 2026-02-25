const express = require('express');
const router = express.Router();
const { getReports, getReportHistory } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All report routes require authentication and admin role
router.use(auth);
router.use(roleCheck('Admin'));

router.get('/', getReports);
router.get('/history', getReportHistory);

module.exports = router;
