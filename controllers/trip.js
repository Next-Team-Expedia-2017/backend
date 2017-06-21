const Group = require('../models/Group');
const Trip = require('../models/Trip');
const User = require('../models/User');

exports.getTrips = (req, res) => {
    Group.find({}, function(err, groups) {
        if(err) {
            console.log("Error while fetching groups", err);
            res.redirect("/dashboard");
        }
        Trip.find({}, function(err, trips) {
            if(err) {
                console.log("Error while fetching trips", err);
                res.redirect("/dashboard");
            }
            let user = req.session.user;
            let tidLength = user.tids.length;
            // console.log(user.tids);
            for(let i=0;i<tidLength; i++) {
                for(let j=0;j<trips.length;j++) {
                    if(user.tids[i] === trips[j].tid){
                        let tempTid = user.tids[i];
                        user.tids[i] = {};
                        user.tids[i].tid = tempTid;
                        user.tids[i].gids = [];
                        for(let k=0;k<trips[j].gids.length;k++){
                            console.log(trips[j].gids.length);
                            user.tids[i].gids.push(trips[j].gids[k]);
                        }
                    }
                }
            }

            console.log(user.tids);
            for(let i=0;i<user.tids.length; i++) {
                for(let j=0; j<user.tids[i].gids.length; j++) {
                    let tempGid = user.tids[i].gids[j];
                    for(let k=0;k<groups.length;k++) {
                        if(groups[k].gid == user.tids[i].gids[j]) {
                            console.log(groups[k].gid+" "+user.tids[i].gids[j]);
                            user.tids[i].gids[j] = groups[k];
                        }
                    }

                }
            }
            res.render('trip', {user: user});
        });
    });
}
