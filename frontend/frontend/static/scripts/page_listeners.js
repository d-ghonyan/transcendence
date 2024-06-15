const events = {
	login_tab,
	register_tab,
	login_button,
	register_button,
	logout_button,
	startGame,
<<<<<<< HEAD:src/src/static/scripts/page_listeners.js
	intra_button,
	submit_button,
	language_select_popup_change,
	ImageFileAccess_change
=======
	reset_button,
	tournament_button,
	start_button,
	overlay,
	start_button,
>>>>>>> 41d29b56fe2488f0720327adac2b23a034ebca9e:frontend/frontend/static/scripts/page_listeners.js
}

document.addEventListener('click', async (e) => {
	// e.preventDefault();
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
		updateState({ page: page_data['game'], url: "/game", mode: e.target.id, tournament: false });
		startGame(e.target.id, gameSettings, false);
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
	
	events[`${e.target.id}_input`]?.(e);
});

document.addEventListener('change', async (e) => {
	// e.preventDefault();
	events[`${e.target.id}_change`]?.(e);
});