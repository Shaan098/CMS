const Report = require('../models/Report');
const User = require('../models/User');
const CMS = require('../models/CMS');

// @desc    Get system reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        // Generate fresh statistics
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'Admin' });
        const totalNormalUsers = await User.countDocuments({ role: 'User' });
        const totalCMS = await CMS.countDocuments();

        // Get recent CMS activity
        const recentCMS = await CMS.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'name email');

        // Create report data
        const reportData = {
            systemStats: {
                totalUsers,
                totalAdmins,
                totalNormalUsers,
                totalCMS
            },
            recentActivity: recentCMS,
            generatedAt: new Date()
        };

        // Save report to database
        const report = await Report.create({
            type: 'System Usage',
            data: reportData
        });

        res.status(200).json({
            success: true,
            data: reportData,
            reportId: report._id
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error generating reports',
            error: error.message
        });
    }
};

// @desc    Get all saved reports
// @route   GET /api/reports/history
// @access  Private/Admin
const getReportHistory = async (req, res) => {
    try {
        const reports = await Report.find().sort({ generated: -1 }).limit(20);

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        console.error('Get report history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching report history',
            error: error.message
        });
    }
};

module.exports = {
    getReports,
    getReportHistory
};
