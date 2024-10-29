const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    ota: String,
    idReserva: String,
    fechaInicio: Date,
    fechaFin: Date,
    habitacion: String,
    cantidad: Number, // Número de habitaciones reservadas
    totalPagado: Number,
});

module.exports = mongoose.model('Reserva', reservaSchema);
