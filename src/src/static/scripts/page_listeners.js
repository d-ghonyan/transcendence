const events = {
	login_tab,
	register_tab,
	login_button,
	register_button,
	logout_button,
	overlay,
}

document.addEventListener('click', async (e) => {
	e.preventDefault();

	if (e.target.id.includes("popup"))
	{
		openPopup(e);
	}
	else if (e.target.id.includes("close_button"))
	{
		closePopup(e);
	}
	else
	{
		events[e.target.id]?.(e);
	}
});


document.addEventListener('input', async (e) => {
	e.preventDefault();

	// if (e.target.id === "username" || e.target.id === "password")
	// hideErrorMessage();
	events[`${e.target.id}_input`]?.(e);
});
