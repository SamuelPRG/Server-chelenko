const axios = require('axios');
const { API_URL, API_TOKEN } = require('../config');

// Obtener reservas desde la API externa
async function obtenerReservas() {
    try {
        const response = await axios.get(`${API_URL}/reservas`, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        });
        return response.data.reservas;
    } catch (error) {
        console.error('Error al obtener reservas desde la API:', error);
        throw error;
    }
}

// Obtener el stock de habitaciones desde la API externa
async function obtenerStock(habitacion, fecha) {
    try {
        const response = await axios.get(`${API_URL}/stock`, {
            params: { habitacion, fecha },
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        });
        return response.data.stock;
    } catch (error) {
        console.error('Error al obtener stock desde la API:', error);
        throw error;
    }

}

module.exports = { obtenerReservas, obtenerStock };
