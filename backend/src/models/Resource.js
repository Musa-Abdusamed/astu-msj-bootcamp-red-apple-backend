const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Resource title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        required: [true, 'Resource URL is required']
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);