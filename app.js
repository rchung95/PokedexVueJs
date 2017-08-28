const express = require('express');

const app = express();

app.use(express.static(__dirname + '/views'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue/dist/'), express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/style', express.static(__dirname + '/node_modules/bulma/css/'));

app.listen(3000, function() {});