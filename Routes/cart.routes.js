import express from "express";
import {
  addProductToCart,
  updateQuantityOfProduct,
  removeProductFromCart,
} from "../Controller/cart.controller.js";
import authenticateToken from "../Middleware/Auth.js";
const router = express.Router();

//Add to cart
router.post("/addToCart", authenticateToken, addProductToCart);

//Update quantity of product by ID
router.put("/updateQuantity/:id", authenticateToken, updateQuantityOfProduct);

//Delete product by ID
router.delete("/delete/:id", authenticateToken, removeProductFromCart);

export default router;
