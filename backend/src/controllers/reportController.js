const Content = require('../models/Content');
const Media = require('../models/Media');
const User = require('../models/User');

const getSummaryReport = async (req, res, next) => {
  try {
    const [users, content, pending, approved, media] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Content.countDocuments({ status: 'pending' }),
      Content.countDocuments({ status: 'approved' }),
      Media.countDocuments()
    ]);

    res.json({ users, content, pending, approved, media });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummaryReport };
