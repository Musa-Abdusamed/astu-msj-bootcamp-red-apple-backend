const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    weekNumber: {
        type: Number,
        required: [true, 'Week number is required']
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    topics: [{
        day: { type: String, required: true },
        topicName: { type: String, required: true },
        date: { type: Date }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);