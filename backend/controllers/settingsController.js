const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.find().sort({ key: 1 });

        res.status(200).json({
            success: true,
            count: settings.length,
            settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching settings',
            error: error.message
        });
    }
};

// @desc    Update or create setting
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { key, value, description } = req.body;

        // Validation
        if (!key || value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide key and value'
            });
        }

        // Update or create setting
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value, description: description || '', updatedAt: Date.now() },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Setting updated successfully',
            setting
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating settings',
            error: error.message
        });
    }
};

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private/Admin
const deleteSetting = async (req, res) => {
    try {
        const { key } = req.params;

        const setting = await Settings.findOneAndDelete({ key });

        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Setting deleted successfully'
        });
    } catch (error) {
        console.error('Delete setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting setting',
            error: error.message
        });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    deleteSetting
};
