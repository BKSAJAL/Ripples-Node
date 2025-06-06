import mongoose from "mongoose";

// Subdocument schema for individual survey questions
const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["short-text", "single-choice", "rating", "nps"],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
); // prevent automatic _id for subdocuments

const surveySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "active", "completed"],
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    published_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

surveySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

surveySchema.set("toJSON", {
  virtuals: true,
});

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;
