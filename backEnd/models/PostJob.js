const mongoose = require("mongoose");

const postJobSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  clientName: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  companyName: {
    type: String,
  },

  description: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    default: [],
  },

  budgetMin: {
    type: Number,
  },

  budgetMax: {
    type: Number,
  },

  deadline: {
    type: String,
  },

  category: {
    type: String,
  },

  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "cancelled"],
    default: "open",
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "closed"],
    default: "open",
  },
  assignedFreelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  proposals: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PostJob", postJobSchema);
