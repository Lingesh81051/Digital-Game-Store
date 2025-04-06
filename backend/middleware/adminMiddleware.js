// backend/middleware/adminMiddleware.js
function adminOnly(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
}

module.exports = { adminOnly };
