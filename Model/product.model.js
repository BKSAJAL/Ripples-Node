import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [1, "Quantity cannot be zero or less"],
    },
  },
  { versionKey: false }
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
