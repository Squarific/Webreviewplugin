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

var shortDesc = document.getElementById("shortdesctextarea")
shortDesc.addEventListener("change", updateCount);
shortDesc.addEventListener("keydown", updateCount);
shortDesc.focus();
document.getElementById("emailInput").value = (localStorage.email) ? localStorage.email : "";

document.getElementById("postReviewButton").addEventListener("click", function () {
	if (this.disabled) return true;
	this.classList.add("disabledButton");
	this.disabled = true;
	var button = this;
	reviewPlugin.postReview({
		email: document.getElementById("emailInput").value,
		reviewedDomain: document.getElementById("domain_input").value,
		shortDescription: document.getElementById("shortdesctextarea").value,
		longDescription: document.getElementById("longdesctextarea").value,
	}, function (response) {
		response = JSON.parse(response);
		var msg = document.getElementById("messageTarget");
		if (response.error) {
			msg.className = "error";
			msg.innerText = response.error;
		} else if (response.success) {
			msg.className = "success";
			msg.innerText = response.success;
		} else {
			msg.className = "error";
			msg.innerText = "Unexpected response: " + response;
			console.log(response);
		}
		button.disabled = false;
		button.classList.remove("disabledButton")
	});
});

function updateCount () {
	document.getElementById("short_desc_lettercount").innerText = this.value.length + "/255";
}

if (urlParams.domain) {
	document.getElementById("domain_input").value = urlParams.domain;
} else {
	document.getElementById("domain_input").focus();
}