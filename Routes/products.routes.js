import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
} from "../Controller/products.controller.js";
const router = express.Router();

//Get all products
router.get("/", getAllProducts);

//Get product by ID
router.get("/:id", getProductById);

//Add product
router.post("/addProduct", addProduct);

export default router;
