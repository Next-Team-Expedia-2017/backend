const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const userSchema = new mongoose.Schema({
    pid: {type: Number, unique: true},
    name: String,
    username: {type: String, unique: true},
    age: Number,
    gender: String,
    govtId: String,
    email: String,
    phone: String,
    noOfTrips: Number,
    tids: Array,
    rating: Number
}, {
    collection: 'users',
    versionKey: false
});

autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'pid',
    startAt: 3,
    incrementBy: 1
});
const User = mongoose.model('User', userSchema);
module.exports = User;
