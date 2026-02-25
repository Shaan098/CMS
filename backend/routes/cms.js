const express = require('express');
const router = express.Router();
const {
    getAllCMS,
    getCMSById,
    createCMS,
    updateCMS,
    deleteCMS
} = require('../controllers/cmsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public/Protected routes - GET operations
router.get('/', getAllCMS);
router.get('/:id', getCMSById);

// Admin-only routes - Create, Update, Delete
router.post('/', auth, roleCheck('Admin'), createCMS);
router.put('/:id', auth, roleCheck('Admin'), updateCMS);
router.delete('/:id', auth, roleCheck('Admin'), deleteCMS);

module.exports = router;
