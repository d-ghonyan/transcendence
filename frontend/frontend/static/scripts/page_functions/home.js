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
	console.log(gameSettings);

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
}

const start_button = async () => {
	overlay();

	const tournament_mode = "vs1";
	const tournament_settings = {
		
	}

	updateState({ page: page_data['game'], url: "/game", mode: e.target.id });
	startGame(e.target.id, gameSettings);
}