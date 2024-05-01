const startGame = (gameMode) => {
	updateState({ page: page_data['game'], url: "/game" });

	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	const paddleWidth = 10;
	const paddleHeight = 80;
	const ballSize = 10;
	const winningScore = 15;

	let player1Score = 0;
	let player2Score = 0;
	
	const paddleSpeed = 15;

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

	let ball = new Ball(canvas.width / 2, canvas.height / 2, ballSize, 5, 5);

	function draw() {
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
			}
		});

		if (ball.collidesWithWalls(canvas.width, canvas.height)) {
			ball.speedY = -ball.speedY;
		}

		if (ball.x - ball.radius < 0) {
			player2Score++;
			ball.reset(canvas);
		} else if (ball.x + ball.radius > canvas.width) {
			player1Score++;
			ball.reset(canvas);
		}

		if (player1Score === winningScore || player2Score === winningScore) {
			alert(`${player1Score > player2Score ? 'Player 1' : 'Player 2'} wins!`);
			resetScore();
		}

		requestAnimationFrame(draw);
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

	function modeControls(e) {
		const controls = mode.controls;

		for (const control in controls) {

			const index = parseInt(control[control.length - 1]) - 1;

			if (e.key === controls[control].up) {
				paddles[index].moveUp();
			} else if (e.key === controls[control].down) {
				paddles[index].moveDown(canvas.height);
			}
		}
	}

	document.addEventListener('keydown', modeControls);

	draw();
}