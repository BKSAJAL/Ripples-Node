import User from "../Model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

//validate password
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

//Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        errors: {
          email: ["Email format is not valid"],
        },
      });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Weak password",
        errors: {
          password: [
            "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
          ],
        },
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        errors: {
          email: ["This email is already registered"],
        },
      });

    // Hash password
    const hashedPassword = bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate JWT token
    const payload = {
      user_id: newUser._id,
      email: newUser.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          created_at: newUser.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

//Authenticate User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const payload = {
      user_id: newUser._id,
      email: newUser.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

//Get current user info
export const getCurrentUser = (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
