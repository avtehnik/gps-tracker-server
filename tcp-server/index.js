
const Joi = require('joi');
const express = require('express');
const { TrackerData } = require('./db');
const myTcp = require('./tcp');

const app = express();
app.use(express.json());


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port} ...`));

app.get('/api/route', (req, res) => {
	//res.send(courses);
	TrackerData.count().then((counts) => {
		let myLength = counts;
		let mySelection = 20;

		if(counts < mySelection){
			mySelection = counts;
			console.log("only ", mySelection," rows in log!!!");
		}
		console.log("COUNT: ", myLength);

		var myOffset = myLength - mySelection;
		TrackerData.findAll({ limit: mySelection, offset: myOffset, raw: true }).then((data) => {
			//console.log('data.length: ',data.length);
			//console.log(data);
			res.send(data);
		});
	});
});


