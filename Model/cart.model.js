import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "ID is required"],
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity cannot be zero or negative"],
    },
  },
  { versionKey: false },

  { _id: false }
);

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;
