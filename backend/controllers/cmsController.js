const CMS = require('../models/CMS');

// @desc    Get all CMS content
// @route   GET /api/cms
// @access  Public/Protected (based on role)
const getAllCMS = async (req, res) => {
    try {
        // Check if user is authenticated and is admin
        const isAdmin = req.user && req.user.role === 'Admin';

        // Filter: admins see all, others see only approved
        const filter = isAdmin ? {} : { status: 'approved' };

        const cmsContent = await CMS.find(filter)
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: cmsContent.length,
            data: cmsContent
        });
    } catch (error) {
        console.error('Get all CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching CMS content',
            error: error.message
        });
    }
};

// @desc    Get single CMS content by ID
// @route   GET /api/cms/:id
// @access  Public/Protected
const getCMSById = async (req, res) => {
    try {
        const { id } = req.params;

        const cms = await CMS.findById(id).populate('createdBy', 'name email');

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: 'CMS content not found'
            });
        }

        res.status(200).json({
            success: true,
            data: cms
        });
    } catch (error) {
        console.error('Get CMS by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching CMS content',
            error: error.message
        });
    }
};

// @desc    Create new CMS content
// @route   POST /api/cms
// @access  Private (all authenticated users)
const createCMS = async (req, res) => {
    try {
        const { title, description, content } = req.body;

        // Validation
        if (!title || !description || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (title, description, content)'
            });
        }

        // Determine status based on user role
        // Admins: auto-approved, Users: pending approval
        const status = req.user.role === 'Admin' ? 'approved' : 'pending';
        const approvalFields = req.user.role === 'Admin'
            ? { approvedBy: req.user.userId, approvedAt: Date.now() }
            : {};

        const cms = await CMS.create({
            title,
            description,
            content,
            status,
            ...approvalFields,
            createdBy: req.user.userId
        });

        const populatedCMS = await CMS.findById(cms._id)
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email');

        res.status(201).json({
            success: true,
            message: status === 'approved'
                ? 'CMS content created successfully'
                : 'Content submitted for approval',
            data: populatedCMS
        });
    } catch (error) {
        console.error('Create CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating CMS content',
            error: error.message
        });
    }
};

// @desc    Update CMS content
// @route   PUT /api/cms/:id
// @access  Private/Admin
const updateCMS = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content } = req.body;

        const cms = await CMS.findByIdAndUpdate(
            id,
            { title, description, content, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: 'CMS content not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CMS content updated successfully',
            data: cms
        });
    } catch (error) {
        console.error('Update CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating CMS content',
            error: error.message
        });
    }
};

// @desc    Delete CMS content
// @route   DELETE /api/cms/:id
// @access  Private/Admin
const deleteCMS = async (req, res) => {
    try {
        const { id } = req.params;

        const cms = await CMS.findByIdAndDelete(id);

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: 'CMS content not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CMS content deleted successfully'
        });
    } catch (error) {
        console.error('Delete CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting CMS content',
            error: error.message
        });
    }
};

// @desc    Get pending CMS content
// @route   GET /api/cms/pending
// @access  Private/Admin
const getPendingCMS = async (req, res) => {
    try {
        const pendingContent = await CMS.find({ status: 'pending' })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pendingContent.length,
            data: pendingContent
        });
    } catch (error) {
        console.error('Get pending CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching pending content',
            error: error.message
        });
    }
};

// @desc    Get pending CMS count only
// @route   GET /api/cms/pending/count
// @access  Private/Admin
const getPendingCount = async (req, res) => {
    try {
        const count = await CMS.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error('Get pending count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching pending count',
            error: error.message
        });
    }
};

// @desc    Get user's own submissions
// @route   GET /api/cms/my-submissions
// @access  Private
const getUserSubmissions = async (req, res) => {
    try {
        const userContent = await CMS.find({ createdBy: req.user.userId })
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: userContent.length,
            data: userContent
        });
    } catch (error) {
        console.error('Get user submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user submissions',
            error: error.message
        });
    }
};

// @desc    Approve CMS content
// @route   PUT /api/cms/:id/approve
// @access  Private/Admin
const approveCMS = async (req, res) => {
    try {
        const { id } = req.params;

        const cms = await CMS.findById(id);

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: 'CMS content not found'
            });
        }

        if (cms.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Content is already approved'
            });
        }

        cms.status = 'approved';
        cms.approvedBy = req.user.userId;
        cms.approvedAt = Date.now();
        cms.rejectionReason = undefined; // Clear any previous rejection reason
        await cms.save();

        const populatedCMS = await CMS.findById(cms._id)
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Content approved successfully',
            data: populatedCMS
        });
    } catch (error) {
        console.error('Approve CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error approving content',
            error: error.message
        });
    }
};

// @desc    Reject CMS content
// @route   PUT /api/cms/:id/reject
// @access  Private/Admin
const rejectCMS = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rejection reason'
            });
        }

        const cms = await CMS.findById(id);

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: 'CMS content not found'
            });
        }

        cms.status = 'rejected';
        cms.rejectionReason = reason;
        cms.approvedBy = undefined;
        cms.approvedAt = undefined;
        await cms.save();

        const populatedCMS = await CMS.findById(cms._id)
            .populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Content rejected',
            data: populatedCMS
        });
    } catch (error) {
        console.error('Reject CMS error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error rejecting content',
            error: error.message
        });
    }
};

module.exports = {
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
};
