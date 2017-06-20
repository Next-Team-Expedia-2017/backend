const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tid: {type: String, unique: true},
    gids: Array
}, {collection: 'trips'});
const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
