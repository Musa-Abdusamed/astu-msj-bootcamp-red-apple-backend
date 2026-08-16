const Batch = require('../models/Batch'); // Assuming your Batch model is here

exports.createBatch = async (req, res) => {
    try {
        const { name, description, startDate, endDate, isActive } = req.body;

        // NOTE FOR TESTING: Your teammate's model REQUIRES a 'createdBy' User ID.
        // If your auth middleware is working, use req.user._id. 
        // If you are testing tonight WITHOUT auth, hardcode a fake Admin ID here just to test:
        const creatorId = req.user ? req.user._id : "64f1a2b3c4d5e6f7a8b9c0d1"; 

        const newBatch = await Batch.create({ 
            name, 
            description,
            startDate, 
            endDate, 
            isActive,
            createdBy: creatorId // Now the model won't crash!
        });
        
        return res.status(201).json({ success: true, message: "Batch created", data: newBatch });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.find();
        return res.status(200).json({ success: true, count: batches.length, data: batches });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getBatchById = async (req, res) => {
    try {
        // .populate() fetches the actual user details instead of just returning ObjectIds
        const batch = await Batch.findById(req.params.id)
            .populate('mentors', 'name email role')
            .populate('students', 'name email role');
            
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
        return res.status(200).json({ success: true, data: batch });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// POST /api/batches/:id/students
exports.enrollStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        
        // $addToSet safely adds the student ID only if it isn't already in the array
        const batch = await Batch.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { students: studentId } },
            { new: true }
        ).populate('students', 'name email');

        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
        return res.status(200).json({ success: true, message: "Student enrolled", data: batch });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// POST /api/batches/:id/mentors
exports.assignMentor = async (req, res) => {
    try {
        const { mentorId } = req.body;
        
        const batch = await Batch.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { mentors: mentorId } },
            { returnDocument: "after" }
        ).populate('mentors', 'name email');

        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
        return res.status(200).json({ success: true, message: "Mentor assigned", data: batch });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};