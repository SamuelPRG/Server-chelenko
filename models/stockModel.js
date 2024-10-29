const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    habitacion: String,
    disponible: Number,
    fecha: Date,
    actualizacion: Date,
});

module.exports = mongoose.model('Stock', stockSchema);
