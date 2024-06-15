const clamp = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
}

function homeOnload () {
	const gameSettingInputs = document.querySelectorAll('.range-input');

	gameSettingInputs.forEach(input => {
		if (input.type === 'range') {

			input.min = DEFAULTS[input.name + '_min'];
			input.max = DEFAULTS[input.name + '_max'];
			input.value = gameSettings[input.name];

			const display = document.getElementById(`${input.name}_display`);
			display.innerText = input.value;

			input.addEventListener('input', e => {
				const value = e.target.value;
				const name = e.target.name;
				const display = document.getElementById(`${name}_display`);

				gameSettings[name] = parseInt(value);
				localStorage.setItem('gameSettings', JSON.stringify(gameSettings));

				display.innerText = value;
			});
		}
	});

	const powerupChecks = document.querySelectorAll('.powerup-checks-container');

	powerupChecks.forEach(div => {
		const powerupCheckboxes = div.querySelectorAll('input');
		powerupCheckboxes.forEach(input => {
			input.setAttribute("checked", "checked");
		});
		
		div.addEventListener('click', e => {
			powerupCheckboxes.forEach(input => {
				if (input.hasAttribute("checked")) {
					input.removeAttribute("checked");
				}
				else {
					input.setAttribute("checked", "checked");
				}

				if (input.hasAttribute("checked")) {
					gameSettings.powerups.push(input.name);
				}
				else {
					gameSettings.powerups = gameSettings.powerups.filter(powerup => powerup !== input.name);
				}

				console.log(gameSettings.powerups);
			});
		});
	});

	showTournaments();
}

const showTournaments = async () => {
	// const tournaments = await getTournaments();

	// const tournamentContainer = document.getElementById('tournament_container');

	// if (tournaments.length === 0) {
	// 	tournamentContainer.innerHTML = "<h3>No tournaments found</h3>";
	// }

	// tournaments.forEach(tournament => {

	// 	const users = [ tournament[0], tournament[1] ];
	// 	const scores = [ tournament[2], tournament[3] ];
	// 	const winner = tournament[4];

	// 	// show tournaments in columns
	// 	const column = document.createElement('div');
	// 	column.classList.add('column');

	// 	const tournamentDiv = document.createElement('div');
	// 	tournamentDiv.classList.add('tournament');

	// 	const scoreDiv = document.createElement('div');
	// 	scoreDiv.classList.add('score');

	// 	const username = document.createElement('span');
	// 	username.classList.add('tournament-username');
	// 	username.innerText = users[0];



	// });
}

const getTournaments = async () => {
	try {
		const res = await fetch(`${blockchain_url}/get_tournaments_user/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username: getUser() }),
		});

		const data = await res.json();

		if (data.error)
			throw new Error(data.error);

		return data.data;
	} catch (error) {
		showErrorMessage("Couldn't get tournaments from blockchain: " + error);
	}
}

const logout_button = async () => {
	clearUser();
	clearLang();
	localStorage.removeItem("gameSettings");

	updateState({ page: page_data['login'], url: "/login" });
}

const reset_button = async () => {
	for (const key in gameSettings) {
		gameSettings[key] = DEFAULTS[key];
	}

	const gameSettingInputs = document.querySelectorAll('.range-input');

	gameSettingInputs.forEach(input => {
		if (input.type === 'range') {
			input.value = gameSettings[input.name];

			const display = document.getElementById(`${input.name}_display`);
			display.innerText = input.value;
		}
	});
}

const overlay = () => {
	const overlay = document.getElementById('overlay');
	const tournament_usernames = document.getElementById('tournament_usernames');

	overlay.style.display = "none";
	tournament_usernames.classList.add('hide');

	const usernames = document.querySelectorAll('.tournament-username');
	usernames.forEach(username => {
		username.value = "";
	});
}

const tournament_button = () => {
	const overlay = document.getElementById('overlay');
	const tournament_usernames = document.getElementById('tournament_usernames');

	overlay.style.display = "block";
	tournament_usernames.classList.remove('hide');

	const usernames = document.querySelectorAll('.tournament-username');
	usernames[0].value = getUser();
	usernames[1].value = "b";
	usernames[2].value = "c";
	usernames[3].value = "d";
}

const start_button = async () => {
	let curr_user_found = false;
	const usernames = document.querySelectorAll('.tournament-username');
	
	let username_values = Array.from(usernames).map(username => username.value.trim());
	for (const username of username_values) {
		if (!username) {
			showErrorMessage("Please enter a username for each player.");
			return ;
		}

		if (username === getUser()) {
			curr_user_found = true;
		}
	}

	if (!curr_user_found) {
		showErrorMessage("The logged in user should be present in the tournament.");
		return ;
	}

	const username_set = new Set(username_values);
	if (username_set.size !== username_values.length) {
		showErrorMessage("Please enter unique usernames.");
		return ;
	}

	overlay();
	
	const settings = {
		...TOURNAMENT_SETTINGS,
		usernames: username_values
	}

	updateState({
		page: page_data['game'],
		url: "/game",
		mode: "vs1",
		tournament: true,
		settings
	});

	startGame("vs1", settings, true);
}