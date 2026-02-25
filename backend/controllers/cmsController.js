const CMS = require('../models/CMS');

// @desc    Get all CMS content
// @route   GET /api/cms
// @access  Public/Protected (based on role)
const getAllCMS = async (req, res) => {
    try {
        const cmsContent = await CMS.find()
            .populate('createdBy', 'name email')
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
// @access  Private/Admin
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

        const cms = await CMS.create({
            title,
            description,
            content,
            createdBy: req.user.userId
        });

        const populatedCMS = await CMS.findById(cms._id).populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'CMS content created successfully',
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

module.exports = {
    getAllCMS,
    getCMSById,
    createCMS,
    updateCMS,
    deleteCMS
};
