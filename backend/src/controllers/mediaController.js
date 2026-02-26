const Media = require('../models/Media');

const listMedia = async (req, res, next) => {
  try {
    const items = await Media.find().populate('uploadedBy', 'name email role').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const item = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = { listMedia, uploadMedia };
