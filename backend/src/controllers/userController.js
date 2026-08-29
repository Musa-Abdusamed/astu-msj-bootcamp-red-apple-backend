const User = require("../models/User");
const generateCustomId = require('../utils/generateCustomId');
const sendEmail = require('../utils/sendEmail');

exports.createUser = async (req, res) => {
    const { fullName, email, password, role, phone, userId, batchId } = req.body; 
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const currentYear = new Date().getFullYear().toString();
        const generatedUserId = await generateCustomId(role || 'student', currentYear);
        const newUser = await User.create({
            userId: generatedUserId,
            fullName, 
            email,
            password,
            role,
            phone,
            batchId: batchId || null,
            mustChangeCredentials: true 
        });

        // Send email with credentials
        try {
            await sendEmail({
                to: newUser.email,
                subject: "ASTU MSJ Bootcamp - Account Created",
                text: `
Dear ${newUser.fullName},

Your account for the ASTU MSJ Bootcamp has been created by an administrator.

--------------------------------
ACCOUNT INFORMATION
--------------------------------

Custom ID: ${newUser.userId}
Email: ${newUser.email}
Temporary Password: ${password}
Role: ${newUser.role}

--------------------------------

Please log in using the information above.

For security reasons, you must change your password after your first login.

Do not share your login credentials with anyone.

Welcome to the ASTU MSJ Bootcamp!

ASTU MSJ Bootcamp Team
`
            });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // We can choose to delete the user or just continue since the admin also sees the password on their screen
            // For now, we continue but log the error
        }
        
        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: { 
                _id: newUser._id, 
                userId: newUser.userId, 
                fullName: newUser.fullName, 
                email: newUser.email, 
                role: newUser.role 
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const query = {};
        if (req.query.role && req.query.role !== 'all') {
            query.role = req.query.role;
        }
        if (req.query.search) {
            query.fullName = { $regex: req.query.search, $options: 'i' };
        }

        const users = await User.find(query).select('-password');
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.error("Error in getAllUsers:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getUserById = async (req, res)=> {
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({ success: true, data: user });
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        if (req.body.password){
            delete req.body.password;
        }
        if (req.body.userId) {
            delete req.body.userId;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after', runValidators: true } 
        ).select('-password');

        if (!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User updated", data: user})
    } catch(err){
        return res.status(500).json({ success: false, message: "Server Error"})
    }
}

exports.changeCredentialsOnFirstLogin = async (req, res) => {
    try {
        const { newPassword } = req.body;
        
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const user = await User.findById(req.user._id).select('+password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.password = newPassword;
        user.mustChangeCredentials = false;
        user.passwordChangedAt = Date.now();
        
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: 'Credentials updated successfully. You can now access your dashboard.' 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

exports.deleteUser = async (req, res)=> {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User deleted successfully"})
    }catch(err){
        return res.status(500).json({ success: false, message: "Server Error"})
    }
}

exports.updateAvatar = async (req, res) => {
    try {
        // 1. Check if a file was actually uploaded by Multer
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please upload an image file!' 
            });
        }

        // 2. Grab the full Cloudinary URL from the request
        const avatarUrl = req.file.path;

        // 3. Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarUrl },
            { returnDocument: 'after', runValidators: true } // Use returnDocument to match your updateUser logic!
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 4. Send success response matching your other endpoints
        return res.status(200).json({
            success: true,
            message: 'Avatar updated successfully!',
            user: updatedUser
        });
    } catch (err) {
        console.error("Error updating avatar:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};