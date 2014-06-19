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

reviewPlugin.getReview(urlParams.id, function (review) {
	var msg = document.getElementById("message");
	msg.style.display = "none";
	if (review.error) {
		msg.style.display = "inline-block";
		msg.innerText = review.error;
		return;
	}
	if (review.length < 1) {
		msg.style.display = "inline-block";
		msg.innerText = "This review is not available, either because it has been removed, made invisible or has simply never existed.";
		return;
	}
	review[0].longDescription = review[0].longDescription || "No long description available.";
	document.getElementById("reviewTarget").appendChild(reviewPlugin.getDomReview(review[0]));
});