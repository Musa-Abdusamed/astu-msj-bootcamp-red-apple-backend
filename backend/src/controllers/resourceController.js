const Resource = require("../models/Resource");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.createResource = asyncHandler(async (req, res, next) => {
    const { title, description, link, topic } = req.body;

    if (!title || !link) {
        return next(new AppError("Title and link are required for resources.", 400));
    }

    const resource = await Resource.create({
        title,
        description,
        link,
        topic,
        mentor: req.user._id 
    });

    res.status(201).json({
        status: "success",
        message: "Resource shared successfully.",
        data: { resource }
    });
});

exports.getResources = asyncHandler(async (req, res, next) => {
    const resources = await Resource.find().populate("mentor", "fullName email role");

    res.status(200).json({
        status: "success",
        results: resources.length,
        data: { resources }
    });
});

exports.deleteResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(new AppError("Resource not found.", 404));
    }

    if (req.user.role === "mentor" && resource.mentor.toString() !== req.user._id.toString()) {
        return next(new AppError("You do not have permission to delete this resource.", 403));
    }

    await resource.deleteOne();

    res.status(200).json({
        status: "success",
        message: "Resource deleted successfully."
    });
});