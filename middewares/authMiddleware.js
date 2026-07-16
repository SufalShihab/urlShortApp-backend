const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "দয়া করে আগে লগইন করুন!" });
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // পরবর্তী কাজের জন্য ইউজারের আইডি সেভ রাখা
        next(); 
    } catch (error) {
        return res.status(403).json({ success: false, message: "The token is not valid!" });
    }
};

module.exports = { verifyUser };