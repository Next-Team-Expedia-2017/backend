const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    gid: {type: Number, unique: true},
    tid: Number,
    destination: String,
    noOfPeople: Number,
    people: [{
        pid: Number,
        startDate: String,
        endDate: String,
        pel: Number,
        status: Number,
        approvedBy: Array,
        approvedRequired: Number
    }],
    minAge: Number,
    maxAge: Number,
    minStart: String,
    maxStart: String
}, {collection: 'groups'});
const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
