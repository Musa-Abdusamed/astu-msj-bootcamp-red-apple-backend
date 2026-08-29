const Batch = require('../models/Batch');
const User = require('../models/User');

exports.createBatch = async (req, res) => {
    try {
        const { name, track, description, startDate, endDate, isActive } = req.body;
        
        // Safely grab the user ID whether it's stored as .id or ._id
        const creatorId = req.user?.id || req.user?._id || "64f1a2b3c4d5e6f7a8b9c0d1"; 

        const newBatch = await Batch.create({ 
            name, 
            track,
            description,
            startDate, 
            endDate, 
            isActive,
            createdBy: creatorId
        });
        return res.status(201).json({ success: true, message: "Batch created", data: newBatch });
    } catch (err) {
        console.error(err);
        
        // This will send the exact Mongoose error (e.g., "Creator is required") to your React alert
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getAllBatches = async (req, res) => {
    try {
        let query = {};
        if (req.user && req.user.role === 'mentor') {
            query.mentors = req.user.id || req.user._id;
        }
        const batches = await Batch.find(query);
        return res.status(200).json({ success: true, count: batches.length, data: batches });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate('mentors', 'fullName email role');
            
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
        
        const students = await User.find({ batchId: req.params.id, role: 'student' }).select('-password');

        return res.status(200).json({ 
            success: true, 
            data: { 
                ...batch.toObject(), 
                students 
            } 
        });
    } catch (err) {
        console.error("Error in getBatchById:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.assignMentor = async (req, res) => {
    try {
        const { mentorId } = req.body;
        const batch = await Batch.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { mentors: mentorId } },
            { new: true }
        ).populate('mentors', 'fullName email role');

        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
        
        if (mentorId) {
            await User.findByIdAndUpdate(mentorId, { batchId: req.params.id });
        }

        return res.status(200).json({ success: true, message: "Mentor assigned", data: batch });
    } catch (err) {
        console.error("Error in assignMentor:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.enrollStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        
        const student = await User.findByIdAndUpdate(
            studentId,
            { batchId: req.params.id },
            { returnDocument: 'after' }
        ).select('-password');

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Student successfully enrolled", 
            data: student 
        });
    } catch (err) {
        console.error("Error in enrollStudent:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};