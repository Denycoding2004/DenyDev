const mongoose = require("mongoose");

const postJobSchema = new mongoose.Schema({
  clientId: String,
  clientName: String,
  title: String,
  companyName: String,
  description: String,
  skills: [String],

  budgetMin: Number,
  budgetMax: Number,

  deadline: String,
  category: String,

  status: {
    type: String,
    default: "Open",
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