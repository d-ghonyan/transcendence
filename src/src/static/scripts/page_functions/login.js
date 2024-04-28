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

	return {
		show: registerTab,
		hide: loginTab,
		showPills: registerPills,
		hidePills: loginPills,
	}
}

const hideErrorMessage = () => {
	document.getElementById("error").classList.add("hide");
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

	if (data.status === 200)
	{
		localStorage.setItem("token", data.token);
		localStorage.setItem("refreshtoken", data.refreshtoken);
		updateState({ page: page_data['homepage'], url: "/home" });
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
