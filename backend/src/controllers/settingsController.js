const Setting = require('../models/Setting');

const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    settings.siteName = req.body.siteName ?? settings.siteName;
    settings.homepageTitle = req.body.homepageTitle ?? settings.homepageTitle;
    settings.maintenanceMode = req.body.maintenanceMode ?? settings.maintenanceMode;

    await settings.save();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
