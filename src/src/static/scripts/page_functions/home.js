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
let 	prefered_lang = lang
const submit_button = async (e) => {
	
	//update language
	lang = prefered_lang
	updateLanguage()
	const username_value = document.querySelector('.username_input').value
	const password_value = document.querySelector('.password_input').value
	const repeat_password_value = document.querySelector('.repeat_password_input').value
	const file_input = document.querySelector('.file_input').value
	console.log("logged in user is ", getUser())
	
	//send request to save 
	const res = await fetch(`${api_url}/user/update/`, {
		method: "POST",
		headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getUser().token}`
        },
		body: JSON.stringify({ username_value, password_value, repeat_password_value, file_input})
	});

	// const data = await res.json();
	console.log('username_value', username_value)
	console.log('password_value', password_value)
	console.log('repeat_password_value', repeat_password_value)
	console.log('file_input', file_input)

	document.getElementById('settings_popup'.replace("_close_button", "_popup")).style.display = "none";
	document.getElementById("overlay").style.display = "none";
}

const language_select_popup_change = (e) => {
	prefered_lang = e.target.value || lang ;
}


