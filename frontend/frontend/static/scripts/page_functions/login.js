const showHideTabs = ({ show, hide, showPills, hidePills }) => {
	show.classList.add('active');
	hide.classList.remove('active');

	showPills.classList.add('show');
	showPills.classList.add('active');
	hidePills.classList.remove('show');
	hidePills.classList.remove('active');
}

function loginOnload () {

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

	const res = await fetch(`${auth_url}/login/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password })
	});

	const data = await res.json();

	if (data.status === 200)
	{
		storeUser(data);
		storeLang(data.language);
		lang = data.language;
		updateLanguage();
		updateState({ page: page_data['home'], url: "/home", onload: "homeOnload" });
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

	const res = await fetch(`${auth_url}/register/`, {
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

// 	struct Match {
// 		string user1;
// 		string user2;
// 		uint256 score1;
// 		uint256 score2;
// 		string winner;
// 	}
// */

// 	const res = fetch(`${auth_url}/add_tournament/`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json"
// 		},
// 		body: JSON.stringify({
// 			matches: [
// 				{
// 					user1: "user1",
// 					user2: "user2",
// 					score1: 0,
// 					score2: 0,
// 					winner: "valod"
// 				},
// 				{
// 					user1: "user15",
// 					user2: "user25",
// 					score1: 0,
// 					score2: 0,
// 					winner: "valod"
// 				}
// 			],
// 			winner: "Edgar",
// 		})
// 	})