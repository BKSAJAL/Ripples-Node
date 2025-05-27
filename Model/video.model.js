import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentId: String,
  userId: String, //username
  text: String,
  timestamp: String,
});

const videoSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    thumbnailUrl: String,
    description: String,
    videoIframe: String,
    channelId: String, //channel name
    uploader: String,
    views: Number,
    likes: Number,
    dislikes: Number,
    uploadDate: String,
    category: String,
    comments: [commentSchema],
  },
  { versionKey: false }
);

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;
