const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', getSettings);
router.put('/', roleCheck('admin'), updateSettings);

module.exports = router;
