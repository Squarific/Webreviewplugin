var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

var searchbar = document.getElementById("searchbar");
searchbar.focus();
searchbar.addEventListener("keydown", function (event) {
	if (event.keyCode === 13) {
		location.assign("search.html?q=" + document.getElementById("searchbar").value);
	}
});

document.getElementById("searchbutton").addEventListener("click", function () {
	location.assign("search.html?q=" + document.getElementById("searchbar").value);
});

if (urlParams.q) {
	document.getElementById("searchbar").value = urlParams.q;
	reviewPlugin.search(urlParams.q, function (reviews) {
		var msg = document.getElementById("message");
		msg.style.display = "none";
		if (reviews.error) {
			msg.style.display = "inline-block";
			msg.innerText = reviews.error;
			return;
		}
		if (reviews.length < 1) {
			msg.style.display = "inline-block";
			msg.innerText = "No reviews matched your query.";
			return;
		}
		for (var k = 0; k < reviews.length; k++) {
			document.getElementById("reviewsTarget").appendChild(reviewPlugin.getDomReview(reviews[k]));
		}
	});
}