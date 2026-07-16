const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    // কোন ইউজার এই লিংকটি তৈরি করেছে তা ট্র্যাক করার জন্য (JWT থেকে আসবে)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);