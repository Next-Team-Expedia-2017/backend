const Group = require('../models/Group');
const Trip = require('../models/Trip');
const User = require('../models/User');

exports.getNewGroup = (req, res) => {
    Trip.nextCount(function(err, tripCount) {
        if(err) {
            console.log("Error in fetching next trip count.", err);
            res.redirect('/search');
        }
        Group.nextCount(function(err, groupCount) {
            if(err) {
                console.log("Error in fetching next group count.", err);
                res.redirect('/search');
            }
            let newTrip = new Trip({tid: tripCount, gids: [groupCount]});
            newTrip.save(function(err, newTrip) {
                if(err) {
                    console.log("Error in saving new trip.", err);
                    res.redirect('/search');
                }
                let newGroup = new Group({
                    gid: groupCount,
                    tid: [tripCount],
                    destination: req.session.groupQuery.destination,
                    noOfPeople: 1,
                    people: [
                        {
                            pid: req.session.user.pid,
                            startDate: req.session.groupQuery.startDate,
                            endDate: req.session.groupQuery.endDate,
                            pel: req.session.groupQuery.pel,
                            status: 1,
                            approvedBy: [],
                            approvedRequired: 0
                        }
                    ],
                    minAge: req.session.user.age,
                    maxAge: req.session.user.age,
                    minStart: req.session.groupQuery.minStart,
                    maxEnd: req.session.groupQuery.maxEnd
                });
                newGroup.save(function(err, newGroup) {
                    if(err) {
                        console.log("Error in saving new group.", err);
                        res.redirect('/search');
                    }
                    // update the users trips
                    User.findOne({pid: req.session.user.pid}, function(err, user) {
                        if(err) {
                            console.log("Error in fetching the user to update the data.", err);
                            res.redirect('/search');
                        }
                        user.noOfTrips += 1;
                        user.tids.push(tripCount);
                        user.save(function(err, updatedUser) {
                            if(err) {
                                console.log("Error in updating the user in group.js", err);
                                res.redirect('/search');
                            }
                            req.session.user = updatedUser;
                            // new group and trip are made in db
                            res.render('newGroupNewTrip', {user: req.session.user, groupQuery: req.session.groupQuery, gid: groupCount, tid: tripCount});

                        });
                    });
                });
            });
        });
    });
};

exports.addToWhichTrip = (req, res) => {
    // console.log(req.session.user.tids);
    let groupId = req.url.split('/')[2];
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
            for(let i=0;i<tidLength; i++) {
                for(let j=0;j<trips.length;j++) {
                    if(user.tids[i] === trips[j].tid){
                        let tempTid = user.tids[i];
                        user.tids[i] = {};
                        user.tids[i].tid = tempTid;
                        user.tids[i].gids = [];
                        for(let k=0;k<trips[j].gids.length;k++){
                            if(trips[j].gids[k] != groupId){
                                // console.log(trips[j].gids[k]+ " "+ groupId);
                                user.tids[i].gids.push(trips[j].gids[k]);
                            } else {
                                user.tids[i].delete = "yes";
                            }
                        }
                    }
                }
            }
            for(let i=user.tids.length-1; i>=0;i--) {
                if(user.tids[i].delete == "yes")
                    user.tids.splice(i, 1);
            }
            console.log(user.tids);
            for(let i=0;i<user.tids.length; i++) {
                for(let j=0; j<user.tids[i].gids.length; j++) {
                    let tempGid = user.tids[i].gids[j];
                    // user.tids[i].gids[j] = {};
                    // user.tids[i].gids[j].gid = tempGid;
                    for(let k=0;k<groups.length;k++) {
                        if(groups[k].gid == user.tids[i].gids[j]) {
                            console.log(groups[k].gid+" "+user.tids[i].gids[j]);
                            user.tids[i].gids[j] = groups[k];
                        }
                    }

                }
            }
            res.render('addToWhichTrip', {user: user, groupId: groupId});

        });
    });
};

exports.getNewTrip = (req, res) => {
    // console.log(req.query.groupId);
    Trip.nextCount(function(err, tripCount) {
        if(err) {
            console.log("Error in fetching next trip count.", err);
            res.redirect('/dashboard');
        }
        let newTrip = new Trip({tid: tripCount, gids: [req.query.groupId]});
        newTrip.save(function(err, newTrip) {
            if(err) {
                console.log("Error in saving new trip.", err);
                res.redirect('/dashboard');
            }
            User.findOne({pid: req.session.user.pid}, function(err, user) {
                if(err) {
                    console.log("Error in fetching the user to update the data.", err);
                    res.redirect('/dashboard');
                }
                user.noOfTrips += 1;
                user.tids.push(tripCount);
                user.save(function(err, updatedUser) {
                    if(err) {
                        console.log("Error in updating the user in group.js", err);
                        res.redirect('/dashboard');
                    }
                    req.session.user = updatedUser;
                    // new group and trip are made in db
                    Group.findOne({gid: req.query.groupId}, function(err, g) {
                        if(err) {
                            console.log("Error while fetching group", err);
                            res.redirect("/dashboard");
                        }
                        g.noOfPeople += 1;
                        g.people.push(req.session.user);
                        g.tid.push(tripCount);
                        g.save(function(err, updatedG) {
                            if(err) {
                                console.log("Error while saving group", err);
                                res.redirect("/dashboard");
                            }
                            res.render("successNewTrip", {message: "Successfully Added to a New Trip"});
                        });
                    });
                });
            });
        });
    });
};

exports.addGroupToExistingTrip = (req, res) => {
    // console.log(req.url);
    var groupId = req.url.split('/')[2];
    var tripId = req.url.split('/')[3];
    // console.log(groupId, tripId);
    Trip.findOne({tid: tripId}, function(err, trip) {
        if(err) {
            console.log("Error in fetching the trip to update the data.", err);
            res.redirect('/dashboard');
        }
        let flag =0;
        for(let i=0;i<trip.gids.length;i++) {
            if(trip.gids[i] == groupId)
                flag =1;
        }
        if(flag == 1) {
            // already group in the trip in db
            trip.save(function(err, updatedTrip) {
                if(err) {
                    console.log("Error in updating the trip in group.js", err);
                    res.redirect('/dashboard');
                }
                // new group and trip are made in db
                res.render("successNewTrip", {message: "Group is already in Trip."});
            });
        } else {
            // new group
            trip.gids.push(groupId);
            trip.save(function(err, updatedTrip) {
                if(err) {
                    console.log("Error in updating the trip in group.js", err);
                    res.redirect('/dashboard');
                }
                // new group and trip are made in db
                Group.findOne({gid: groupId}, function(err, g) {
                    if(err) {
                        console.log("Error while fetching group", err);
                        res.redirect("/dashboard");
                    }
                    g.noOfPeople += 1;
                    g.people.push(req.session.user);
                    g.tid.push(tripId);
                    g.save(function(err, updatedG) {
                        if(err) {
                            console.log("Error while saving group", err);
                            res.redirect("/dashboard");
                        }
                        res.render("successNewTrip", {message: "Group Added to the Trip Successfully."});
                    });
                });
            });
        }
    });

}
