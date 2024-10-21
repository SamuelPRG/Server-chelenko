const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const generarDisponibilidad = () => {
    const fechas = [];
    const fechaInicio = new Date("2024-10-10");
    const fechaFin = new Date("2024-10-15");
    
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
        const disponible = Math.random() > 0.1;
        fechas.push({
            fecha: fecha.toISOString().split('T')[0],
            disponible: disponible
        });
    }

    return fechas;
};

const generarPropiedades = () => {
    const propiedades = [];
    
    for (let i = 1; i <= 10; i++) {
        propiedades.push({
            id: i.toString(),
            nombre: `Cabaña ${i}`,
            ubicacion: "Puerto Tranquilo",
            tipo: "Suite",
            precioPorNoche: 120 + (i * 10),
            disponibilidad: generarDisponibilidad(),
            calificacion: (4 + Math.random()).toFixed(1),
            estadoGeneral: "disponible"
        });
    }

    return propiedades;
};

const propiedades = generarPropiedades();

let reservas = [];

function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

app.get('/propiedades', (req, res) => {
    res.status(200).json(propiedades);
});

app.get('/propiedades/:id/disponibilidad', (req, res) => {
    const { id } = req.params;
    
    const propiedad = propiedades.find(p => p.id === id);

    if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const disponibilidad = propiedad.disponibilidad;
    res.status(200).json(disponibilidad);
});

app.get('/buscar', (req, res) => {
    const { fechaInicio, fechaFin, tipo, ubicacion } = req.query;

    if (!fechaInicio || !fechaFin || !tipo || !ubicacion) {
        return res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
    }

    const propiedadesDisponibles = propiedades.filter(propiedad => {
        const fechasReservadas = reservas.filter(reserva => 
            reserva.propiedadId === propiedad.id &&
            !(fechaFin < reserva.fechaInicio || fechaInicio > reserva.fechaFin)
        );

        const estaDisponible = fechasReservadas.length === 0; 
        const fechasDisponibles = propiedad.disponibilidad.filter(d => d.fecha >= fechaInicio && d.fecha <= fechaFin && d.disponible);      
        const cumpleTipo = propiedad.tipo === tipo;
        const cumpleUbicacion = propiedad.ubicacion.toLowerCase() === ubicacion.toLowerCase();

        return estaDisponible && fechasDisponibles.length === (new Date(fechaFin).getDate() - new Date(fechaInicio).getDate() + 1) && cumpleTipo && cumpleUbicacion;
    });

    res.status(200).json(propiedadesDisponibles);
});

app.post('/reservas', (req, res) => {
    const { usuarioId, propiedadId, fechaInicio, fechaFin } = req.body;

    if (!usuarioId || !propiedadId || !fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Faltan datos para la reserva' });
    }

    const propiedad = propiedades.find(p => p.id === propiedadId);
    if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const fechasReservadas = reservas.filter(r => r.propiedadId === propiedadId && 
        (fechaInicio <= r.fechaFin && fechaFin >= r.fechaInicio));

    if (fechasReservadas.length > 0) {
        return res.status(400).json({ error: 'La propiedad no está disponible en las fechas seleccionadas' });
    }

    const nuevaReserva = { 
        id: (reservas.length + 1).toString(), 
        usuarioId, 
        propiedadId, 
        fechaInicio, 
        fechaFin, 
        estado: 'confirmada' 
    };

    reservas.push(nuevaReserva);

    const fechas = getDatesBetween(new Date(fechaInicio), new Date(fechaFin));
    fechas.forEach(fecha => {
        const disponibilidad = propiedad.disponibilidad.find(d => d.fecha === fecha);
        if (disponibilidad) {
            disponibilidad.disponible = false;
        }
    });

    res.status(201).json(nuevaReserva);
});

app.get('/reservas', (req, res) => {
    res.status(200).json(reservas);
});

app.get('/usuarios/:usuarioId/reservas', (req, res) => {
    const { usuarioId } = req.params;
    const reservasUsuario = reservas.filter(r => r.usuarioId === usuarioId);
    res.status(200).json(reservasUsuario);
});

app.delete('/reservas/:id', (req, res) => {
    const { id } = req.params;
    const reservaIndex = reservas.findIndex(r => r.id === id);

    if (reservaIndex === -1) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const reserva = reservas[reservaIndex];
    const propiedad = propiedades.find(p => p.id === reserva.propiedadId);
    const fechas = getDatesBetween(new Date(reserva.fechaInicio), new Date(reserva.fechaFin));
    fechas.forEach(fecha => {
        const disponibilidad = propiedad.disponibilidad.find(d => d.fecha === fecha);
        if (disponibilidad) {
            disponibilidad.disponible = true;
        }
    });

    reservas.splice(reservaIndex, 1);
    res.status(200).json({ message: 'Reserva cancelada correctamente' });
});

app.put('/propiedades/:id/disponibilidad', (req, res) => {
    const { id } = req.params;
    const { disponibilidad } = req.body;

    if (!disponibilidad || !Array.isArray(disponibilidad)) {
        return res.status(400).json({ error: 'Formato de disponibilidad inválido' });
    }

    const propiedad = propiedades.find(p => p.id === id);

    if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    propiedad.disponibilidad = disponibilidad;

    res.status(200).json({ message: 'Disponibilidad actualizada', propiedad });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
