import productModel from "../Model/product.model.js";

//Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Add new product
export const addProduct = async (req, res) => {
  try {
    const newProduct = new productModel(req.body);
    const product = await newProduct.save(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstErrorMessage = Object.values(err.errors)[0].message;
      return res.status(400).json({ errors: firstErrorMessage });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
