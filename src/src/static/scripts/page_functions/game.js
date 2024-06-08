const startGame = (gameMode, settings) => {
	const canvas = document.getElementById('gameCanvas');

	const ctx = canvas.getContext('2d');
	const ballSize = 10;
	const winningScore = Infinity;

	let player1Score = 0;
	let player2Score = 0;

	canvas.width = canvasSize[gameMode].w;
	canvas.height = canvasSize[gameMode].h;
	const mode = gameOptions({
		canvas,
		paddleWidth: DEFAULTS.width,
		paddleHeight: DEFAULTS.height
	})[gameMode];

	addControls(mode);
	addPowerupHints(/* settings.powerupTypes */['shrink'], powerupConfig);

	const balls = [];
	const paddles = [];
	let powerup = null;

	for (let i = 1; i <= mode.playerCount; i++)
	{
		const paddle = new Paddle(
			mode.paddlePositions[`player${i}`].x,
			mode.paddlePositions[`player${i}`].y,
		);

		paddles.push(paddle);
	}

	for (let i = 0; i < mode.ballCount; i++)
	{
		balls.push(new Ball(canvas.width / 2, canvas.height / 2,
						ballSize, i % 2 == 0 ? 5 : -5, getRandomSpeed()));
	}

	const controller = {};

	for (const control in mode.controls)
	{
		const index = parseInt(control[control.length - 1]) - 1;

		controller[mode.controls[control].up] = { index, func: 'moveUp', pressed: false };
		controller[mode.controls[control].down] = { index, func: 'moveDown', pressed: false };
	}

	const paddleCollided = [];

	let timeoutId = null;

	function draw() {
		const randomSpawnTimeout = Math.floor(Math.random() * 4000) + 2000;

		if (/* settings?.powerupTypes.length > 0 &&  */!timeoutId)
		{
			timeoutId = new Timer(() => {
				powerup = new Powerup(canvas.width / 2, 
					Math.floor(Math.random() * canvas.height, /* settings.powerupTypes */));
	
				timeoutId = null;
			}, randomSpawnTimeout);
		}

		paddleCollided.length = 0;
		runPressedButtons(paddles);
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawScore();

		powerup?.draw(ctx);

		balls.forEach(ball => {
			ball.draw(ctx);
		});

		paddles.forEach(paddle => {
			paddle.draw(ctx);

			balls.forEach((ball, index) => {
				if (!paddleCollided[index] && ball.collidesWithPaddle(paddle)) {
					ball.speedX = -ball.speedX;
					let deltaY = ball.y - (paddle.y + paddle.height / 2);
					ball.speedY = deltaY * 0.35;

					paddleCollided[index] = true;
				}
			});

			if (powerup?.collidesWithPaddle(paddle)) {
				powerup.applyEffect(paddle);
				powerup = null;
			}
		});

		balls.forEach(ball => {
			if (ball.collidesWithWalls(canvas.height)) {
				ball.speedY = -ball.speedY;
			}

			if (ball.x < 0) {
				player2Score++;
				ball.reset(canvas);
			} else if (ball.x > canvas.width) {
				player1Score++;
				ball.reset(canvas);
			}
		});

		if (powerup?.collidesWithWalls(canvas.height)) {
			powerup.speedY = -powerup?.speedY;
		}

		if (powerup?.x < 0 || powerup?.x > canvas.width) {
			powerup = null;
		}

		if (player1Score === winningScore || player2Score === winningScore) {
			alert(`${player1Score > player2Score ? 'Player 1' : 'Player 2'} wins!`);
			resetScore();
		}

		gameAnimationId = requestAnimationFrame(draw);
	}

	function drawScore() {
		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText(`${mode.teamNames.player1}: ${player1Score}`, 20, 30);
		ctx.fillText(`${mode.teamNames.player2}: ${player2Score}`, canvas.width - 140, 30);
	}

	function resetScore() {
		player1Score = 0;
		player2Score = 0;
	}

	const handleKeyDown = (e) => {
		controller[e.key] && (controller[e.key].pressed = true)
	}
	
	const handleKeyUp = (e) => {
		controller[e.key] && (controller[e.key].pressed = false)
	}

	const runPressedButtons = (paddles) => {
		Object.keys(controller).forEach(key => {

			const cont = controller[key];
			const index = cont.index;
			const func = cont.func;

			controller[key].pressed && paddles[index][func](canvas.height);
		});
	}

	addListener(document, 'keydown', handleKeyDown);
	addListener(document, 'keyup', handleKeyUp);
	addListener(document, 'keydown', (e) => {
		if (e.key === 'p')
		{
			if (gameAnimationId)
			{			
				paddles.forEach(paddle => pausePaddleEffects(paddle));
				cancelAnimationFrame(gameAnimationId);
				gameAnimationId = null;
			}
			else
			{
				paddles.forEach(paddle => resumePaddleEffects(paddle));
				gameAnimationId = requestAnimationFrame(draw);
			}
		}
	});

	draw();
}

function addControls(gameOptions)
{
	const controls = document.getElementById('controls');

	const oddContainer = document.createElement('div');
	const evenContainer = document.createElement('div');

	controls.appendChild(oddContainer);
	controls.appendChild(evenContainer);

	oddContainer.classList.add('odd-container');
	evenContainer.classList.add('even-container');

	for (let i = 1; i <= gameOptions.playerCount; i++)
	{
		let controlHTML = '';

		controlHTML += `<h3>Player ${i}</h3>`;

		const control = `Player ${i}`;
		const player = gameOptions.controls[`player${i}`];

		controlHTML += `<p>${player.up}</p>`;
		controlHTML += `<p>${player.down}</p>`;

		if (i % 2 === 0)
		{
			evenContainer.innerHTML += controlHTML;
		}
		else
		{
			oddContainer.innerHTML += controlHTML;
		}
	}	
}

const addPowerupHints = (powerupTypes, config) => {
	const powerupHints = document.getElementById('powerups');

	for (const type of powerupTypes)
	{
		const powerup = config[type];
		const powerupHint = document.createElement('div');

		const nameContainer = document.createElement('div');

		const name = document.createElement('span');
		const color = document.createElement('div');
		const description = document.createElement('span');

		nameContainer.classList.add('name-container');
		powerupHint.classList.add('powerup-hint');
		description.classList.add('powerup-description');
		color.classList.add('powerup-color');
		name.classList.add('powerup-hint');

		nameContainer.appendChild(color);
		nameContainer.appendChild(name);

		name.innerText = powerup.name;
		color.style.backgroundColor = powerup.color;
		description.innerText = powerup.description;

		powerupHint.appendChild(nameContainer);
		powerupHint.appendChild(description);

		powerupHints.appendChild(powerupHint);
	}
}

const pausePaddleEffects = (paddle) => {
	for (const effect in paddle.effects)
	{
		paddle.effects[effect].pause();
	}
}

const resumePaddleEffects = (paddle) => {
	for (const effect in paddle.effects)
	{
		paddle.effects[effect].resume();
	}
}