const express = require("express");
const router = express.Router();

const User = require("../models/User");
const PostJob = require("../models/PostJob");
const FreelancerProfile = require("../models/FreelancerProfile");
const Message = require("../models/Message");
const Proposal = require("../models/Proposal");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================================================
// REGISTER
// =========================================================

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;

    // Validate fields
    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Response
    res.status(201).json({
      success: true,
      message: "Registration Successfully",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
});

// =========================================================
// LOGIN
// =========================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const fetchUser = await User.findOne({ email });

    if (!fetchUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Check password
    const matchPassword = await bcrypt.compare(password, fetchUser.password);

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: fetchUser._id,
        role: fetchUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Login success
    res.status(200).json({
      success: true,
      message: "Login Successfully",

      token,

      user: {
        id: fetchUser._id,
        fullName: fetchUser.fullName,
        email: fetchUser.email,
        role: fetchUser.role,
      },

      role: fetchUser.role,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
});

// =========================================================
// POST JOB
// =========================================================

router.post("/postjob", async (req, res) => {
  try {
    const {
      clientId,
      clientName,
      title,
      companyName,
      description,
      skills,
      budgetMin,
      budgetMax,
      deadline,
      category,
    } = req.body;

    // Create job
    const newJob = new PostJob({
      clientId,
      clientName,
      title,
      companyName,
      description,
      skills,
      budgetMin,
      budgetMax,
      deadline,
      category,
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Post Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to post job",
    });
  }
});

// =========================================================
// GET ALL POSTED JOBS
// =========================================================

router.get("/postjobs", async (req, res) => {
  try {
    const jobs = await PostJob.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// =========================================================
// CREATE / UPDATE FREELANCER PROFILE
// =========================================================

router.post("/freelancerprofile", async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      image,
      phone,
      location,
      website,
      title,
      bio,
      experience,
      projects,
      hourlyRate,
      skills,
    } = req.body;

    // Check user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check role
    if (user.role !== "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can create a freelancer profile",
      });
    }

    // Create or update profile
    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId },

      {
        $set: {
          userId,

          name: name?.trim() || user.fullName,

          email: email?.trim() || user.email,

          image: image || "",

          phone: phone?.trim() || "",

          location: location?.trim() || "",

          website: website?.trim() || "",

          title: title?.trim() || "",

          bio: bio?.trim() || "",

          experience: experience?.trim() || "",

          projects:
            projects !== undefined && projects !== "" ? Number(projects) : 0,

          hourlyRate:
            hourlyRate !== undefined && hourlyRate !== ""
              ? Number(hourlyRate)
              : 0,

          skills: Array.isArray(skills) ? skills : [],
        },
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Freelancer profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Freelancer Profile Save Error:", error);

    // Duplicate userId
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Freelancer profile already exists for this user",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save freelancer profile",
      error: error.message,
    });
  }
});

// =========================================================
// GET FREELANCER PROFILE
// =========================================================

router.get("/freelancerprofile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find profile
    const profile = await FreelancerProfile.findOne({ userId });

    // Profile doesn't exist
    if (!profile) {
      return res.status(200).json({
        success: true,
        profile: null,
        message: "Freelancer profile not created yet",
      });
    }

    // Profile found
    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Freelancer Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer profile",
      error: error.message,
    });
  }
});

// =========================================================
// RATE FREELANCER
// =========================================================

router.post("/freelancerprofile/:userId/rate", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Update rating
    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId },

      {
        $set: {
          rating: Number(rating),
        },
      },

      {
        new: true,
      },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      rating: profile.rating,
    });
  } catch (error) {
    console.error("Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// =========================================================
// GET ALL FREELANCER PROFILES
// =========================================================

router.get("/freelancerprofiles", async (req, res) => {
  try {
    const profiles = await FreelancerProfile.find();

    res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error("Get Freelancer Profiles Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancers",
    });
  }
});

// =========================================================
// GET MESSAGES BETWEEN TWO USERS
// =========================================================

router.get("/messages/:userA/:userB", async (req, res) => {
  try {
    const { userA, userB } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: userA,
          receiverId: userB,
        },
        {
          senderId: userB,
          receiverId: userA,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// =========================================================
// GET CONVERSATION PARTNERS
// =========================================================

router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    // Store latest message for each partner
    const partnerMap = new Map();

    messages.forEach((msg) => {
      const partnerId =
        String(msg.senderId) === String(userId)
          ? String(msg.receiverId)
          : String(msg.senderId);

      // Only store latest message
      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, msg);
      }
    });

    // Get partner IDs
    const partnerIds = [...partnerMap.keys()];

    // Get users
    const partners = await User.find({
      _id: {
        $in: partnerIds,
      },
    });

    // Build conversations
    const conversations = partners.map((partner) => {
      const lastMsg = partnerMap.get(String(partner._id));

      return {
        userId: partner._id,
        name: partner.fullName,
        lastMessage: lastMsg?.text || "",
        time: lastMsg?.createdAt || null,
      };
    });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
});

// =========================================================
// GET SINGLE PROJECT
// =========================================================
router.get("/postjobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await PostJob.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const {
      projectId,
      freelancerId,
      clientId,
      bidAmount,
      deliveryTime,
      coverLetter,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !projectId ||
      !freelancerId ||
      !clientId ||
      !bidAmount ||
      !deliveryTime ||
      !coverLetter
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // -----------------------------
    // Check project
    // -----------------------------

    const project = await PostJob.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // -----------------------------
    // Check duplicate proposal
    // -----------------------------

    const existingProposal = await Proposal.findOne({
      projectId,
      freelancerId,
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a proposal for this project",
      });
    }

    // -----------------------------
    // Create proposal
    // -----------------------------

    const proposal = await Proposal.create({
      projectId,
      freelancerId,
      clientId,
      bidAmount,
      deliveryTime,
      coverLetter,
    });

    // -----------------------------
    // Increase proposal count
    // -----------------------------

    project.proposals = (project.proposals || 0) + 1;

    await project.save();

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Submit Proposal Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// =====================================================
// GET PROPOSALS FOR A PROJECT
// =====================================================

router.get("/project/:projectId", async (req, res) => {
  try {
    const proposals = await Proposal.find({
      projectId: req.params.projectId,
    })
      .populate("freelancerId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      proposals,
    });
  } catch (error) {
    console.error("Get Project Proposals Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// GET PROPOSALS BY FREELANCER
// =====================================================

router.get("/freelancer/:freelancerId", async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancerId: req.params.freelancerId,
    })
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      proposals,
    });
  } catch (error) {
    console.error("Get Freelancer Proposals Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// GET SINGLE PROPOSAL
// =====================================================

router.get("/proposals/:project._id", async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId)
      .populate("projectId")
      .populate("freelancerId")
      .populate("clientId");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.status(200).json({
      success: true,
      proposal,
    });
  } catch (error) {
    console.error("Get Proposal Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;
