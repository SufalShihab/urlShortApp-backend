const Url = require('../models/urlSchema');
const crypto = require('crypto');

const createShortUrl = async (req, res) => {
    try {
        const { longUrl } = req.body;
        if (!longUrl) {
            return res.status(400).json({ success: false, message: "Please enter your Url" });
        }
        const shortId = crypto.randomBytes(3).toString('hex').substring(0, 5);
        
        // Save data to Mongodb
        const newUrl = new Url({
            longUrl,
            shortId,
            createdBy: req.userId 
        });
        await newUrl.save();
        const urlObj = newUrl.toObject();
        urlObj.fullShortUrl = `${process.env.BASE_URL}/api/go/${shortId}`;

        res.status(201).json({ success: true, newUrl: urlObj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Sumthink error" });
    }
};

// ২. নির্দিষ্ট ইউজারের তৈরি করা সব ইউআরএল লিস্ট তুলে আনা
const getUserUrls = async (req, res) => {
    try {
        // শুধু লগইন থাকা ইউজারের লিংকগুলোই ডাটাবেজ থেকে খোঁজা হবে
        const urls = await Url.find({ createdBy: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, urls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "" });
    }
};

// 3.Url Delet
const deleteUrl = async (req, res) => {
    try {
        const { id } = req.params;

        // শুধু যে ইউজার তৈরি করেছে, সে-ই যেন ডিলিট করতে পারে (Security Guard)
        const url = await Url.findOneAndDelete({ _id: id, createdBy: req.userId });

        if (!url) {
            return res.status(404).json({ success: false, message: "" });
        }

        res.status(200).json({ success: true, message: "Delet successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Not Delet" });
    }
};

module.exports = { createShortUrl, getUserUrls, deleteUrl };

