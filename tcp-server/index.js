
const config = require('./config');
const Joi = require('joi');
const express = require('express');
const { TrackerDatabase } = require('./db');
const myTcp = require('./tcp');

var Sequelize = require('sequelize');

const app = express();
app.use(express.json());

//PORT
const port = config.http.envport;
app.listen(port, () => console.log(`listening on port ${port} ...`));

app.get('/api/route', (req, res) => {
	var startDate = req.query.from;
	var endDate = req.query.to;
	console.log("query: ",req.query ,Object.keys(req.query).length);
	console.log("from: ",startDate,"to",endDate );
	var where
	if(Object.keys(req.query).length == 0){
		where = {
			order: [['id', 'DESC']],	// Will escape id and validate DESC against a list of valid direction parameters
			limit: 1000,				//return last 1000 rows
			offset: 0,
			raw: true
		};
	}else{
		where = {
			where: {
				trackerTime:{
					$between: [startDate, endDate]
				}
			}
		};
	}

	TrackerDatabase.findAll(where)
	.then((data) => {
		res.send(data);
	});
});
		// order: [['id', 'DESC']],	// Will escape id and validate DESC against a list of valid direction parameters
		// limit: 1000,				//return last 1000 rows
		// offset: 0,
		//raw: true