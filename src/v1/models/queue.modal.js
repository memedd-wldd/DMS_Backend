// create a modal with [Posting tracker ID,Campaign Id, Created At,]

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const queueSchema = Schema(
  {
    postingTrackerId: {
      type: Schema.Types.ObjectId,
      ref: "PostingTracker",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;
