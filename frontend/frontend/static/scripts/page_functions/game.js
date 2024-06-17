class Game {
	constructor(gameMode, settings, tournament=false) {
		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.matches = [];
		this.matchIndex = 0;
		this.tournament = tournament;
		this.tournamentFinished = false;
		
		this.ballSize = settings.ballSize;
		this.ballSpeed = settings.ballSpeed;
		this.paddleWidth = settings.paddleWidth;
		this.paddleHeight = settings.paddleHeight;
		this.paddleSpeed = settings.paddleSpeed;
		
		this.player1Score = 0;
		this.player2Score = 0;
		this.winningScore = settings.winningScore;
		
		this.gameMode = gameMode;
		this.settings = settings;
		this.setupCanvas();
		
		this.timeoutId = null;
		gameAnimationId = null;

		this.balls = [];
		this.paddles = [];
		this.controller = {};
		this.paddleCollided = [];
		this.powerup = null;
		
		this.mode = gameOptions({
			canvas: this.canvas,
			paddleWidth: this.paddleWidth,
			paddleHeight: this.paddleHeight,
		})[this.gameMode];
	}
	
	start() {
		this.setupControls();
		this.setupPowerupHints();
		this.setupGame();
		this.draw();

		if (this.tournament) this.eliminationGameUsers();
	}
	
	eliminationGameUsers() {
		this.matchIndex = 0;
		const usernames = this.settings.usernames;

		const random_index1 = Math.floor(Math.random() * usernames.length);
		const user1 = usernames[random_index1];
		usernames.splice(random_index1, 1);
		
		const random_index2 = Math.floor(Math.random() * usernames.length);
		const user2 = usernames[random_index2];
		usernames.splice(random_index2, 1);
		
		this.matches.push({ user1, user2 }, { user1: usernames[0], user2: usernames[1] }, {});
		updateControlUsernames([ user1, user2 ]);
	}

	setupCanvas() {
		this.canvas.width = canvasSize[this.gameMode].w;
		this.canvas.height = canvasSize[this.gameMode].h;
	}

	setupControls() {
		for (const control in this.mode.controls) {
			const index = parseInt(control[control.length - 1]) - 1;
			this.controller[this.mode.controls[control].up] = { index, func: 'moveUp', pressed: false };
			this.controller[this.mode.controls[control].down] = { index, func: 'moveDown', pressed: false };
		}

		addListener(document, 'keydown', this.handleKeyDown.bind(this));
		addListener(document, 'keyup', this.handleKeyUp.bind(this));
		addListener(document, 'keydown', this.handlePause.bind(this));

		addControls(this.mode, this.settings.usernames);
	}

	setupPowerupHints() {
		addPowerupHints(this.settings.powerups, powerupConfig);
	}

	setupGame() {
		for (let i = 1; i <= this.mode.playerCount; i++) {
			const paddle = new Paddle(
				this.mode.paddlePositions[`player${i}`].x,
				this.mode.paddlePositions[`player${i}`].y,
				this.paddleWidth,
				this.paddleHeight,
				this.paddleSpeed
			);

			this.paddles.push(paddle);
		}

		for (let i = 0; i < this.mode.ballCount; i++) {
			this.balls.push(new Ball(this.canvas.width / 2, this.canvas.height / 2,
				this.ballSize, i % 2 == 0 ? this.ballSpeed : -this.ballSpeed, getRandomSpeed()));
		}
	}

	async draw() {
		const randomSpawnTimeout = Math.floor(Math.random() * 4000) + 2000;

		if (!this.timeoutId && this.settings.powerups.length > 0) {
			this.timeoutId = new Timer(() => {
				this.powerup = new Powerup(this.canvas.width / 2,
					Math.floor(Math.random() * this.canvas.height), this.settings.powerups);
				this.timeoutId = null;
			}, randomSpawnTimeout);
		}

		this.paddleCollided.length = 0;
		this.runPressedButtons();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawScore();

		this.powerup?.draw(this.ctx);

		this.balls.forEach(ball => {
			if (ball.redraw) ball.draw(this.ctx);
		});

		this.paddles.forEach(paddle => {
			paddle.draw(this.ctx);

			this.balls.forEach((ball, index) => {
				if (!this.paddleCollided[index] && ball.collidesWithPaddle(paddle)) {
					ball.speedX = -ball.speedX;
					let deltaY = ball.y - (paddle.y + paddle.height / 2);
					ball.speedY = deltaY * 0.1;
					this.paddleCollided[index] = true;
				}
			});

			if (this.powerup?.collidesWithPaddle(paddle)) {
				this.powerup.applyEffect(paddle);
				this.powerup = null;
			}
		});

		this.balls.forEach(ball => {
			if (!ball.redraw) return ;

			if (ball.collidesWithWalls(this.canvas.height)) {
				ball.speedY = -ball.speedY;
			}

			if (ball.x < 0) {
				this.player2Score++;
				ball.reset(this.canvas);
			} else if (ball.x > this.canvas.width) {
				this.player1Score++;
				ball.reset(this.canvas);
			}
		});

		if (this.powerup?.collidesWithWalls(this.canvas.height)) {
			this.powerup.speedY = -this.powerup?.speedY;
		}

		if (this.powerup?.x < 0 || this.powerup?.x > this.canvas.width) {
			this.powerup = null;
		}

		if (this.player1Score === this.winningScore || this.player2Score === this.winningScore) {
			let usernames = [this.mode.teamNames.player1, this.mode.teamNames.player2];
			let winner = this.player1Score === this.winningScore ? usernames[0] : usernames[1];

			if (this.tournament && this.matchIndex !== 3) {
				usernames = [this.matches[this.matchIndex + 1]?.user1, this.matches[this.matchIndex + 1]?.user2];

				this.matches[this.matchIndex].winner = this.player1Score === this.winningScore ? this.matches[this.matchIndex].user1 : this.matches[this.matchIndex].user2;
				winner = this.matches[this.matchIndex].winner;
				this.matches[this.matchIndex].score1 = this.player1Score;
				this.matches[this.matchIndex].score2 = this.player2Score;
				this.matchIndex++;

				if (this.matchIndex === 2) {
					this.matches[2].user1 = this.matches[0].winner;
					this.matches[2].user2 = this.matches[1].winner;
					usernames = [this.matches[2].user1, this.matches[2].user2];
				}

				if (this.matchIndex === 3) {
					this.matches[2].winner = this.player1Score === this.winningScore ? this.matches[2].user1 : this.matches[2].user2;
					storeGameScore(this.matches);
					this.tournamentFinished = true;
				}
			}

			showWinner(`${winner} wins!`);
			await new Promise(resolve => setTimeout(resolve, 2500));

			if (this.tournament && !this.tournamentFinished) updateControlUsernames(usernames);
			this.resetScore();

			if (this.tournamentFinished) {
				updateState({ page: page_data["home"], url: "/home", onload: "homeOnload" });
				return ;
			}
		}

		gameAnimationId = requestAnimationFrame(this.draw.bind(this));
	}

	drawScore() {
		this.ctx.fillStyle = 'white';
		this.ctx.font = '20px Arial';
		this.ctx.fillText(`Score 1: ${this.player1Score}`, 40, 30);
		this.ctx.fillText(`Score 2: ${this.player2Score}`, this.canvas.width - 140, 30);
	}

	resetScore() {
		this.player1Score = 0;
		this.player2Score = 0;
	}

	handleKeyDown(e) {
		this.controller[e.key] && (this.controller[e.key].pressed = true);
	}

	handleKeyUp(e) {
		this.controller[e.key] && (this.controller[e.key].pressed = false);
	}

	handlePause(e) {
		if (e.key === 'p') {
			if (gameAnimationId) {
				this.paddles.forEach(paddle => this.pausePaddleEffects(paddle));
				cancelAnimationFrame(gameAnimationId);
				gameAnimationId = null;
			} else {
				this.paddles.forEach(paddle => this.resumePaddleEffects(paddle));
				gameAnimationId = requestAnimationFrame(this.draw.bind(this));
			}
		}
	}

	runPressedButtons() {
		Object.keys(this.controller).forEach(key => {
			const cont = this.controller[key];
			const index = cont.index;
			const func = cont.func;
			cont.pressed && this.paddles[index][func](this.canvas.height);
		});
	}

	pausePaddleEffects(paddle) {
		for (const effect in paddle.effects) {
			paddle.effects[effect].pause();
		}
	}

	resumePaddleEffects(paddle) {
		for (const effect in paddle.effects) {
			paddle.effects[effect].resume();
		}
	}
}

