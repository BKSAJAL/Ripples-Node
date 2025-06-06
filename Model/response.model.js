import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  survey_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  respondent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Respondent",
    required: true,
  },
  answers: {
    type: mongoose.Schema.Types.Mixed, // Allows JSON object
    required: true,
  },
  completed_at: {
    type: Date,
    default: null,
  },
  ip_address: {
    type: String,
    default: undefined,
  },
  user_agent: {
    type: String,
    default: undefined,
  },
});

// Add virtual id if needed
responseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

responseSchema.set("toJSON", {
  virtuals: true,
});

const Response = mongoose.model("Response", responseSchema);

export default Response;
