import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;

mongoose.connect(MONGODB_URL);

const db = mongoose.connection;

db.on("open", () => {
  console.log("Database connection is successful");
});

db.on("error", () => {
  console.log("Database connection is not successful");
});

//Server started on port 3000
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
