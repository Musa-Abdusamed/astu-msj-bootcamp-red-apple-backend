const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, instructions, batchId, deadline, maxScore } = req.body;
    const newAssignment = await Assignment.create({
      title,
      description,
      instructions,
      batchId,
      deadline,
      maxScore,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: newAssignment,
    });
  } catch (err) {
    console.error("Error in createAssignment:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getBatchAssignments = async (req, res, next) => {
  try {
    const assignment = await Assignment.find({ batchId: req.params.batchId })
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignment.length,
      data: assignment,
    });
  } catch (err) {
    console.error("Error in getBatchAssignments:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .populate("batchId", "name startDate endDate")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (err) {
    console.error("Error in getAllAssignments:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};