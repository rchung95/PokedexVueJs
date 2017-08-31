const express = require('express');
const mongojs = require('mongojs');
const db = mongojs('pokedexdb', ['docs']);

const app = express();

app.get('/pokedexdb', function(req, res) {
	//Sorting by ascending order based off of orderID
	db.docs.find().sort({ orderID: 1 }).toArray(function (err, doc) {
		res.json(doc);
	});
});

app.use(express.static(__dirname + '/views'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue/dist/'), express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/style', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist/'))

app.listen(3000, function() {});