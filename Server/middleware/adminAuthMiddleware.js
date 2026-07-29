import jwt from "jsonwebtoken";

export const requireAdminAuth = (req, res, next) => {
  const value = req.headers.authorization;
  const token = value?.startsWith("Bearer ") ? value.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Admin authentication required" });
  try { req.admin = jwt.verify(token, process.env.ADMIN_JWT_SECRET); next(); }
  catch { res.status(401).json({ success: false, message: "Invalid or expired admin token" }); }
};
export const authorizeRoles = (...roles) => (req, res, next) => roles.includes(req.admin.role)
  ? next() : res.status(403).json({ success: false, message: "Insufficient permission" });
