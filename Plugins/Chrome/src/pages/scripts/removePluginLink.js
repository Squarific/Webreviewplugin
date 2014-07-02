if (chrome.tabs) {
	var removeList = [document.getElementById("pluginlink"), document.getElementById("pluginlinksmall")];
	var topbar = document.getElementById("topbar");
	if (topbar) {
		topbar.classList.add("removeOnPluginSmallScreen");
	}
	setTimeout(function () {
		document.body.style.minWidth = "500px";
	}, 0); //Putting it in a settimeout fixes some chrome scrollbar bugs
} else {
	removeList = document.getElementsByClassName("newtabbutton");
}
while (removeList[0]) {
	removeList[0].parentNode.removeChild(removeList[0]);
	removeList.splice(0, 1);
}