import express from "express";
import userRoutes from "./Routes/user.routes.js";
import surveyRoutes from "./Routes/survey.routes.js";
import respondentRoutes from "./Routes/respondent.routes.js";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

const app = express();

// parse json request body
app.use(express.json());

// gzip compression
app.use(compression());

//Allow cors policy
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
);

// set security HTTP headers
app.use(helmet());

//user routes
app.use("/api/v1/auth", userRoutes);

//survey routes
app.use("/api/v1/surveys", surveyRoutes);

//respondent routes
app.use("/api/v1/respondents", respondentRoutes);

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
