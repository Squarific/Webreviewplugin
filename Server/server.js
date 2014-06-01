var mysql = require("mysql");
var express = require("express");
var app = express();
var session = require('cookie-session');
var database = mysql.createConnection({
	host: "localhost",
	user: "WebReviewPlugin",
	password: "mafz5af4z65efa4z6afe",
	database: "WebReviewPlugin"
});

app.use(session({
	keys: ["6qzFQSDjqsd54dZEzjlke4686z", "sds25sdfSDF46vqR75fq5gDeSD4dsS", "hlfqsd4qkjgq246575sdQS57465DFLKJQSDdf54", "qsdfjkD65QSFL65KJQSDF5dq54"]
}));

app.get("/review/:reviewid", function (req, res) {
	
});

app.get("/status/:domain", function (req, res) {
	
});

app.post("/review", function (req, res) {
	
});

app.get("/search", function (req, res) {
	
});

app.post("/login", function (req, res) {
	
});

var server = app.listen(8080, function () {
	console.log("Listening on port %d", server.address().port);
});