const Content = require('../models/Content');

const listContent = async (req, res, next) => {
  try {
    const items = await Content.find()
      .populate('createdBy', 'name email role')
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const createContent = async (req, res, next) => {
  try {
    const { title, body = '', type = 'post' } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }
    const item = await Content.create({
      title,
      body,
      type,
      status: 'draft',
      createdBy: req.user._id
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Content.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    const isAuthor = String(item.createdBy) === String(req.user._id);
    const canEditAny = ['admin', 'approver'].includes(req.user.role);
    if (!isAuthor && !canEditAny) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    item.title = req.body.title ?? item.title;
    item.body = req.body.body ?? item.body;
    item.type = req.body.type ?? item.type;
    if (item.status !== 'approved') {
      item.status = 'draft';
      item.approvedBy = null;
    }

    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const submitForApproval = async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    const isAuthor = String(item.createdBy) === String(req.user._id);
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    item.status = 'pending';
    item.approvedBy = null;
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const approveContent = async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    item.status = req.body.approve === false ? 'rejected' : 'approved';
    item.approvedBy = req.user._id;
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const removeContent = async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    const isAuthor = String(item.createdBy) === String(req.user._id);
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await item.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContent,
  createContent,
  updateContent,
  submitForApproval,
  approveContent,
  removeContent
};
