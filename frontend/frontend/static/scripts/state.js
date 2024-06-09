function updateState(state)
{
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

	if (e.state.url === "/game")
	{
		changePageContent(page_data['game'].html);

		startGame(e.state.mode, gameSettings);

		return ;
	}
	else if (gameAnimationId)
	{
		cancelAnimationFrame(gameAnimationId);

		document.removeEventListener('keydown', globalListeners['keydown']);
		document.removeEventListener('keyup', globalListeners['keyup']);

		gameAnimationId = null;
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
			updateState({ page: page_data['home'], url: "/home" });
			return ;
		}
	}

	if (e.state)
	{
		changePageContent(e.state.page.html);
		window[e.state.onload]?.();
	}
});
