import videoModel from "../Model/video.model.js";
import videoList from "../videoData.js";

//Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await videoModel.find({});
    if (!videos[0]) videos = await videoModel.insertMany(videoList);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
