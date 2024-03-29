chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	var domain = new URL(tabs[0].url).hostname;
	document.getElementById("addreviewlink").href = "add_review.html?domain=" + encodeURIComponent(domain);
	document.getElementById("pagestatusdomain").innerText = domain;
	reviewPlugin.getReviews(domain, function (reviews) {
		var msg = document.getElementById("message");
		var modadded, comadded;
		while (msg.firstChild) {
			msg.removeChild(msg.firstChild);
			msg.style.display = "none";
		}
		if (reviews.error) {
			var msg = document.getElementById("message");
			msg.style.display = "inline-block";
			var h3 = msg.appendChild(document.createElement("h3"));
			h3.appendChild(document.createTextNode(reviews.error));
			return;
		}
		if (reviews.length === 0) {
			var div = document.getElementById("modreviews");
			div.parentNode.removeChild(div);
			var div = document.getElementById("communityreviews");
			div.parentNode.removeChild(div);
			var msg = document.getElementById("message");
			msg.style.display = "inline-block";
			var h3 = msg.appendChild(document.createElement("h3"));
			h3.appendChild(document.createTextNode("Noone has reviewed this website yet."));
		}
		for (var k = 0; k < reviews.length; k++) {
			var target = (reviews[k].modVerified) ? document.getElementById("modreviews") : document.getElementById("communityreviews");
			if (reviews[k].modVerified) {
				if (!modadded) {
					var div = document.getElementById("modreviews");
					var h3 = div.appendChild(document.createElement("h3"));
					h3.appendChild(document.createTextNode("Approved reviews."));
					modadded = true;
				}
			} else {
				if (!comadded) {
					var div = document.getElementById("communityreviews");
					var h3 = div.appendChild(document.createElement("h3"));
					h3.appendChild(document.createTextNode("Community reviews."));
					comadded = true;
				}
			}
			target.appendChild(reviewPlugin.getDomReview(reviews[k]));
		}
	});
});

var removeList = document.getElementsByClassName("remove");
while (removeList[0]) {
	removeList[0].parentNode.removeChild(removeList[0]);
}