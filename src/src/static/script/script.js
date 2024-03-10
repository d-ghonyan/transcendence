const loginButton = document.getElementById("login");

loginButton.onclick = async (e) => {
	window.location = "http://localhost:8000/login/";

	// let cookie = 
}
// import { loginButton } from './components/loginButton.js'

// const publicUrl = 'public';

// const container = document.getElementsByClassName("container")[0];

// const login = loginButton.build();

// const getLogin = async () => {
// 	let res = await fetch(`startPage.html`);
	
// 	const loginPage = await res.text();

// 	return loginPage;
// }

// window.history.pushState({ start: true, innerHtml: await getLogin() }, "", "");

// let currentUrl = "public/";

// login.addEventListener('click', async () => {

// 	/// TODO: add 42 oauth logic

// 	window.location.href = 'startPage.html'

// 	// let res = await fetch(`loginPage.html`);

// 	// const loginPage = await res.text();

// 	// window.history.pushState({ loginPage }, "", "barev/");

// 	// while (container.lastChild)
// 	// {
// 	// 	container.removeChild(container.lastChild);
// 	// }

// 	// container.innerHTML = loginPage;
// })

// window.addEventListener('popstate', (event) => {
// 	while (container.lastChild)
// 	{
// 		container.removeChild(container.lastChild);
// 	}

// 	console.log(event);
// 	container.innerHTML = event.state.innerHtml;
// })

// container.appendChild(login);
