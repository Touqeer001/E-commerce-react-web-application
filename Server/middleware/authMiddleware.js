import {
  getCookieValue,
  getSessionUser,
  SESSION_COOKIE_NAME,
} from "../services/authService.js";

export const optionalAuth = (req, res, next) => {
  const sessionId = getCookieValue(req, SESSION_COOKIE_NAME);
  const user = getSessionUser(sessionId);

  req.sessionId = sessionId;
  req.user = user;

  next();
};

export const requireAuth = (req, res, next) => {
  optionalAuth(req, res, () => {
      console.log("Cookies:", req.headers.cookie);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    next();
  });
};
