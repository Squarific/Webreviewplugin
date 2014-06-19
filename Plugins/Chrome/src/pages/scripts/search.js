var urlParams;
window.onpopstate = setUrlParams;
function setUrlParams () {
    var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
}
setUrlParams();

var searchbar = document.getElementById("searchbar");
searchbar.focus();
searchbar.addEventListener("keyup", function (event) {
	if (window.history) {
		window.history.pushState("Search", "Search Review " + document.getElementById("searchbar").value, "index.html?q=" + encodeURIComponent(document.getElementById("searchbar").value));	
		updateSearch();
	} else {
		location.assign("index.html?q=" + encodeUriComponent(document.getElementById("searchbar").value));
	}
});

document.getElementById("searchbutton").addEventListener("click", function () {
	if (window.history) {
		window.history.pushState("Search", "Search Review " + document.getElementById("searchbar").value, "index.html?q=" + encodeURIComponent(document.getElementById("searchbar").value));
		updateSearch();
	} else {
		location.assign("index.html?q=" + encodeUriComponent(document.getElementById("searchbar").value));
	}
});

document.getElementById("searchbutton2").addEventListener("click", function () {
	if (window.history) {
		window.history.pushState("Search", "Search Review " + document.getElementById("searchbar").value, "index.html?q=" + encodeURIComponent(document.getElementById("searchbar").value));
		updateSearch();
	} else {
		location.assign("index.html?q=" + encodeUriComponent(document.getElementById("searchbar").value));
	}
});

if (urlParams.q) {
	document.getElementById("searchbar").value = urlParams.q;
	updateSearch();
}

function updateSearch () {
	setUrlParams();
	if (urlParams.q) {
		var searchcontainer = document.getElementById("searchcontainer");
		document.getElementById("querywebsite").innerText = urlParams.q || " this website";
		document.getElementById("reviewsContainer").classList.remove("hidden");
		document.getElementById("searchbutton").classList.add("hidden");
		document.getElementById("searchbutton2").classList.remove("hidden");
		searchcontainer.classList.add("searchtopbarcontainer");
		searchcontainer.style.marginBottom = "0px";
		searchcontainer.style.marginTop = "20px";
		reviewPlugin.search(urlParams.q, function (reviews) {
			var reviewsTarget = document.getElementById("reviewsTarget");
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
			}
			while (reviewsTarget.firstChild) {
				reviewsTarget.removeChild(reviewsTarget.firstChild);
			}
			for (var k = 0; k < reviews.length; k++) {
				reviewsTarget.appendChild(reviewPlugin.getDomReview(reviews[k]));
			}
			
		});
	}
}