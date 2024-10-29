const axios = require('axios');

// Sincronizar el stock actualizado con Booking
async function actualizarStockEnOTAs(habitacion, fechaInicio, fechaFin) {
    try {
        await axios.put('https://api.booking.com/stock', {
            habitacion,
            fechaInicio,
            fechaFin,
        }, {
            headers: {
                Authorization: 'Bearer tu_token_de_booking',
            },
        });

        console.log(`Stock actualizado en Booking para la habitación ${habitacion} del ${fechaInicio} al ${fechaFin}`);
    } catch (error) {
        console.error('Error al actualizar el stock en Booking:', error);
        throw error;
    }
}

module.exports = { actualizarStockEnOTAs };
