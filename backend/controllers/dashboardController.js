// Returns a snapshot of the authenticated user context
exports.getDashboard = (req, res) => {
  return res.json({
    message: "Protected dashboard payload.",
    user: req.user,
  });
};
