const events = {
	login_tab,
	register_tab,
	login_button,
	register_button,
}

document.addEventListener('click', async (e) => {
	e.preventDefault();

	events[e.target.id]?.();
});
