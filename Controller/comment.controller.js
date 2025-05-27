import videoModel from "../Model/video.model.js";

//Add comment
export const addComment = async (req, res) => {
  try {
    const { id: videoId } = req.params;

    const videoItem = await videoModel.findById(videoId);
    if (!videoItem) return res.status(404).json({ error: "Video not found" });

    const commentExist = videoItem.comments.find(
      (ele) => ele.commentId == req.body["commentId"]
    );
    if (commentExist)
      return res
        .status(409)
        .json({ error: "Comment with this ID already exists" });

    videoItem.comments.unshift(req.body);
    await videoItem.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Update comment
export const updateComment = async (req, res) => {
  try {
    const { id: videoId } = req.params;
    const { commentId, text } = req.body;

    // Validate input
    if (!commentId)
      return res.status(400).json({ error: "Comment ID is required" });

    const videoItem = await videoModel.findById(videoId);
    if (!videoItem) return res.status(404).json({ error: "Video not found" });
    const commentIdx = videoItem.comments.findIndex(
      (ele) => ele.commentId == commentId
    );

    if (commentIdx == -1)
      return res.status(404).json({ error: "Comment not found" });

    videoItem.comments[commentIdx].text = text;
    await videoItem.save();
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Remove comment
export const removeComment = async (req, res) => {
  try {
    const { id: videoId } = req.params;
    const { commentId } = req.body;

    // Validate input
    if (!commentId)
      return res.status(400).json({ error: "Comment ID is required" });

    const videoItem = await videoModel.findById(videoId);
    if (!videoItem) return res.status(404).json({ error: "Video not found" });

    const originalLength = videoItem.comments.length;

    videoItem.comments = videoItem.comments.filter(
      (comment) => comment?.commentId !== commentId
    );

    if (videoItem.comments.length === originalLength)
      return res.status(404).json({ error: "Comment not found" });

    await videoItem.save();
    res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
