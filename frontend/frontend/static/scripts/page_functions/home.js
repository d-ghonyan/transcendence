const logout_button = async () => {
	clearUser();

	updateState({ page: page_data['login'], url: "/login" });
}
