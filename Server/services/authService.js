import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const TOKEN_COOKIE = "lt_token";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const safeRedirect = (redirect) => {
  if (!redirect || typeof redirect !== "string") {
    return "/";
  }

  return redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
};

export const buildGoogleAuthUrl = (redirect) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback";

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const state = Buffer.from(JSON.stringify({
    redirect: safeRedirect(redirect),
  })).toString("base64url");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const readRedirectFromState = (state) => {
  try {
    const payload = JSON.parse(Buffer.from(state || "", "base64url").toString("utf8"));
    return safeRedirect(payload.redirect);
  } catch {
    return "/";
  }
};

export const exchangeGoogleCode = async (code) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Google token exchange failed");
  }

  const tokens = await tokenResponse.json();

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error("Unable to fetch Google profile");
  }

  const profile = await profileResponse.json();

  const [result] = await pool.query(
    `INSERT INTO users (google_id, name, email, profile_image)
     VALUES (?, ?, ?, ?)
     AS new
     ON DUPLICATE KEY UPDATE
       name = new.name,
       email = new.email,
       profile_image = new.profile_image`,
    [profile.sub, profile.name, profile.email, profile.picture]
  );

  console.log("Upsert result:", { affectedRows: result.affectedRows });

  const [rows] = await pool.query(
    "SELECT id, google_id, name, email, profile_image FROM users WHERE google_id = ?",
    [profile.sub]
  );

  if (rows.length === 0) {
    throw new Error("Failed to create or find user after Google login");
  }

  const dbUser = rows[0];

  const user = {
    id: dbUser.id,
    google_id: dbUser.google_id,
    name: dbUser.name,
    email: dbUser.email,
    picture: dbUser.profile_image,
    provider: "google",
  };

  console.log("Authenticated user:", user);

  return user;
};

export const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const verifyToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return null;
  }
};

export const getTokenFromRequest = (req) => {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return getCookieValue(req, TOKEN_COOKIE);
};

export const getUserFromToken = async (token) => {
  const payload = verifyToken(token);

  if (!payload?.id) {
    return null;
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, google_id, name, email, profile_image FROM users WHERE id = ?",
      [payload.id]
    );

    if (rows.length === 0) {
      console.log(`No user found in DB for id=${payload.id}`);
      return null;
    }

    const dbUser = rows[0];

    return {
      id: dbUser.id,
      google_id: dbUser.google_id,
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.profile_image,
      provider: "google",
    };
  } catch (error) {
    console.error("getUserFromToken error:", error.message);
    return null;
  }
};

export const getCookieValue = (req, name) => {
  const cookies = req.headers.cookie?.split(";") || [];
  const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const SESSION_COOKIE_NAME = TOKEN_COOKIE;
