const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, deleteSetting } = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All settings routes require authentication and admin role
router.use(auth);
router.use(roleCheck('Admin'));

router.get('/', getSettings);
router.put('/', updateSettings);
router.delete('/:key', deleteSetting);

module.exports = router;
