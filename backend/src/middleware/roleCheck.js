const roleRank = {
  viewer: 1,
  editor: 2,
  approver: 3,
  admin: 4
};

const roleCheck = (minRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (roleRank[req.user.role] < roleRank[minRole]) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};

module.exports = roleCheck;
