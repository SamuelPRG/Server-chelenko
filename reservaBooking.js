const axios = require('axios');

/*
ACA DEBERIA ESTAR EL ENDPOINT DE BOOKING QUE ENVIA LAS NUEVAS RESERVAS,
ESTO REEMPLAZARIA EL JSON DE ABAJO
*/
const nuevaReservaBooking = {
    "bookingReference": "GRUPO1BOOKING",
    "guest": "605c72ef5f7e2d3db4f1baf7", 
    "room": "605c72ef5f7e2d3db4f1baf8",
    "checkIn": "2024-10-01T14:00:00Z",
    "checkOut": "2024-10-05T12:00:00Z",
    "totalPrice": 500,
    "channel": "DIRECT",
    "channelReference": "CHANNEL_REF",
    "specialRequests": "Cama extra"
  }  ;


  axios.post('http://chelenko-data.sa-east-1.elasticbeanstalk.com/api/reservations', nuevaReservaBooking)
  .then(response => {
    console.log("Reserva creada con éxito:", response.data);
  })
  .catch(error => {
    console.error("Error al crear la reserva:", error.response ? error.response.data : error.message);
  });

