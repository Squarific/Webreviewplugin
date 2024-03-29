function WebReviewPlugin (server) {
	this.server = server;
}

WebReviewPlugin.prototype.moderateReview = function moderateReview (reviewId, key, value, callback) {
	var request = new XMLHttpRequest();
	request.addEventListener("error", function () {
		callback({error: "Failed to moderate review, do you have an internet connection?"});
	});
	request.addEventListener("load", function () {
		callback(JSON.parse(request.responseText));
	}, false);
	request.open("GET", this.server + "/moderatereview/" + reviewId + "/" + key + "/" + value);
	request.send();
};

WebReviewPlugin.prototype.login = function (email, password, callback) {
	var params = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
	var request = new XMLHttpRequest();
	request.addEventListener("error", function () {
		callback('{"error": "Failed to login, do you have an internet connection?"}');
	});
	request.addEventListener("load", function () {
		var response = JSON.parse(request.responseText);
		for (var k in response) {
			localStorage[k] = response[k];
		}
		callback(request.responseText);
	}, false);
	request.open("POST", this.server + "/login", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
};

WebReviewPlugin.prototype.postReview = function postReview (form, callback) {
	var params = [];
	for (var k in form) {
		params.push(k + "=" + form[k]);
	}
	var params = params.join("&");
	var request = new XMLHttpRequest();
	request.addEventListener("error", function () {
		callback('{"error": "Failed to post review, do you have an internet connection?"}');
	});
	request.addEventListener("load", function () {
		callback(request.responseText);
	}, false);
	request.open("POST", this.server + "/addreview", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
};

WebReviewPlugin.prototype.getReview = function getReview (id, callback) {
	var request = new XMLHttpRequest();
	request.addEventListener("error", function () {
		callback({error: "Failed to load review, do you have an internet connection?"});
	});
	request.addEventListener("load", function () {
		callback(JSON.parse(request.responseText));
	}, false);
	request.open("GET", this.server + "/review/" + id);
	request.send();
};

WebReviewPlugin.prototype.search = function search (query, callback) {
	var request = new XMLHttpRequest();
	request.addEventListener("error", function () {
		callback({error: "Failed to load reviews, do you have an internet connection?"});
	});
	request.addEventListener("load", function () {
		callback(JSON.parse(request.responseText));
	}, false);
	request.open("GET", this.server + "/search/" + encodeURIComponent(query));
	request.send();
};

WebReviewPlugin.prototype.getReviews = function getReviews (domain, callback) {
	var request = new XMLHttpRequest();
	request.addEventListener("error", function () {
		callback({error: "Failed to load reviews, do you have an internet connection?"});
	});
	request.addEventListener("load", function () {
		callback(JSON.parse(request.responseText));
	}, false);
	request.open("GET", this.server + "/domain/" + encodeURIComponent(domain));
	request.send();
};

WebReviewPlugin.prototype.getDomReview = function (jsonReview) {
	var review = document.createElement("div");
	review.className = "smallreview";
	
	review.appendChild(this.newDomSpan(jsonReview.reviewedDomain, ""));
	review.appendChild(document.createElement("br"));
	
	review.appendChild(this.newDomSpan("Date: ", "reviewlabel label"));
	review.appendChild(this.newDomSpan(new Date(jsonReview.reviewedTime).toLocaleString(), ""));
	review.appendChild(document.createElement("br"));
	
	review.appendChild(this.newDomSpan("Desc: ", "reviewlabel label"));
	review.appendChild(this.newDomSpan(jsonReview.shortDescription, ""));
	review.appendChild(document.createElement("br"));
	
	if (jsonReview.longDescription) {
		review.appendChild(this.newDomSpan("Full desc: ", "reviewlabel label"));
		
		var longDescDiv = review.appendChild(document.createElement("div"));
		longDescDiv.innerHTML = markdown.toHTML(jsonReview.longDescription);
		
		review.appendChild(document.createElement("br"));
	} else {
		review.appendChild(this.newDomMoreInfoButton(jsonReview.reviewId));
	}
	
	if (localStorage.moderator) {
		review.appendChild(this.newDomRemoveButton(jsonReview.reviewId));
	}
	
	return review;
};

WebReviewPlugin.prototype.newDomSpan = function (innerText, className) {
	var span = document.createElement("span");
	span.appendChild(document.createTextNode(innerText));
	span.className = className;
	return span;
};

WebReviewPlugin.prototype.newDomMoreInfoButton = function (id) {
	var anchor = document.createElement("a");
	anchor.href = "review.html?id=" + id;
	var button = anchor.appendChild(document.createElement("div"));
	button.className = "moreinfobutton button";
	button.innerText = "More about this review";
	return anchor;
};

WebReviewPlugin.prototype.newDomRemoveButton = function (id) {
	var anchor = document.createElement("a");
	anchor.href = "review.html?delete=" + id;
	var button = anchor.appendChild(document.createElement("div"));
	button.className = "moreinfobutton button removebutton";
	button.innerText = "Make this review invisible";
	return anchor;
};

var reviewPlugin = new WebReviewPlugin("http://127.0.0.1:8080");