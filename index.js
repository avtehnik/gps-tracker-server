const config = require('./config');
const Joi = require('joi');
const express = require('express');
const db = require('./models/index.js');
const myTcp = require('./tcp');
var path = require('path');
var Sequelize = require('sequelize');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//PORT
const port = config.http_port;
app.listen(port, () => console.log(`listening on port ${port} ...`));

app.get('/api/route', (req, res) => {

// var lat  = 49;					// Tests  
// var lng = 32;

// 	res.json([
// 		{lat: lat*(1+(Math.random()/10)), lng: lng*(1+(Math.random()/10))},
// 		{lat: lat*(1+(Math.random()/10)), lng: lng*(1+(Math.random()/10))},
// 		{lat: lat*(1+(Math.random()/10)), lng: lng*(1+(Math.random()/10))},
// 		]);
// return;


    var startDate = req.query.from;
    var endDate = req.query.to;
    var where = {
        order: [['id', 'DESC']],	// Will escape id and validate DESC against a list of valid direction parameters
        where: {}
    };

    if (req.query.udid) {
        where['where'].gpsUid = req.query.udid;
    }

    // console.log('startDate',startDate);
    // console.log('endDate', endDate);

    if (startDate && endDate) {
        where['where'].createdAt = {
            $between: [startDate, endDate]
        }
    } else {
        where['limit'] = 1000;
    }

    db.trackData.findAll(where)
        .then((data) => {
            // console.log("RES",data);
            res.send(data);
        });
});


const a9g = express();

//PORT
const a9gPort = 8082;
a9g.listen(a9gPort, () => console.log(`listening on port ${a9gPort} ...`));

a9g.post('/', (req, res) => {

    console.log(req.query);
    if (parseFloat(req.query.lat) == 90.000000 || parseFloat(req.query.lon) == 0.000000) {
        res.json([]);
        return
    }
    var record = {
        lat: parseFloat(req.query.lat),
        lng: parseFloat(req.query.lon),
        speed: parseFloat(req.query.speed),
        direction: parseFloat(req.query.bearing),
        gpsUid: req.query.id.substring(0, 11),
        trackerTime: new Date(parseInt(req.query.timestamp) * 1000)
    };

    console.log(record);
    db.trackData.create(record);
    res.json([]);
});
