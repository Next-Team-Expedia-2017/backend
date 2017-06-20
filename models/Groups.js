const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    gid: {type: String, unique: true},
    tid: String,
    destination: String,
    noOfPeople: String,
    people: [{
        pid: String,
        startDate: String,
        endDate: String,
        pel: String,
        status: String,
        approvedBy: Array,
        approvedRequired: String
    }],
    minAge: String,
    maxAge: String,
    minStart: String,
    maxStart: String
}, {collection: 'groups'});
const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
