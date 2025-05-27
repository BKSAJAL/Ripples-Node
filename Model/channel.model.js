import mongoose from "mongoose";

const channelSchema = mongoose.Schema(
  {
    channelName: String,
    owner: String,
    description: String,
    channelBanner: String,
    subscribers: Number,
    videos: [String],
  },
  { versionKey: false }
);

const channelModel = mongoose.model("Channel", channelSchema);
export default channelModel;
