const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Note: bcryptjs per your SRS

exports.createUser = async (req, res) => {
    // Changed 'name' to 'fullName'
    const { fullName, email, password, role, phone } = req.body; 
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            fullName, // Matches model
            email,
            password: hashedPassword,
            role,
            phone
        });
        
        return res.status(201).json({
            success: true,
            data: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        // 1. Initialize an empty query object
        const query = {};

        // 2. Add filters if the Admin provided them in the URL query string
        if (req.query.role) {
            // Allows filtering by role, e.g., /api/users?role=Mentor
            query.role = req.query.role;
        }
        
        if (req.query.search) {
            // Allows searching by name (case-insensitive regex)
            // e.g., /api/users?search=abebe will match "Abebe Kebede"
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        // 3. Fetch the users from the database
        // The .select('-password') tells Mongoose to exclude the password field
        const users = await User.find(query).select('-password');

        // 4. Return the data
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
        { returnDocument: 'after', runValidators: true } // Returns the updated document
        ).select('-password');
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