const User = require('../models/userSchema');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signupUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter your name,email and password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "This email has already been used !" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
             name,
             email,
             password:hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: "Congratulation,New you aer logged in" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter both email and password" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Noaccount fount with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
         return res.status(400).json({ success: false, message: "Wrong password! Try again." }); //
        }
        //token for cookie
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // ৫. The token is sent to the browser via a cookie.
        res.cookie('token', token, {
        httpOnly: true, // সিকিউরিটির জন্য, জাভাস্ক্রিপ্ট এই কুকি পড়তে পারবে না
        secure: false,  // ডেভেলপমেন্টের সময় false (https এর জন্য true লাগে)
        maxAge: 24 * 60 * 60 * 1000 // ১ দিন পর অটোমেটিক ডিলিট হবে
        });

        return res.status(200).json({ 
            success: true, 
            message: "Login successful",
            user: { id: user._index, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
};

module.exports = { signupUser, loginUser };

