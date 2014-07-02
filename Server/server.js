var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var utils = require("./utils.js");
var database = mysql.createConnection({
	host: "localhost",
	user: "WebReviewPlugin",
	password: "mafz5af4z65efa4z6afe",
	database: "WebReviewPlugin"
});

app.use(bodyParser())

app.get("/moderatereview/:reviewId/:key/:value", function (req, res) {
	utils.moderateReview(database, req.session.userId, req.params, function (err) {
		if (err === "KEYNOTALLOWED") {
			console.log("Someone tried moderating a review with a bad key", req.params);
			res.end('{"error": "The provided key isn\t allowed to be changed."}');
			return;
		}
		if (err === "NOTALLOWED") {
			console.log("Someone tried moderating a review while not logged in", req.params);
			res.end('{"error": "You aren\'t logged in or lack the necessary rights to moderate reviews."}');
			return;
		}
		if (err) {
			console.log();
			res.end('{"error": "An error occured while trying to moderate the review."}');
			return;
		}
		res.end('{"success": "Succesfully moderated review."}');
	});
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
});

app.get("/review/:reviewid", function (req, res) {
	utils.getReviewFromId(database, req.params.reviewid, req.session.userId, function (err, review) {
		if (err) {
			console.log("DATABASE ERROR (while retrieving revew from id)", err);
			res.end('{"error": "An error occured while trying to load the review."}');
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
			res.end('{"error": "An error occured while trying to load the reviews"}');
			return;
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.end(JSON.stringify(reviews));
	});
});

app.post("/addreview", function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	if (req.body.email && !req.session.userId) {
		database.query("SELECT userId FROM users WHERE email = " + database.escape(req.body.email), function (err, rows, fields) {
			if (err) {
				console.log("DATABASE ERROR (when selecting userId in addReview): " + err);
				res.end('{"error": "An error occured while posting the review, please try again later."}');
				return;
			}
			if (rows.length < 1) {
				utils.newAccount(database, req.body.email, utils.randomString(5), function (err, id) {
					utils.addReview(database, req.body, id, function (err) {
						if (err) {
							console.log("DATABASE ERROR (when adding review without userId with email) in addReview): " + err);
							res.end('{"error": "An error occured while posting the review, please try again later."}');
							return;
						}
						res.end('{"success": "Your review has been succesfully added and an account has been created.", "email": "' + req.body.email + '"}');
					});
				});
			} else {
				utils.addReview(database, req.body, rows[0].userId, function (err) {
					if (err) {
						console.log("DATABASE ERROR (when adding review with userId) in addReview): " + err);
						res.end('{"error": "An error occured while posting the review, please try again later."}');
						return;
					}
					res.end('{"success": "Your review has been succesfully added!"}');
				});
			}
		});
	} else if (req.session.userId) {
		utils.addReview(database, req.body, req.session.userId, function (err) {
			if (err) {
				console.log("DATABASE ERROR (when adding review with session userId) in addReview): " + err);
				res.end('{"error": "An error occured while posting the review, please try again later."}');
				return;
			}
			res.end('{"success": "Your review has been succesfully added!"}');
		}, true);
	}else {
		utils.addReview(database, req.body, function (err) {
			if (err) {
				console.log("DATABASE ERROR (when adding review without userId) in addReview): " + err);
				res.end('{"error": "An error occured while posting the review, please try again later."}');
				return;
			}
			res.end('{"success": "Your review has been succesfully added!"}');
		});
	}
});

app.get("/search/:query", function (req, res) {
	utils.searchReviews(database, req.params.query, function (err, reviews) {
		if (err) {
			console.log("DATABASE ERROR (while searching for reviews)", err);
			res.end('{"error": "An error occured while trying to load the reviews"}');
			return;
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.end(JSON.stringify(reviews));
	});
});

app.post("/login", function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	utils.loginAccount(database, req, res);
});

var server = app.listen(8080, function () {
	console.log("Listening on port %d", server.address().port);
});