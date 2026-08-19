const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');


const sendMessage = asyncHandler(async (req, res, next) => {
    const { recipient, content } = req.body;

    // Check required fields
    if (!recipient || !content) {
        return next(new AppError('Recipient and content are required', 400));
    }

    // Prevent sending a message to yourself
    if (recipient.toString() === req.user.id.toString()) {
        return next(new AppError('You cannot send a message to yourself', 400));
    }

    const message = await Message.create({
        sender: req.user.id,
        recipient,
        content
    });

    // Get sender and recipient information
    await message.populate([
        { path: 'sender', select: 'fullName email' },
        { path: 'recipient', select: 'fullName email' }
    ]);

    res.status(201).json({
        success: true,
        message
    });
});


const getConversation = asyncHandler(async (req, res, next) => {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
        $or: [
            {
                sender: req.user.id,
                recipient: otherUserId
            },
            {
                sender: otherUserId,
                recipient: req.user.id
            }
        ]
    })
        .populate('sender', 'fullName email')
        .populate('recipient', 'fullName email')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        count: messages.length,
        messages
    });
});


const getInbox = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({
        recipient: req.user.id
    })
        .populate('sender', 'fullName email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: messages.length,
        messages
    });
});


const markAsRead = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return next(new AppError('Message not found', 404));
    }

    // Only the recipient can mark the message as read
    if (message.recipient.toString() !== req.user.id.toString()) {
        return next(
            new AppError('You are not allowed to mark this message as read', 403)
        );
    }

    message.read = true;
    await message.save();

    res.status(200).json({
        success: true,
        message
    });
});


module.exports = {
    sendMessage,
    getConversation,
    getInbox,
    markAsRead
};