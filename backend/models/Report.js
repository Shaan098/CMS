const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['User Activity', 'CMS Statistics', 'System Usage', 'Security Audit']
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    generated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
