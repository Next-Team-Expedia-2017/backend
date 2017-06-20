const User = require('../models/User');

exports.getSignIn = (req, res) => {
    // console.log(req.query);
    if(req.query.message == undefined){
        // console.log("undefined in get");
        res.render('signin', {});
    } else {
        // console.log(req.query.message);
        res.render('signin', {message: req.query.message})
    }
};

exports.postSignIn = (req, res) => {
    User.findOne({'username': req.body.username}, (err, userdb) => {
        if(err) {
            console.log(err);
            res.redirect('/signin');
        } else if(userdb == null) {
            res.redirect("/signin?message=User%20Doesn%27t%20Exist");
        } else {
            // User exist
            req.session.user = userdb;
            console.log(userdb.name + " logged in.");
            res.redirect('/dashboard');
        }
    });
}
