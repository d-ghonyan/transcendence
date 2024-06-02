const showHideTabs = ({ show, hide, showPills, hidePills }) => {
	show.classList.add('active');
	hide.classList.remove('active');

	showPills.classList.add('show');
	showPills.classList.add('active');
	hidePills.classList.remove('show');
	hidePills.classList.remove('active');
}

const tabs = () => {
	return {
		loginTab: document.getElementById("login_tab"),
		registerTab: document.getElementById("register_tab"),
		loginPills: document.getElementById("pills_login"),
		registerPills: document.getElementById("pills_register"),
	}
}

const showLogin = () => {
	hideErrorMessage()
	document.getElementById("username").value = ""
	document.getElementById("password").value = ""
	const { loginTab, registerTab, loginPills, registerPills } = tabs();

	return {
		show: loginTab,
		hide: registerTab,
		showPills: loginPills,
		hidePills: registerPills,
	}
}

const showRegister = () => {
	const { loginTab, registerTab, loginPills, registerPills } = tabs();
	hideErrorMessage()
	document.getElementById("registerUsername").value = ""
	document.getElementById("registerPassword").value = ""
	document.getElementById("registerRepeatPassword").value = ""

	return {
		show: registerTab,
		hide: loginTab,
		showPills: registerPills,
		hidePills: loginPills,
	}
}

const hideErrorMessage = () => {
	document.getElementById("error")?.classList?.add("hide");
}

const showErrorMessage = (error) => {
	if (error)
	{
		document.getElementById("error").innerText = error;
		document.getElementById("error").classList.remove("hide");
	}
}

// id functions

const login_tab = async () => {
	showHideTabs(showLogin());
}

const register_tab = async () => {
	showHideTabs(showRegister());
}

const login_button = async () => {
	console.log("login button inside")
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	

	if (username === "" || password === "")
	{
		showErrorMessage("Please fill all fields");
		return ;
	}

	const res = await fetch(`${api_url}/login/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password })
	});

	const data = await res.json();
	console.log(data)
	if (data.status === 200)
	{
		storeUser(data);
		updateState({ page: page_data['home'], url: "/home" });
	}
	else
		showErrorMessage(data.message);
}

const register_button = async () => {

	const username = document.getElementById("registerUsername").value;
	const password = document.getElementById("registerPassword").value;
	const repeat_password = document.getElementById("registerRepeatPassword").value;

	if (username === "" || password === "" || repeat_password === "")
	{
		showErrorMessage("Please fill all fields");
		return ;
	}

	const res = await fetch(`${api_url}/register/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password, repeat_password }),
	});

	const data = await res.json();

	if (data.status === 200)
		showHideTabs(showLogin());
	else
		showErrorMessage(data.message);
}

const intra_button = async () => {
	const INTRA_AUTH_URL = "https://api.intra.42.fr/oauth/authorize";
	const INTRA_UID = "u-s4t2ud-430a2135c4a1b996b9da9573916078397a9a4caffa71bd6fc3fdf73a1172ddad";
	const REDIRECT = "http://localhost:8000/login";
	const response_type = "code";
	const state = "intra";

	// const intra_full_url = `${INTRA_AUTH_URL}?client_id=${INTRA_UID}&redirect_uri=${REDIRECT}&response_type=${response_type}&state=${state}`
	const intra_full_url = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b112f9315c0ae30458140f0a4c846d64b017ca40cdaf0d9734ddf9f05294660e&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fhome%2F&response_type=code";
	window.location.href = intra_full_url
}