function gameOnload () {

}

const startGame = (gameMode, settings, tournament=false) => {
	const game = new Game(gameMode, settings, tournament);
	game.start();
}

const updateControlUsernames = (usernames) => {
	const oddContainer = document.getElementsByClassName('odd-container')[0];
	const evenContainer = document.getElementsByClassName('even-container')[0];

	oddContainer.getElementsByTagName('h3')[0].innerText = usernames[0];
	evenContainer.getElementsByTagName('h3')[0].innerText = usernames[1];
}

function addControls(gameOptions, usernames)
{
	const oddContainer = document.getElementsByClassName('odd-container')[0];
	const evenContainer = document.getElementsByClassName('even-container')[0];

	for (let i = 1; i <= gameOptions.playerCount; i++)
	{
		let controlHTML = `<h3>Player ${i}</h3>`;
		const player = gameOptions.controls[`player${i}`];

		controlHTML += `<p>${player.up}</p>`;
		controlHTML += `<p>${player.down}</p>`;

		(i % 2 === 0 ? evenContainer : oddContainer).innerHTML += controlHTML;
	}	
}

const addPowerupHints = (powerupTypes, config) => {
	const powerupHints = document.getElementById('powerups');

	for (const type of powerupTypes)
	{
		const powerup = config[type];
		const powerupHint = document.createElement('div');

		const color = document.createElement('div');
		const description = document.createElement('span');

		powerupHint.classList.add('powerup-hint');
		description.classList.add('powerup-description', `${type}_desc_text`);
		color.classList.add('powerup-color');

		color.style.backgroundColor = powerup.color;
		description.innerText = powerup.description;

		powerupHint.appendChild(color);
		powerupHint.appendChild(description);
		powerupHints.appendChild(powerupHint);
	}

	updateLanguage();
}
