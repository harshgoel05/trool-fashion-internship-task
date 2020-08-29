const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./backend/routes/routes');

const URI = 'mongodb://localhost:27017/trool-fashion';
const app = express();

mongoose.connect(URI).then(
	() => {
		console.log('Database sucessfully connected');
	},
	(error) => {
		console.log('Database could not connected: ' + error);
	}
);

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
