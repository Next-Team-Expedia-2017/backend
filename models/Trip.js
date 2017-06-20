const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tid: {type: String, unique: true},
    gids: Array
});
const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
