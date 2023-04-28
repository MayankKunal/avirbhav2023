require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { send } = require("express/lib/response");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const uri = "mongodb+srv://mayank4647:mayank4647@cluster0.le4v6jf.mongodb.net/Avirbhav?retryWrites=true&w=majority"
console.log(uri)
mongoose.connect(uri, { useNewUrlParser: true}
);

mongoose.set('strictQuery', true);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
const eventSchema = mongoose.Schema({
    eventName:
    {
        type: String,
        required: true
    },
    startDate:
    {
        type: String
    },
    startTime:
    {
        type: String
    },
    endDate:
    {
        type: String
    },
    endTime:
    {
        type: String
    },
    status:
    {
        type: String
    }
});

const pointsSchema = mongoose.Schema({
    eventName:
    {
        type: String,
        required: true
    },
    score:
    {
        type: Number,
        required: true
    },
    position:
    {
        type: String,
    },
    penalty:
    {
        type: Number,
        required: true
    }
})

const teamSchema = mongoose.Schema({
    agniastra: [pointsSchema],
    nandiastra: [pointsSchema],
    vayuastra: [pointsSchema],
    jalastra: [pointsSchema]
})

const eventDetails = mongoose.model("eventDetail", eventSchema);
const teamScores = mongoose.model("teamScore", teamSchema);
const password = mongoose.model("password", { password: { type: String } });
var authCode = 1010;


teamScores.findOne({}, (err, data) => {
    if (!err) {
        if (data == null) {
            teamScores.insertMany({
                "agniastra": [
                    {
                        "eventName": "Auction",
                        "score": 2000,
                        "position": "3rd",
                        "penalty": 1250
                    }
                ],
                "nandiastra": [
                    {
                        "eventName": "Auction",
                        "score": 2000,
                        "position": "4th",
                        "penalty": 1500
                    }
                ],
                "vayuastra": [
                    {
                        "eventName": "Auction",
                        "score": 2000,
                        "position": "1st",
                        "penalty": 700
                    }
                ],
                "jalastra": [
                    {
                        "eventName": "Auction",
                        "score": 2000,
                        "position": "2nd",
                        "penalty": 1240
                    }
                ]
            })
        }
    }
})

// GET on sponsor
app.get("/sponsor", (req, res) => {
    res.render("sponsor")
})

// GET on feedback
app.get("/feedback", (req, res) => {
    res.render("feedback");
})

// GET on Events List
app.get("/eventsList", (req, res) => {
    eventDetails.find({}, (err, data) => {
        res.render("eventsList", { eventsList: data })
    });
})

// GET on Live Score
app.get("/livescore", (req, res) => {
    teamScores.findOne({}, (err, data) => {
        res.render("liveScore", { liveScore: data })
    });
})

// GET on Organizer
app.get("/organizers", (req, res) => {
    res.render("organizers")
})

// GET on pointsUpdate
app.get("/pointsUpdate", (req, res) => {
    if (req.body.authCode == authCode) {
        eventDetails.find({}, (err, data) => {
            res.render("pointsUpdate", { eventsList: data, authCode: authCode, display: "none" });
        });
    } else {
        res.send("Authentication Error!");
    }
})

// GET on Delete Events
app.get("/deleteEvents", (req, res) => {
    if (req.body.authCode == authCode) {
        eventDetails.find({}, (err, data) => {
            res.render("deleteEvents", { eventsList: data, authCode: authCode, display: "block" });
        });
    } else {
        res.send("Authentication Error!");
    }
})

// GET on addEvents
app.get("/addevents", (req, res) => {
    if (req.body.authCode == authCode) {
        res.render("addEvents", { authCode: authCode, display: "none" });
    } else {
        res.send("Authentication Error!");
    }
})

// GET on Change Event Status
app.get("/changeeventsstatus", (req, res) => {
    if (req.body.authCode == authCode) {
        eventDetails.find({}, (err, data) => {
            res.render("changeEventsStatus", { eventsList: data, authCode: authCode, display: "none" });
        });
    } else {
        res.send("Authentication Error!");
    }
})

// GET on Admin Dashboard
app.get("/admindashboard", (req, res) => {

        res.render("adminDashboard");
    
})

