import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const isExpired = err.name === "TokenExpiredError";

      return res.status(403).json({
        success: false,
        message: isExpired ? "Token expired" : "Invalid token",
      });
    }
    req.user = user;
    next();
  });
}

export default authenticateToken;
