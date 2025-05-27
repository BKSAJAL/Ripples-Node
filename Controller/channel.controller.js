import channelModel from "../Model/channel.model.js";
import userModel from "../Model/user.model.js";

//Get Channel
export const getChannel = async (req, res) => {
  try {
    const { username } = req.user;
    const channel = await channelModel.findOne({ owner: username });
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Create Channel
export const createChannel = async (req, res) => {
  try {
    const { username } = req.user;
    const { channelName, description } = req.body;
    const channelObj = {
      owner: username,
      subscribers: 117000,
      channelName,
      description,
      channelBanner:
        "https://cdn.create.microsoft.com/cmsassets/youtubeBanner-Hero.webp",
    };

    const channelExist = await channelModel.findOne({ channelName });
    if (channelExist)
      return res.status(409).json({ error: "Channel already exist" });

    const user = await userModel.findOne({ username });
    user.channels.push(channelName);
    await user.save();

    const newChannel = new channelModel(channelObj);
    await newChannel.save();
    res.status(201).json({ message: "Channel added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
