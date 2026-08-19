const Schedule = require("../models/Schedule");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");


exports.createSchedule = asyncHandler(async (req, res, next) => {
    const { weekNumber, title, topics } = req.body;

    if (!weekNumber || !title) {
        return next(new AppError("Week number and title are required.", 400));
    }

    const schedule = await Schedule.create({
        weekNumber,
        title,
        topics: topics || [],
        createdBy: req.user._id
    });

    res.status(201).json({
        status: "success",
        message: "Schedule week created successfully.",
        data: { schedule }
    });
});


exports.getSchedules = asyncHandler(async (req, res, next) => {
    const schedules = await Schedule.find().sort({ weekNumber: 1 }).populate("createdBy", "fullName email");

    res.status(200).json({
        status: "success",
        results: schedules.length,
        data: { schedules }
    });
});


exports.updateSchedule = asyncHandler(async (req, res, next) => {
    const schedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!schedule) {
        return next(new AppError("Schedule week not found.", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Schedule updated successfully.",
        data: { schedule }
    });
});


exports.deleteSchedule = asyncHandler(async (req, res, next) => {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
        return next(new AppError("Schedule not found.", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Schedule deleted successfully."
    });
});