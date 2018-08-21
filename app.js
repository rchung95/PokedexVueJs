const express = require('express');
const mongodb = require('mongodb');
const app = express();
require('dotenv').config(); // To run locally

var db;
const COLLECTION_NAME = 'docs'

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	db = database;
})

app.set('port', (process.env.PORT || 5000));

app.get('/pokedexdb', function(req, res) {
	//Sorting by ascending order based off of orderID
	db.collection(COLLECTION_NAME).find().sort({ orderID: 1 }).toArray(function (err, doc) {
		res.json(doc);
	});
});

app.use(express.static(__dirname + '/src'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue/dist/'), express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/style', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist/'))

app.listen(app.get('port'), function() {});