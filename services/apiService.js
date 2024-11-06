const axios = require('axios');
const { API_URL, API_TOKEN } = require('../config');

// Obtener reservas desde la API externa
async function obtenerReservas() {
    try {
        const response = await axios.get(`http://chelenko-data.sa-east-1.elasticbeanstalk.com/api/guests`, {
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
async function obtenerStock(room, date) {
    try {
        const response = await axios.get(`${API_URL}/stock`, {
            params: { room, date },
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
