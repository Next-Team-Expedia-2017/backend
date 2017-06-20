const userSchema = new mongoose.Schema({
    pid: {type: String, unique: true},
    name: String,
    age: String,
    gender: String,
    govtId: String,
    email: String,
    phone: String,
    noOfTrips: String,
    tids: Array,
    rating: String
});
