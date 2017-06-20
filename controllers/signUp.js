const User = require('../models/User');

exports.getSignUp = (req, res) => {
    if(req.query.message == undefined){
        // console.log("undefined in get");
        res.render('signup', {});
    } else {
        // console.log(req.query.message);
        res.render('signup', {message: req.query.message})
    }
};

exports.postSignIn = (req, res) => {
    console.log(res.body.id);
};



exports.postSignUp = (req, res) => {
    User.findOne({'username': req.body.username}, (err, userdb) => {
        if(err) {
            console.log(err);
            res.redirect('/signin');
        } else if(userdb == null) {
            // username
            const newUser = new User({pid: });
        } else {
            // User exist
            res.redirect("/signup?message=Username%20Already%20Exist");
            // console.log(userdb);
            req.session.user = userdb;
            res.redirect('/dashboard');
        }
    });
}
