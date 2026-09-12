const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    // Project that this proposal belongs to
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostJob",
      required: true,
    },

    // Freelancer who submitted the proposal
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Client who owns the project
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Freelancer's bid
    bidAmount: {
      type: Number,
      required: true,
    },

    // Delivery time in days
    deliveryTime: {
      type: Number,
      required: true,
    },

    // Freelancer's message
    coverLetter: {
      type: String,
      required: true,
    },

    // Proposal status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Proposal", proposalSchema);
