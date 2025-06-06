import rateLimit from "express-rate-limit";

// Limit: 10 requests per minute per IP for survey submissions
export const surveyResponseLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message:
      "Too many submissions from this IP, please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit: 5 requests per minute per IP for auth routes
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many login or signup attempts, please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
