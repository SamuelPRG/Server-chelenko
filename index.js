const express = require('express');
const { sincronizarReservas } = require('./controllers/reservasController');

const app = express();
const PORT = process.env.PORT || 3000;

// Sincronización de reservas cada 15 minutos (ejemplo con setInterval)
setInterval(async () => {
    try {
        await sincronizarReservas();
    } catch (error) {
        console.error('Error durante la sincronización periódica:', error);
    }
}, 15 * 60 * 1000);  // Cada 15 minutos

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
