const requireRole = (...roles) => {
  return (req, res, next) => {
    // superadmin always has access
    if (req.userData.role === "superadmin") {
      return next();
    }
    if (!roles.includes(req.userData.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = requireRole;
