const Group = require('../models/Group');
const User = require('../models/User');

exports.getSearch = (req, res) => {
    Group.find({destination: req.session.groupQuery.destination}, function(err, data) {
        if(err) {
            console.log("Error in getSearch", err);
            res.redirect('/dashboard');
        } else {
            // Successfully fetched all the data
            // console.log(data);
            // console.log(data.length);

            // for(let i=0; i<data.length; i++) {
            //     // console.log(data[i].people.length);
            //     // one group
            //     for(let j=0;j<data[i].people.length; j++) {
            //         //one person in that one group
            //         // console.log();
            //         User.findOne({pid: (data[i].people)[j].pid}, function(err, user) {
            //             if(err) {
            //                 console.log("Error while fetching data for people", err);
            //                 res.redirect('/dashboard');
            //             }
            //             data[i].people[j].details = user;
            //             console.log(data[i].people[j].details);
            //             next();
            //         });
            //     }
            // }
            // console.log(data);
            User.find({}, function(err, users) {
                if(err) {
                    console.log("Error while fetching data for people in getSearch", err);
                    res.redirect('/dashboard');
                }
                // console.log(users);
                for(let i=0; i<data.length; i++) {
                    //one group
                    // console.log(data[i]);
                    // data[i].endDate = data[i].maxEnd;
                    console.log(data[i].endDate);
                    for(let j=0;j<data[i].people.length;j++) {
                        // one user in that group
                        // console.log((data[i].people)[j].pid);

                        for(let k=0; k<users.length;k++) {
                            // console.log(users[k].pid);
                            if(users[k].pid == (data[i].people)[j].pid) {
                                // console.log(users[k].pid);
                                data[i].people[j].details = users[k];
                            }
                        }
                    }
                }
                console.log(data);

                res.render('search', {groups: data});
                // console.log(data);
                // next();
            });
        }
    });
}

exports.postSearch = (req, res) => {

}
