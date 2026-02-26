const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Server error' });
};

module.exports = errorHandler;
