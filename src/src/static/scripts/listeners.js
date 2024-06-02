window.addEventListener('popstate', async (e) => {
	console.log(e)
	e.preventDefault();

	if (e.state.url === "/game")
	{
		changePageContent(page_data['game'].html);

		startGame(e.state.mode);

		return ;
	}
	else if (gameAnimationId)
	{
		cancelAnimationFrame(gameAnimationId);

		document.removeEventListener('keydown', globalListeners['keydown']);
		document.removeEventListener('keyup', globalListeners['keyup']);

		gameAnimationId = null;
	}

	if (!getUser().token)
	{
		window.location.href = '/login';
		return ;
	}
	else
	{
	
		if (e.state.url === "/login")
		{
			updateState({ page: page_data['home'], url: "/home" });
			return ;
		}
	}

	if (e.state)
	{
		changePageContent(e.state.page.html);
	}
});
