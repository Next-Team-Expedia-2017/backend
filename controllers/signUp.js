const User = require('../models/User');

exports.getSignUp = (req, res) => {
    res.render('signup', {});
}

exports.postSignUp = (req, res) => {
    console.log(res.body.id);
}
