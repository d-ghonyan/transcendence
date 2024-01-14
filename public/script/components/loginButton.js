export const loginButton = {
	build: () => {
		const div = document.createElement("div");
		div.classList.add('loginButtonContainer');

		div.innerHTML = "<button class='loginButton'>Login</button>";

		return div;
	}
}