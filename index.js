const express = require('express');
const mongoose = require('mongoose');
const { sincronizarReservas } = require('./controllers/reservasController');
const { DB_URL } = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a la base de datos'))
    .catch((error) => console.error('Error al conectar a la base de datos:', error));

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
