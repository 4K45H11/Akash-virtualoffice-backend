const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Founder", "HR", "Intern", "Team Lead", "PR", "Content"],
    default: "Intern"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  currentProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// hashing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// check password
userSchema.methods.comparePassword = function (enteredPswd) {
  return bcrypt.compare(enteredPswd, this.password);
};

module.exports = mongoose.model("User", userSchema);
