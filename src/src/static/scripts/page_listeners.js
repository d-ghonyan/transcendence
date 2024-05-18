const events = {
	login_tab,
	register_tab,
	login_button,
	register_button,
	logout_button,
	overlay,
	startGame,
	intra_button,
	submit_button
}

document.addEventListener('click', async (e) => {
	e.preventDefault();
	if (e.target.id.includes('popup'))
	{
		openPopup(e);
	}
	else if (e.target.id.includes("close_button"))
	{
		closePopup(e);
	}
	else if (e.target.id.includes("vs"))
	{
		updateState({ page: page_data['game'], url: "/game", mode: e.target.id });
		startGame(e.target.id);
	}
	else if (e.target.id.includes("submit_button"))
	{
		
	}
	else
	{
		events[e.target.id]?.(e);
	}
});

document.addEventListener('input', async (e) => {
	e.preventDefault();

	// if (document.getElementById("error").classList.contains("hide") === false)
	hideErrorMessage();
	
	// events[`${e.target.id}_input`]?.(e);
});

