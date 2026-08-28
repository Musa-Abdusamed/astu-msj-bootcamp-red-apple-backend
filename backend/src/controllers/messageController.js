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
    // Find all messages involving the user (sent or received)
    const messages = await Message.find({
        $or: [{ sender: req.user.id }, { recipient: req.user.id }]
    })
        .populate('sender', 'fullName email role avatar')
        .populate('recipient', 'fullName email role avatar')
        .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();

    for (const msg of messages) {
        const isSender = msg.sender._id.toString() === req.user.id.toString();
        const otherUser = isSender ? msg.recipient : msg.sender;
        const otherUserIdStr = otherUser._id.toString();

        if (!conversationsMap.has(otherUserIdStr)) {
            conversationsMap.set(otherUserIdStr, {
                otherUser,
                latestMessage: msg,
                unreadCount: (!isSender && !msg.read) ? 1 : 0
            });
        } else {
            // Since we sorted by createdAt: -1, the first one we saw was the latest.
            // We just need to tally unread count for messages sent TO the user.
            if (!isSender && !msg.read) {
                conversationsMap.get(otherUserIdStr).unreadCount += 1;
            }
        }
    }

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
        success: true,
        count: conversations.length,
        conversations
    });
});


const markAsRead = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return next(new AppError('Message not found', 404));
    }

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