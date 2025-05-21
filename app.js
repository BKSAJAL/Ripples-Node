import express from "express";
import productRoutes from "./Routes/products.routes.js";
import cartRoutes from "./Routes/cart.routes.js";
import userRoutes from "./Routes/user.routes.js";
import compression from "compression";
import helmet from "helmet";

const app = express();

// parse json request body
app.use(express.json());

// gzip compression
app.use(compression());

// set security HTTP headers
app.use(helmet());

//products routes
app.use("/v1/products", productRoutes);

//cart routes
app.use("/v1/cart", cartRoutes);

//user routes
app.use("/v1/user", userRoutes);

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
