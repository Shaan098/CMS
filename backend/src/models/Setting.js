const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'My CMS' },
    homepageTitle: { type: String, default: 'Welcome' },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
