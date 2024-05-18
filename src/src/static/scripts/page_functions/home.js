const overlay = () => {
	document.getElementById("overlay").style.display = "none";
	const popups = document.getElementsByClassName("popup");

	for (let i = 0; i < popups.length; i++)
	{
		popups[i].style.display = "none";
	}
}

const openPopup = (e) => {
	const popup = document.getElementById(e.target.id.replace("_button", ""));

	popup.style.display = "block";

	popup.style.top = e.clientY + "px";
	popup.style.left = e.clientX + "px";

	popup.style.zIndex = 3;

	document.querySelector("#overlay").style.display = "block";
}

const closePopup = (e) => {
	document.getElementById(e.target.id.replace("_close_button", "_popup")).style.display = "none";
	document.getElementById("overlay").style.display = "none";
}

const logout_button = async () => {

	clearUser();

	updateState({ page: page_data['login'], url: "/login" });
}

const submit_button = (e) => {
	console.log("here in submit_button")
	updateLanguage()
}