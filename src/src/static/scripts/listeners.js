window.addEventListener('popstate', (e) => {
	e.preventDefault();

	if (e.state)
	{
		changePageContent(e.state.page.html);
	}
});

window.addEventListener('DOMContentLoaded', () => {
	
});