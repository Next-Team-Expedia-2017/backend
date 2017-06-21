exports.getDashboard = (req, res) => {
    res.render('dashboard', {user: req.session.user});
}

exports.postDashboard = (req, res) => {
    req.session.groupQuery = { destination: req.body.destination, minStart: req.body.startDate, maxEnd: req.body.endDate, pel: req.body.pel};
    res.redirect('/search');
}
