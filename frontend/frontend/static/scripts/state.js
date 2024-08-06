const resetGameAnimation = () => {
	if (gameAnimationId)
	{
		cancelAnimationFrame(gameAnimationId);
	
		document.removeEventListener('keydown', globalListeners['keydown']);
		document.removeEventListener('keyup', globalListeners['keyup']);
	
		gameAnimationId = null;
	}
}

function updateState(state)
{
	resetGameAnimation();
	pushState(state, state.url);

	const page = state.page;

	changePageContent(page.html);

	window[state.onload]?.();
}

function appendScript(container, js)
{
	const script = document.createElement("script");
	script.textContent = js;

	container.appendChild(script);
}

function changePageContent(html)
{
	const container = document.getElementById("container");
	container.innerHTML = html;
	
	updateLanguage()
	return container;
}

window.addEventListener('popstate', async (e) => {
	e.preventDefault();

	if (!e.state)
	{
		const page = getUser() ? "home" : "login";
		updateState({ page: page_data[page], url: `/${page}` });
		return ;
	}

	if (e.state.url === "/game")
	{
		changePageContent(page_data['game'].html);

		startGame(e.state.mode, e.state.settings, e.state.tournament);

		return ;
	}
	else if (gameAnimationId)
	{
		resetGameAnimation();
	}

	if (!getUser())
	{
		window.location.href = '/login';
		return ;
	}
	else
	{
		if (e.state.url === "/login")
		{
			updateState({ page: page_data['home'], url: "/home", onload: "homeOnload" });
			return ;
		}
	}

	if (e.state)
	{
		changePageContent(e.state.page.html);
		window[e.state.onload]?.();
	}
});
