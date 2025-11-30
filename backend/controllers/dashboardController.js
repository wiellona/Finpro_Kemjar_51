// Returns a snapshot of the authenticated user context
export const getDashboard = (req, res) => {
  return res.json({
    message: "Protected dashboard payload.",
    user: req.user,
  });
};
