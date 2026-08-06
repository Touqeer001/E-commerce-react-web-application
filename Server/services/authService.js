import crypto from "crypto";

const sessions = new Map();
const users = new Map();

const SESSION_COOKIE = "lt_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

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

  const user = {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    picture: profile.picture,
    provider: "google",
  };

  users.set(user.id, user);
  return user;
};

export const createSession = (user) => {
  const sessionId = crypto.randomUUID();

  sessions.set(sessionId, {
    userId: user.id,
    createdAt: Date.now(),
  });

  console.log("Sessions after login:", sessions.size);

  return sessionId;
};

export const getSessionUser = (sessionId) => {
  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);
  console.log("Session:", session);

  if (!session) {
    return null;
  }

  console.log("User ID:", session.userId);
  console.log("Users Map Size:", users.size);
  console.log("User from Map:", users.get(session.userId));

  return users.get(session.userId) || null;
};

export const deleteSession = (sessionId) => {
  if (sessionId) {
    sessions.delete(sessionId);
  }
};

export const getCookieValue = (req, name) => {
  const cookies = req.headers.cookie?.split(";") || [];
  const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const isProduction = process.env.NODE_ENV === "production";

export const setSessionCookie = (res, sessionId) => {
  res.cookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
  });
};
export const clearSessionCookie = (res) => {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
