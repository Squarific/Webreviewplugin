document.getElementById("loginButton").addEventListener("click", function () {
	if (this.disabled) return true;
	this.classList.add("disabledButton");
	this.disabled = true;
	var button = this;
	reviewPlugin.login(document.getElementById("emailInput").value, document.getElementById("passwordInput").value, function (response) {
		response = JSON.parse(response);
		var msg = document.getElementById("messageTarget");
		if (response.error) {
			msg.className = "error";
			msg.innerText = response.error;
		} else {
			msg.className = "success";
			msg.innerText = "Successfully logged in as " + response.email;
		}
		button.disabled = false;
		button.classList.remove("disabledButton")
	});
});