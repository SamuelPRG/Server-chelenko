const moment = require('moment');
const Reserva = require('../models/reservaModel');
const { obtenerReservas } = require('../services/apiService');
const axios = require('axios');

// Obtener reservas de la API y actualizar el stock en el sistema
async function sincronizarReservas() {
    try {
        const reservas = await obtenerReservas();

        for (const reserva of reservas) {
            const nuevaReserva = new Reserva({

                bookingReference: reserva.bookingReference,
                guest: reserva.guest,
                room: reserva.room,
                checkIn: reserva.checkIn,
                checkOut: reserva.checkOut,
                totalPrice: reserva.totalPrice,
                channel: reserva.channel,
                channelReference: reserva.channelReference,
                specialRequests: reserva.specialRequests
            });

            // crear nueva reserva en la base de datos por medio del endpoint
            axios.post ("http://chelenko-data.sa-east-1.elasticbeanstalk.com/api/reservations", nuevaReserva)

        }
        console.log('Reservas sincronizadas y stock actualizado correctamente');
    } catch (error) {
        console.error('Error durante la sincronización de reservas:', error);
        throw error;
    }
}

module.exports = { sincronizarReservas };
