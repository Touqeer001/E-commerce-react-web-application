import {
  getTokenFromRequest,
  getUserFromToken,
} from "../services/authService.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    console.log("Auth middleware - token:", token ? "present" : "missing");

    req.token = token;
    req.user = token ? await getUserFromToken(token) : null;

    console.log("Auth middleware - user:", req.user ? req.user.id : "null");
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    req.token = undefined;
    req.user = null;
  }

  next();
};

export const requireAuth = (req, res, next) => {
  optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    next();
  });
};
