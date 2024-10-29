class Stock {
    constructor({
        room,
        date,
        availableUnits,
        price,
        restrictions,
        channel
    }) {
        this.room = room;
        this.date = new Date(date);
        this.availableUnits = availableUnits;
        this.price = price;
        this.restrictions = {
            minStay: restrictions?.minStay || 1,
            maxStay: restrictions?.maxStay || 30,
            closedToArrival: restrictions?.closedToArrival || false,
            closedToDeparture: restrictions?.closedToDeparture || false
        };
        this.channel = channel;
    }
}

module.exports = Stock;