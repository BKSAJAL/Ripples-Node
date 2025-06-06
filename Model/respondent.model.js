import mongoose from "mongoose";

const respondentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: undefined, // optional field, omit if not set
    },
    name: {
      type: String,
      trim: true,
      default: undefined, // optional field, omit if not set
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // allows any JSON object
      default: undefined, // optional, won't appear unless set
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Virtual `id` like before
respondentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

respondentSchema.set("toJSON", {
  virtuals: true,
});

const Respondent = mongoose.model("Respondent", respondentSchema);

export default Respondent;
