window.addEventListener('popstate', (e) => {
	e.preventDefault();

	if (e.state)
	{
		document.body.innerHTML = e.state.innerHtml;
	}
});

window.addEventListener('load', () => {
	History.pushState({ innerHtml: document.body.innerHTML }, "", "login_page");
});

window.addEventListener('DOMContentLoaded', () => {
	
});