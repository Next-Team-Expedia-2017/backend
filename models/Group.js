const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const groupSchema = new mongoose.Schema({
    gid: {type: Number, unique: true},
    tid: Array,
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
    maxEnd: String
}, {
    collection: 'groups',
    versionKey: false
});

autoIncrement.initialize(mongoose.connection);

groupSchema.plugin(autoIncrement.plugin, {
    model: 'Group',
    field: 'gid',
    startAt: 3,
    incrementBy: 1
});


const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
