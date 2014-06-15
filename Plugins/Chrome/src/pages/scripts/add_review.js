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

if (chrome && chrome.tabs && typeof chrome.tabs.query === "function" && !urlParams.domain) {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var domain = new URL(tabs[0].url).hostname;
		if (domain.indexOf("www.") === 0) {
			domain = domain.slice(4);
		}
		document.getElementById("domain_input").value = domain;
	});
}

var shortDesc = document.getElementById("shortdesctextarea")
shortDesc.addEventListener("change", updateCount);
shortDesc.addEventListener("keydown", updateCount);
shortDesc.focus();
document.getElementById("emailInput").value = (localStorage.email) ? localStorage.email : "";

function updateCount () {
	document.getElementById("short_desc_lettercount").innerText = this.value.length + "/255";
}


var msg = document.getElementById("statusmessage");
if (urlParams.success === "1") {
	msg.className = "success";
	msg.innerText = "The review has been successfully added!";
} else if (urlParams.success === "2") {
	msg.className = "success";
	msg.innerText = "The review has been successfully added and a new account has been created.";
	localStorage.email = urlParams.email;
} else if (urlParams.error === "1") {
	msg.className = "error";
	msg.innerText = "An error occured while trying to add the review, please try again in a few hours.";
}

if (urlParams.domain) {
	document.getElementById("domain_input").value = urlParams.domain;
}