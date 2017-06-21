const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const tripSchema = new mongoose.Schema({
    tid: {type: Number, unique: true},
    gids: Array
}, {
    collection: 'trips',
    versionKey: false
});

autoIncrement.initialize(mongoose.connection);

tripSchema.plugin(autoIncrement.plugin, {
    model: 'Trip',
    field: 'tid',
    startAt: 2,
    incrementBy: 1
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
