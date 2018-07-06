
const config = require('./config');
const Joi = require('joi');
const express = require('express');
const { TrackerData } = require('./db');
const myTcp = require('./tcp');

const app = express();
app.use(express.json());

//PORT
const port = config.http.envport;
app.listen(port, () => console.log(`listening on port ${port} ...`));

app.get('/api/route', (req, res) => {
	//res.send(courses);
	TrackerData.findAll({
		order: [['id', 'DESC']],	// Will escape id and validate DESC against a list of valid direction parameters
		limit: 1000,				//return last 1000 rows
		offset: 0,
		raw: true })
	.then((data) => {
		//console.log('data.length: ',data.length);
		//console.log(data);
		res.send(data);
	});

	var myFrom = req.query.from;
	console.log('from: ', myFrom);
	var myTo = req.query.to;
	console.log('to: ', myTo);
});
