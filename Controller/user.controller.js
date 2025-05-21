import userModel from "../Model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

//Register new user
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await userModel.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ error: err.message });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Authenticate User
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username, id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ error: err.message });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
