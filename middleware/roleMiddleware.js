// backend/middleware/roleMiddleware.js

const authorize = (roles = []) => {
  // Agar sirf ek role diya gaya ho to use array me convert kar do
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    // 🔒 User authenticated hai ya nahi
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Agar roles diye gaye hain aur user ka role allowed list me nahi hai
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} role not authorized for this action`,
      });
    }

    // ✅ Agar sab sahi hai to aage badho
    next();
  };
};

module.exports = { authorize };
