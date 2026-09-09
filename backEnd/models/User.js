const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  fullName: String,
  email: String,
  role: String,
  password: String,
});
module.exports = mongoose.model("User", Schema);
