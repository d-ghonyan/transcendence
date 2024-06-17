const clamp = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
}

function homeOnload() {
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
			if (gameSettings.powerups.includes(input.name))
				input.setAttribute("checked", "checked");
			else
				input.removeAttribute("checked");
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
			});
		});
	});

	showTournaments();
}

const showTournaments = async () => {
	const tournamentContainer = document.getElementById('tournament_container');
	const tournaments = await getTournaments();

	const headerDiv = document.createElement('div');
	headerDiv.classList.add('tournament-header');

	const headerH2 = document.createElement('h2');
	headerH2.classList.add( tournaments?.length ? 'tournaments_text' : 'no_tournaments_text');

	headerDiv.appendChild(headerH2);
	tournamentContainer.appendChild(headerDiv);

	tournaments?.forEach(tournament => {
		const tournamentEntry = document.createElement('div');
		tournamentEntry.classList.add('tournment-entry');

		const matchesDiv = document.createElement('div');
		matchesDiv.classList.add('matches', 'w-100', 'd-flex', 'justify-content-center', 'flex-wrap');

		for (const match of tournament[0]) {
			const scoresDiv = document.createElement('div');
			scoresDiv.classList.add('scores', 'd-flex', 'justify-content-between', 'align-items-center');

			const score1Div = document.createElement('div');
			score1Div.classList.add('score1');

			const username1Div = document.createElement('div');
			username1Div.classList.add('username');

			username1Div.textContent = match[0];
			const score1TextDiv = document.createElement('div');

			score1TextDiv.classList.add('score_text');
			score1TextDiv.textContent = match[2];
			score1Div.appendChild(username1Div);
			score1Div.appendChild(score1TextDiv);

			const score2Div = document.createElement('div');
			score2Div.classList.add('score2');

			const username2Div = document.createElement('div');
			username2Div.classList.add('username');
			username2Div.textContent = match[1];

			const score2TextDiv = document.createElement('div');
			score2TextDiv.classList.add('score_text');
			score2TextDiv.textContent = match[3];

			score2Div.appendChild(username2Div);
			score2Div.appendChild(score2TextDiv);

			scoresDiv.appendChild(score1Div);
			scoresDiv.appendChild(score2Div);
			matchesDiv.appendChild(scoresDiv);
		}

		const winnerDiv = document.createElement('div');
		winnerDiv.classList.add('winner');

		const winnerUsernameDiv = document.createElement('div');
		winnerUsernameDiv.classList.add('username');
		winnerUsernameDiv.textContent = tournament[1];

		const winnerTextDiv = document.createElement('div');
		winnerTextDiv.classList.add('winner_text');

		winnerDiv.appendChild(winnerUsernameDiv);
		winnerDiv.appendChild(winnerTextDiv);

		matchesDiv.appendChild(winnerDiv);
		tournamentEntry.appendChild(matchesDiv);
		tournamentContainer.appendChild(tournamentEntry);
	});

	updateLanguage();
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
	gameSettings = resetSettings();

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
			return;
		}

		if (username === getUser()) {
			curr_user_found = true;
		}
	}

	if (!curr_user_found) {
		showErrorMessage("The logged in user should be present in the tournament.");
		return;
	}

	const username_set = new Set(username_values);
	if (username_set.size !== username_values.length) {
		showErrorMessage("Please enter unique usernames.");
		return;
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