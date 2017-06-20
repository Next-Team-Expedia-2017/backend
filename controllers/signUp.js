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
            User.nextCount(function(err, count) {

                if(err) {
                    console.log("NextCount in postSignUp problem.", err);
                } else {
                    // console.log(count);
                    const newUser = new User({pid: count, username: req.body.username, name: req.body.name, age: req.body.age, gender: req.body.gender, govtId: req.body.govtId, email: req.body.email, phone: req.body.phone, noOfTrips: "0", tids: [], rating: "4"});
                    newUser.save(function(err, newUser) {
                        if(err) {
                            console.log("Error while saving the User in the DB.", err);

                        } else {
                            console.log("Successfully registered new User with pid: "+newUser.pid);
                            req.session.user = newUser;
                            res.redirect('/dashboard');
                        }
                    });
                }
            });

        } else {
            // User exist
            console.log("Username with "+req.body.username+" already exist.");
            res.redirect("/signup?message=Username%20Already%20Exist");
        }
    });
}
