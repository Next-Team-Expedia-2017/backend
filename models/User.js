const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pid: {type: String, unique: true},
    name: String,
    username: String,
    age: String,
    gender: String,
    govtId: String,
    email: String,
    phone: String,
    noOfTrips: String,
    tids: Array,
    rating: String
}, {collection: 'users'});
const User = mongoose.model('User', userSchema);
module.exports = User;
