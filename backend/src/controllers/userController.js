const User = require("../models/User");

exports.createUser = async (req, res) => {
    const { fullName, email, password, role, phone } = req.body; 
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const newUser = await User.create({
            fullName, 
            email,
            password,
            role,
            phone
        });
        
        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const query = {};
        if (req.query.role) {
            query.role = req.query.role;
        }
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
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
    try{
        if (req.body.password){
            delete req.body.password;
        }
    const user = await User.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { returnDocument: 'after', runValidators: true } ).select('-password');
        if (!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User updated", data: user})
    }catch(err){
        return res.status(500).json({ success: false, message: "Server Error"})
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