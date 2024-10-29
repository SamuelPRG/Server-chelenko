class Reserva {
    constructor({
        bookingReference,
        guest,
        room,
        checkIn,
        checkOut,
        totalPrice,
        channel,
        channelReference,
        specialRequests
    }) {
        this.bookingReference = bookingReference;
        this.guest = guest;
        this.room = room;
        this.checkIn = new Date(checkIn);
        this.checkOut = new Date(checkOut);
        this.totalPrice = totalPrice;
        this.channel = channel;
        this.channelReference = channelReference;
        this.specialRequests = specialRequests;
    }
}

module.exports = Reserva;