import express from "express";
import videoRoutes from "./Routes/video.routes.js";
import commentRoutes from "./Routes/comment.routes.js";
import userRoutes from "./Routes/user.routes.js";
import channelRoutes from "./Routes/channel.routes.js";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

const app = express();

// parse json request body
app.use(express.json());

// gzip compression
app.use(compression());

//Allow cors policy
app.use(cors());

// set security HTTP headers
app.use(helmet());

//products routes
app.use("/api/v1/videos", videoRoutes);

//cart routes
app.use("/api/v1/comment", commentRoutes);

//user routes
app.use("/api/v1/user", userRoutes);

//channel routes
app.use("/api/v1/channel", channelRoutes);

//handle invalid route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

//handle internal server error
app.use((err, req, res, next) => {
  console.log("Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
