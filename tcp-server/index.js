
const config = require('./config');
const Joi = require('joi');
const express = require('express');
const { TrackerDatabase } = require('./db');
const myTcp = require('./tcp');
var path = require('path');
var Sequelize = require('sequelize');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//PORT
const port = config.http.envport;
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
	}

	// console.log('startDate',startDate);
	// console.log('endDate', endDate);

	if(startDate && endDate){
		where['where'] = {
			trackerTime:{
				$between: [startDate, endDate]
			}
		}
	}else{
		where['limit'] = 1000;
	}

	TrackerDatabase.findAll(where)
	.then((data) => {
		// console.log("RES",data);
		res.send(data);
	});
});
