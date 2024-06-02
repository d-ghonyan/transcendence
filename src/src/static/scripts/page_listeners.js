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
	// console.log("INSIDE CLICK")
	e.preventDefault();
	if (e.target.id.includes('popup'))
	{
		console.log("INSIDE CLICK1")
		openPopup(e);
	}
	else if (e.target.id.includes("close_button"))
	{
		closePopup(e);
		console.log("INSIDE CLICK2")
	}
	else if (e.target.id.includes("vs"))
	{
		updateState({ page: page_data['game'], url: "/game", mode: e.target.id });
		startGame(e.target.id);
		console.log("INSIDE CLICK3")
	}
	else if (e.target.id.includes("submit_button"))
	{
		console.log("INSIDE CLICK4")
		// in intra
	}
	else
	{
		console.log(e.target.id)
		events[e.target.id]?.(e);
	}
});

document.addEventListener('input', async (e) => {
	e.preventDefault();
	// if (document.getElementById("error").classList.contains("hide") === false)
	hideErrorMessage();
	
	// events[`${e.target.id}_input`]?.(e);
});

