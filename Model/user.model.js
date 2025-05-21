import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username should be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { versionKey: false }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
