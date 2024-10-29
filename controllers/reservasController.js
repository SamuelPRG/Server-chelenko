const moment = require('moment');
const Reserva = require('../models/reservaModel');
const Stock = require('../models/stockModel');
const { obtenerReservas } = require('../services/apiService');
const { actualizarStockEnOTAs } = require('../services/otaService');

// Actualizar el stock por cada día en el rango de una reserva
async function actualizarStockPorDias(room, checkIn, checkOut, cantidadReservada) {
    try {
        const diasReservados = moment(checkOut).diff(moment(checkIn), 'days') + 1;

        for (let i = 0; i < diasReservados; i++) {
            const fecha = moment(checkIn).add(i, 'days').toDate();

            let stock = await Stock.findOne({ room, fecha });

            if (!stock) {
                // Si no existe stock para ese día, inicializamos con stock predeterminado (ej: 10 habitaciones)
                //!revisar esta parte del código
                //!preguntar a jose
                stock = new Stock({
                    room,
                    availableUnits: 10,
                    date,
                    actualizacion: new Date(),
                });
            }

            // Reducimos el stock disponible si es suficiente
            if (stock.availableUnits >= cantidadReservada) {
                stock.availableUnits -= cantidadReservada;
                stock.actualizacion = new Date();
                await stock.save();
            } else {
                console.error(`Stock insuficiente para la fecha ${fecha.toISOString()} en la habitación ${habitacion}`);
                return;
            }
        }

        // Sincronizar el stock con las OTAs
        await actualizarStockEnOTAs(room, checkIn, checkOut);
    } catch (error) {
        console.error('Error al actualizar el stock por días:', error);
        throw error;
    }
}

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

            await nuevaReserva.save();

            // Actualizamos el stock para el rango de fechas de la reserva
            //! preguntar por cantidad reservada
            await actualizarStockPorDias(reserva.room, reserva.checkIn, reserva.checkOut, reserva.cantidadReservada );
        }

        console.log('Reservas sincronizadas y stock actualizado correctamente');
    } catch (error) {
        console.error('Error durante la sincronización de reservas:', error);
        throw error;
    }
}

module.exports = { sincronizarReservas };
