const mongoose = require("mongoose");

const freelancerProfileSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER ID
    // ==========================================
    // This connects the freelancer profile
    // with the User collection.
    //
    // User._id
    //     ↓
    // FreelancerProfile.userId
    //
    // unique: true means one user can have
    // only ONE freelancer profile.
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    // ==========================================
    // CONTACT INFORMATION
    // ==========================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PROFESSIONAL INFORMATION
    // ==========================================

    title: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PROJECT INFORMATION
    // ==========================================

    projects: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, 
    },

    // ==========================================
    // HOURLY RATE
    // ==========================================

    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // SKILLS
    // ==========================================

    skills: {
      type: [String],
      default: [],
    },
  },

  // ==========================================
  // AUTOMATIC CREATED / UPDATED DATES
  // ==========================================

  {
    timestamps: true,
  },
);

// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = mongoose.model("FreelancerProfile", freelancerProfileSchema);
