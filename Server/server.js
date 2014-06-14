var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var hash = require("crypto-js/sha256");
var app = express();
var session = require('cookie-session');
var utils = require("./utils.js");
var database = mysql.createConnection({
	host: "localhost",
	user: "WebReviewPlugin",
	password: "mafz5af4z65efa4z6afe",
	database: "WebReviewPlugin"
});

app.use(session({
	keys: ["6qzFQSDjqsd54dZEzjlke4686z", "sds25sdfSDF46vqR75fq5gDeSD4dsS", "hlfqsd4qkjgq246575sdQS57465DFLKJQSDdf54", "qsdfjkD65QSFL65KJQSDF5dq54"]
}));

app.use(bodyParser())

app.get("/review/:reviewid", function (req, res) {
	utils.getReviewFromId(database, req.params.reviewid, function (err, review) {
		if (err) {
			console.log("DATABASE ERROR (while retrieving revew from id)", err);
			res.end('{error: "An error occured while trying to load the review."}');
			return;
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.end(JSON.stringify(review));
	});
});

app.get("/domain/:domain", function (req, res) {
	utils.getReviewsFromDomain(database, req.params.domain, function (err, reviews) {
		if (err) {
			console.log("DATABASE ERROR (while retrieving reviews from domain)", err);
			res.end('{error: "An error occured while trying to load the reviews"}');
			return;
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.end(JSON.stringify(reviews));
	});
});

app.post("/addreview", function (req, res) {
	if (req.body.email) {
		database.query("SELECT userId FROM users WHERE email = " + database.escape(req.body.email), function (err, rows, fields) {
			if (err) {
				console.log("DATABASE ERROR (when selecting userId in addReview): " + err);
				res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?error=1');
				return;
			}
			if (rows.length < 1) {
				utils.newAccount(database, req.body.email, null, function (err, id) {
					utils.addReview(database, req.body, id, function (err) {
						if (err) {
							console.log("DATABASE ERROR (when adding review without userId with email) in addReview): " + err);
							res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?error=1');
							return;
						}
						res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?success=2');
					});
				});
			} else {
				utils.addReview(database, req.body, rows[0].userId, function (err) {
					if (err) {
						console.log("DATABASE ERROR (when adding review with userId) in addReview): " + err);
						res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?error=1');
						return;
					}
					res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?success=1');
				});
			}
		});
	} else {
		utils.addReview(database, req.body, function (err) {
			if (err) {
				console.log("DATABASE ERROR (when adding review without userId) in addReview): " + err);
				res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?error=1');
				return;
			}
			res.redirect(303, 'http://www.squarific.com/WebReviewPlugin/add_review.html?success=1');
		});
	}
});

app.get("/search/:query", function (req, res) {
	utils.searchReviews(database, req.params.query, function (err, reviews) {
		if (err) {
			console.log("DATABASE ERROR (while searching for reviews)", err);
			res.end('{error: "An error occured while trying to load the reviews"}');
			return;
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.end(JSON.stringify(reviews));
	});
});

app.post("/login", function (req, res) {
	res.redirect(303, "http://www.squarific.com/WebReviewPlugin/message.html?msg=loginsuccess");
});

var server = app.listen(8080, function () {
	console.log("Listening on port %d", server.address().port);
});