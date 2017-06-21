exports.isAuthenticated = (req, res, next) => {
    if(req.session.user) {
        // console.log(req.session.user);
        next();
    } else {
        res.redirect('/');
    }
}

exports.isQueryGivenForGroup = (req, res, next) => {
    if(req.session.groupQuery) {
        // console.log(req.session.groupQuery);
        next();
    } else {
        res.redirect('/dashboard');
    }
}
