window.addEventListener('popstate', async (e) => {
	e.preventDefault();

	if (!getUser().token)
	{
		window.location.href = '/login';
		return ;
	}
	else
	{
		if (e.state.url === "/login")
		{
			updateState({ page: page_data['homepage'], url: "/homepage" });
			return ;
		}
	}

	if (e.state)
	{
		changePageContent(e.state.page.html);
	}
});
