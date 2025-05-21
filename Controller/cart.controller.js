import cartModel from "../Model/cart.model.js";
import productModel from "../Model/product.model.js";

//Add product to cart
export const addProductToCart = async (req, res) => {
  try {
    const productExists = await productModel.exists({ _id: req.body._id });
    if (!productExists)
      return res.status(400).json({ error: "Invalid productId" });

    const newCartItem = new cartModel(req.body);
    const cartItem = await newCartItem.save();
    res
      .status(201)
      .json({ message: "Product added to cart successfully", cartItem });
  } catch (err) {
    if (
      err.name === "ValidationError" ||
      err.name === "MongoServerError" ||
      err.name === "CastError"
    )
      return res.status(400).json({ errors: err.message });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Update quantity of product in the cart
export const updateQuantityOfProduct = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await cartModel.findById(req.params.id);
    if (!cartItem)
      return res.status(404).json({ error: "Product not found in cart" });

    const newQuantity = cartItem.quantity + quantity;

    if (newQuantity <= 0)
      return res
        .status(400)
        .json({ error: "Quantity cannot go be zero or negative" });

    cartItem.quantity = newQuantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart updated successfully", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Remove product from the cart
export const removeProductFromCart = async (req, res) => {
  try {
    const cartitem = await cartModel.findOneAndDelete(req.params.id);
    if (!cartitem)
      return res.status(404).json({ error: "Product not found in cart" });
    res
      .status(200)
      .json({ message: "Product deleted from cart successfully", cartitem });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
