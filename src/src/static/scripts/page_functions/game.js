const startGame = (gameMode) => {
	const canvas = document.getElementById('gameCanvas');

	const ctx = canvas.getContext('2d');
	const paddleWidth = 10;
	const paddleHeight = 80;
	const ballSize = 10;
	const winningScore = Infinity;

	let player1Score = 0;
	let player2Score = 0;

	const paddleSpeed = 15;

	canvas.width = canvasSize[gameMode].w;
	canvas.height = canvasSize[gameMode].h;
	const mode = gameOptions({ canvas, paddleWidth, paddleHeight })[gameMode];

	const paddles = [];
	for (let i = 1; i <= mode.playerCount; i++) {
		const paddle = new Paddle(
			mode.paddlePositions[`player${i}`].x,
			mode.paddlePositions[`player${i}`].y,
			paddleWidth,
			paddleHeight,
			paddleSpeed,
		);
		paddles.push(paddle);
	}

	const controller = {};

	for (const control in mode.controls)
	{
		const index = parseInt(control[control.length - 1]) - 1;

		controller[mode.controls[control].up] = { index, func: 'moveUp', pressed: false };
		controller[mode.controls[control].down] = { index, func: 'moveDown', pressed: false };
	}

	let ball = new Ball(canvas.width / 2, canvas.height / 2, ballSize, 5, 5);

	let paddleCollided;

	function draw() {

		paddleCollided = false;
		runPressedButtons(paddles);
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		paddles.forEach(paddle => {
			paddle.draw(ctx);
		});

		ball.draw(ctx);

		drawScore();

		ball.x += ball.speedX;
		ball.y += ball.speedY;

		paddles.forEach(paddle => {
			if (ball.collidesWithPaddle(paddle)) {
				ball.speedX = -ball.speedX;
				let deltaY = ball.y - (paddle.y + paddle.height / 2);
				ball.speedY = deltaY * 0.35;

				paddleCollided = true;
			}
		});

		if (!paddleCollided && ball.collidesWithWalls(canvas.width, canvas.height)) {
			ball.speedY = -ball.speedY;
		}

		if (ball.x < 0) {
			player2Score++;
			ball.reset(canvas);
		} else if (ball.x > canvas.width) {
			player1Score++;
			ball.reset(canvas);
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

	draw();
}