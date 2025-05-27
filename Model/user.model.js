import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username should be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email should be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // avatar: String,
    channels: [String],
  },
  { versionKey: false }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
