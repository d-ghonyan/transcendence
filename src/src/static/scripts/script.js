const loginTab = document.getElementById("tab-login");
const registerTab = document.getElementById("tab-register");

const loginPills = document.getElementById("pills-login");
const registerPills = document.getElementById("pills-register");

const showLoginTab = () => {
	loginTab.classList.add('active');
	registerTab.classList.remove('active');

	loginPills.classList.add('show');
	loginPills.classList.add('active');
	registerPills.classList.remove('show');
	registerPills.classList.remove('active');
}

loginTab.onclick = async (e) => {
	document.getElementsByClassName('intra')[0].innerHTML = intra_login;
	// showLoginTab();
}

registerTab.onclick = async (e) => {
	registerTab.classList.add('active');
	loginTab.classList.remove('active');

	registerPills.classList.add('show');
	registerPills.classList.add('active');
	loginPills.classList.remove('show');
	loginPills.classList.remove('active');
}

const form = document.getElementById("signin");
const registerForm = document.getElementById("register");

form.onsubmit = async (e) => {

	e.preventDefault();

	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	if (username === "" || password === "") {
		showErrorMessage("Please fill all fields");
		return ;
	}

	const res = await fetch("http://localhost:8000/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password })
	});

	const data = await res.json();

	if (data.status === 200)
	{
		// window.location.href = "http://localhost:8000/home/";
	}
}

registerForm.onsubmit = async (e) => {
	
	e.preventDefault();

	const username = document.getElementById("registerUsername").value;
	const password = document.getElementById("registerPassword").value;
	const repeat_password = document.getElementById("registerRepeatPassword").value;

	if (username === "" || password === "" || repeat_password === "")
	{
		showErrorMessage("Please fill all fields");
		return ;
	}

	const res = await fetch("http://localhost:8000/register/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password, repeat_password }),
	});

	const data = await res.json();

	console.log(data);

	if (data.status === 200)
		showLoginTab();
	alert(data.message);
}

document.getElementById("username").oninput = hideErrorMessage;
document.getElementById("password").oninput = hideErrorMessage;

function hideErrorMessage()
{
	document.getElementById("error").classList.add("hide");
}

function showErrorMessage(error)
{
	if (error)
	{
		document.getElementById("error").innerText = error;
		document.getElementById("error").classList.remove("hide");
	}
}
