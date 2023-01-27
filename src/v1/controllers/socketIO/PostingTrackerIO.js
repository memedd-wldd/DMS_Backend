const PostingTracker = require("../../models/postingTracker.model");
const auditLogCampaign = require("../../models/audit-log-campaign");
const mongoose = require("mongoose");

exports.PostingTrackerIO = (io) => {
  io.on("connection", async (socket) => {
    console.log("Socket connected");

    socket.on("postingTrackerOn", async (data) => {
      const { postingTrackerId } = data;
      socket.join(postingTrackerId);

      io.to(postingTrackerId).emit("postingTracker", data);
      if (data && data.data) {
        updatePostingTrackerById(postingTrackerId, data.data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};

const updatePostingTrackerById = async (id, data) => {
  if (id) {
    const postingTracker = await PostingTracker.findByIdAndUpdate(id, data);
  }
};
