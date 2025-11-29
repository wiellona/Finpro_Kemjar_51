// Ensures the authenticated user carries the expected role
module.exports = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res
      .status(403)
      .json({ message: "Forbidden. Insufficient privileges." });
  }

  return next();
};
