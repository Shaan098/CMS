const express = require('express');
const { getSummaryReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth, roleCheck('approver'));
router.get('/summary', getSummaryReport);

module.exports = router;
