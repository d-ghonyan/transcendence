window.addEventListener('popstate', (e) => {
	e.preventDefault();

	if (e.state)
	{
		document.body.innerHTML = e.state.innerHtml;
	}
});

window.addEventListener('DOMContentLoaded', () => {
	
});