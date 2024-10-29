const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    bookingReference: String,
    guest: String,
    room: String,
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
    channel: String,
    channelReference: String,
    specialRequests: String,
});

module.exports = mongoose.model('Stock', stockSchema);
