const express = require('express');
const router = express.Router();
const {
    getAllCMS,
    getCMSById,
    createCMS,
    updateCMS,
    deleteCMS,
    getPendingCMS,
    getPendingCount,
    getUserSubmissions,
    approveCMS,
    rejectCMS
} = require('../controllers/cmsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public/Protected routes - GET operations (specific routes BEFORE parameterized routes)
router.get('/', getAllCMS);

// Authenticated user routes (specific paths MUST come before /:id)
router.get('/pending/count', auth, roleCheck('Admin'), getPendingCount); // Admin: Get pending count
router.get('/pending', auth, roleCheck('Admin'), getPendingCMS); // Admin: View pending submissions
router.get('/my-submissions', auth, getUserSubmissions); // Users: View their own submissions

// Parameterized route - MUST be after specific paths
router.get('/:id', getCMSById);

// POST routes
router.post('/', auth, createCMS); // All authenticated users can create

// Admin-only routes
router.put('/:id/approve', auth, roleCheck('Admin'), approveCMS); // Approve content
router.put('/:id/reject', auth, roleCheck('Admin'), rejectCMS); // Reject content
router.put('/:id', auth, roleCheck('Admin'), updateCMS); // Update content
router.delete('/:id', auth, roleCheck('Admin'), deleteCMS); // Delete content

module.exports = router;
