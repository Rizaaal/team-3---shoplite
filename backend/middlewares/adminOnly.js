const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: admin only',
    });
  }

  next();
};

module.exports = {
  adminOnly,
};