// GET on log in
app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login");
})

// Post on log in
app.post("/login", (req, res) => {
    const passcode = req.body.password;
    authCode = 1010;

    
        if (authCode== passcode) {
            res.render("adminDashboard", { authCode: authCode });
        }
        else {
            res.send("Wrong Password!");
        }
    });


// Post on Admin Dashboard
app.post("/admindashboard", (req, res) => {
    const value = req.body.admin;
    if (value == "addEvents") {
        res.render("addEvents", { authCode: authCode, display: "none" });
    } else if (value == "pointsUpdate") {
        eventDetails.find({}, (err, data) => {
            res.render("pointsUpdate", { eventsList: data, authCode: authCode, display: "none" });
        });
    } else if (value == "changeEventsStatus") {
        eventDetails.find({}, (err, data) => {
            res.render("changeEventsStatus", { eventsList: data, authCode: authCode, display: "none" });
        });
    } else {
        eventDetails.find({}, (err, data) => {
            res.render("deleteEvents", { eventsList: data, authCode: authCode, display: "none" });
        });
    }
});

// POST on add event
app.post("/addevents", (req, res) => {
    const eventName = req.body.eventName;
    const startDate = req.body.startDate;
    const startTime = req.body.startTime;
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;
    const status = req.body.status;

    eventDetails.insertMany({ eventName: eventName, startDate: startDate, startTime, endDate: endDate, endTime: endTime, status: status });
    res.render("addEvents", { authCode: authCode, display: "block" });
});

// POST on Update Points
app.post("/pointsUpdate", (req, res) => {
    const teamName = req.body.teamName;
    const eventName = req.body.eventName;
    const score = req.body.score;
    const position = req.body.position;
    const penalty = req.body.penalty;

    teamScores.findOne({}, (err, data) => {
        if (teamName == "agniastra") {
            data.agniastra.push({ eventName: eventName, score: score, position: position, penalty: penalty });
        }
        else if (teamName == "nandiastra") {
            data.nandiastra.push({ eventName: eventName, score: score, position: position, penalty: penalty });
        }
        else if (teamName == "vayuastra") {
            data.vayuastra.push({ eventName: eventName, score: score, position: position, penalty: penalty });
        }
        else {
            data.jalastra.push({ eventName: eventName, score: score, position: position, penalty: penalty });
        }
        data.save();
    })

    eventDetails.find({}, (err, data) => {
        res.render("pointsUpdate", { eventsList: data, authCode: authCode, display: "block" });
    });
});


// POST on Change Event Status
app.post("/changeeventsstatus", (req, res) => {
    const eventName = req.body.eventName;
    const status = req.body.status;

    eventDetails.updateOne({ eventName: eventName }, { $set: { status: status } }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated Successfully.")
        }
    });

    eventDetails.find({}, (err, data) => {
        res.render("changeEventsStatus", { eventsList: data, authCode: authCode, display: "block" });
    });
});


// POST on Delete Events
app.post("/deleteEvents", (req, res) => {
    const eventName = req.body.eventName;

    eventDetails.deleteOne({ eventName: eventName }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted Successfully.")
        }
    });
    teamScores.findOneAndUpdate({}, { $pull: { agniastra: { eventName: eventName } } }, (err) => {
        if (!err) {
            console.log("Successfully Deleted");
        }
    });
    teamScores.findOneAndUpdate({}, { $pull: { nandiastra: { eventName: eventName } } }, (err) => {
        if (!err) {
            console.log("Successfully Deleted");
        }
    });
    teamScores.findOneAndUpdate({}, { $pull: { jalastra: { eventName: eventName } } }, (err) => {
        if (!err) {
            console.log("Successfully Deleted");
        }
    });
    teamScores.findOneAndUpdate({}, { $pull: { vayuastra: { eventName: eventName } } }, (err) => {
        if (!err) {
            console.log("Successfully Deleted");
        }
    });


    eventDetails.find({}, (err, data) => {
        res.render("deleteEvents", { eventsList: data, authCode: authCode, display: "block" });
    });
});


// Listen
const port = process.env.PORT || "3000";
app.listen(port, function () {
    console.log("Server Started on Port " + port);
})