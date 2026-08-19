const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String, required: true,unique: true,lowercase: true,trim: true, },
    phone: { type: String, required: true },
    telegramHandle: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    department: { type: String, required: true },
    year: { type: String, required: true },
    university: { type: String, required: true },
    githubUrl: { type: String, required: true },
    codeforcesUrl: { type: String, required: true },
    leetcodeUrl: { type: String, required: true },
    motivation: { type: String, required: true },
    roleAtApplication: {type: String,required: true,enum: ["student", "mentor"],},
    status: {type: String,enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
