var CryptoJS = require("cryptojs").Crypto;
var utils = {};

utils.randomString = function randomString (length) {
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789",
		string = "";
	for (var k = 0; k < length; k++) {
		string += chars.charAt(Math.floor(chars.length * Math.random()));
	}
	return string;
};

utils.removeSubDomains = function removeSubDomains (domain) {
	domain = domain || "";
	domain = domain.replace("http://", "");
	domain = domain.split(".");
	var longerThanThreeLeft = true;
	while (longerThanThreeLeft) {
		longerThanThreeLeft = false;
		for (var k = 1; k < domain.length; k++) {
			if (domain[k].length > 4) {
				longerThanThreeLeft = true;
				break;
			}
		}
		if (longerThanThreeLeft) {
			domain.splice(0, 1);
		}
	}
	return domain.join(".");
};

utils.addReview = function addReview (database, form, userId, callback, loggedIn) {
	if (typeof userId === "function") {
		callback = userId;
		userId = null;
	}
	var query = "INSERT INTO reviews (userId, postedWhileLoggedIn, reviewedDomain, reviewedTime, shortDescription, longDescription) VALUES (?, ?, ?, NOW(), ?, ?)";
	database.query(query, [userId, loggedIn, form.reviewedDomain, form.shortDescription, form.longDescription], function (err, results) {
		console.log("A review has been added.", userId, form.reviewedDomain, form.shortDescription, form.longDescription);
		callback(err, results);
	});
};

utils.getReviewsFromDomain = function getReviewsFromDomain (database, domain, callback) {
	domain = this.removeSubDomains(domain);
	subdomains = "%." + domain;
	var query = "SELECT reviewId, modVerified, agreeVotes, reviewedDomain, reviewedTime, shortDescription";
	query+= " FROM reviews WHERE (reviewedDomain LIKE ? OR reviewedDomain = ?) AND visible = 1";
	database.query(query, [subdomains, domain], callback);
};

utils.searchReviews = function searchReviews (database, query, callback) {
	domain = this.removeSubDomains(query);
	var mysqlQuery = "SELECT reviewId, modVerified, agreeVotes, reviewedDomain, reviewedTime, shortDescription FROM reviews WHERE ";
	var firstClause = "reviewedDomain LIKE " + database.escape("%." + domain + ".%") + " OR reviewedDomain LIKE " + database.escape("%." + domain) + " OR reviewedDomain LIKE " + database.escape(domain + ".%") + " OR reviewedDomain = " + database.escape(domain);
	database.query(mysqlQuery + firstClause, [query], function (err, firstReviews) {
		if (err) {
			callback(err, firstReviews);
			return;
		}
		secondClause = "shortDescription LIKE " + database.escape("%" + query + "%") + " AND NOT (" + firstClause + ")";
		database.query(mysqlQuery + secondClause, [query], function (err, secondReviews) {
			if (firstReviews && typeof firstReviews.concat == "function") {
				callback(err, firstReviews.concat(secondReviews));
			} else {
				console.log("ERROR: Expected an array with concat function but didn't get one.");
				callback(err || "ERROR: Expected an array with concat function but didn't get one.");
			}
		});
	});
};

utils.getReviewFromId = function getReviewFromId (database, id, callback) {
	database.query("SELECT reviewId, modVerified, agreeVotes, reviewedDomain, reviewedTime, shortDescription, longDescription FROM reviews WHERE reviewId = ? AND visible = 1", [id], callback);
};

utils.newAccount = function newAccount (database, email, password, callback) {
	database.query("SELECT userId FROM users WHERE email = ?", [email], function (err, rows, fields) {
		if (err) {
			callback(err);
			return;
		}
		if (rows.length > 0) {
			callback(err, rows[0].userId);
			return;
		}
		database.query("INSERT INTO users (password, email) VALUES (?, ?)", [CryptoJS.SHA256(password).toString(CryptoJS.charenc.Hex), email], function (err, result) {
			result = result || {};
			console.log("New account created. Email: " + email);
			callback(err, result.insertId);
		});
	});
};

utils.loginAccount = function loginAccount (database, req, res) {
	database.query("SELECT userId, moderator FROM users WHERE email = ? AND password = ?", [req.body.email, CryptoJS.SHA256(req.body.password).toString(CryptoJS.charenc.Hex)], function (err, rows, fields) {
		if (err) {
			console.log("DATABASE ERROR while trying to login", err);
			res.end('{"error": "A database error occured."}');
			return;
		}
		if (rows.length < 1) {
			database.query("SELECT userId FROM users WHERE email = ?", [req.body.email], function (err, rows, fields) {
				if (rows.length > 0) {
					console.log("Someone tried logging into " + req.body.email + " with a wrong password.");
					res.end('{"error": "This email is not registered or a wrong password was used."}');
					return;
				} else {
					utils.newAccount(database, req.body.email, req.body.password, function () {
						utils.loginAccount(database, req, res);
					});
				}
			});
		} else {
			req.session.userId = rows[0].userId;
			rows[0].email = req.body.email;
			res.end(JSON.stringify(rows[0]));
		}
	});
};

module.exports = utils;