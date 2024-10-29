const moment = require('moment');
const Reserva = require('../models/reservaModel');
const Stock = require('../models/stockModel');
const { obtenerReservas } = require('../services/apiService');
const { actualizarStockEnOTAs } = require('../services/otaService');

// Actualizar el stock por cada día en el rango de una reserva
async function actualizarStockPorDias(habitacion, fechaInicio, fechaFin, cantidadReservada) {
    try {
        const diasReservados = moment(fechaFin).diff(moment(fechaInicio), 'days') + 1;

        for (let i = 0; i < diasReservados; i++) {
            const fecha = moment(fechaInicio).add(i, 'days').toDate();

            let stock = await Stock.findOne({ habitacion, fecha });

            if (!stock) {
                // Si no existe stock para ese día, inicializamos con stock predeterminado (ej: 10 habitaciones)
                stock = new Stock({
                    habitacion,
                    disponible: 10,
                    fecha,
                    actualizacion: new Date(),
                });
            }

            // Reducimos el stock disponible si es suficiente
            if (stock.disponible >= cantidadReservada) {
                stock.disponible -= cantidadReservada;
                stock.actualizacion = new Date();
                await stock.save();
            } else {
                console.error(`Stock insuficiente para la fecha ${fecha.toISOString()} en la habitación ${habitacion}`);
                return;
            }
        }

        // Sincronizar el stock con las OTAs
        await actualizarStockEnOTAs(habitacion, fechaInicio, fechaFin);
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
                ota: reserva.ota,
                idReserva: reserva.id,
                fechaInicio: reserva.fechaInicio,
                fechaFin: reserva.fechaFin,
                habitacion: reserva.habitacion,
                cantidad: reserva.cantidad,
                totalPagado: reserva.totalPagado,
            });

            await nuevaReserva.save();

            // Actualizamos el stock para el rango de fechas de la reserva
            await actualizarStockPorDias(reserva.habitacion, reserva.fechaInicio, reserva.fechaFin, reserva.cantidad);
        }

        console.log('Reservas sincronizadas y stock actualizado correctamente');
    } catch (error) {
        console.error('Error durante la sincronización de reservas:', error);
        throw error;
    }
}

module.exports = { sincronizarReservas };
