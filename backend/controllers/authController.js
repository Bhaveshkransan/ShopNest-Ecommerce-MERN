const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d", });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // TODO: Implement password hashing, JWT token generation, OTP verification, and sending a welcome email
        // Create a new user
        // In a real application, you should hash the password before saving it to the database
        // implement jwt token generation using bcrypt or a similar library for security
        // OTP verification can be implemented for email
        // welcome email
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
            const message = `Welcome to ShopNest! ${name}. Your OTP for ShopNest registration is: ${otp}`;
            await sendEmail(email, "Welcome to ShopNest", message);
            res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,    
            role: user.role,
            token: generateToken(user._id),
            });
        }
        else{
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerUser, loginUser, getUsers };
