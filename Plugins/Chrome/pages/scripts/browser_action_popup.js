chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {	var domain = new URL(tabs[0].url).hostname;	document.getElementById("pagestatusdomain").innerText = domain;	document.getElementById("pagestatustext").innerText = (tabs[0].url.indexOf("lukas") !== -1) ? "Awesome website" : "Ok I guess";});