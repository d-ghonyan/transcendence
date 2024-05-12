class Paddle {
	constructor(x, y, width, height, speed, isPlayerControlled) {
		this.x = x;
		this.y = y;
		this._width = width;
		this.height = height;
		this._speed = speed;
	}

	draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height, 'white');
	}

	get width() {
		return this._width;
	}

	set width(newWidth) {
		this._width = newWidth;
	}

	get speed() {
		return this._speed;
	}

	set speed(newSpeed) {
		this._speed = newSpeed;
	}

	moveUp() {
		if (this.y > 0) {
			this.y -= this._speed;
		}
	}

	moveDown(canvasHeight) {
		if (this.y + this.height < canvasHeight) {
			this.y += this._speed;
		}
	}

	collidesWithBall(ball) {
		return (
			this.x < ball.x + ball.radius &&
			this.x + this.width > ball.x - ball.radius &&
			this.y < ball.y + ball.radius &&
			this.y + this.height > ball.y - ball.radius
		);
	}
}

class Ball {
	constructor(x, y, radius, speedX, speedY) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speedX = speedX;
		this.speedY = speedY;
	}

	draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}

	reset(canvas) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = -this.speedX;

		const rand1 = Math.random() * 10 - 5;
		const rand2 = -rand1;

		this.speedY = Math.random() < 0.5 ? rand1 : rand2;
	}

	collidesWithWalls(canvasWidth, canvasHeight) {
		return this.y < 0 || this.y > canvasHeight;
	}

	collidesWithPaddle(paddle) {
		return (
			this.x - this.radius < paddle.x + paddle.width &&
			this.x + this.radius > paddle.x &&
			this.y < paddle.y + paddle.height &&
			this.y > paddle.y
		);
	}
}

const gameOptions = ({ canvas, paddleWidth, paddleHeight }) => {
	return {
		"vs1": {
			controls: {
				player1: {
					up: 'ArrowUp',
					down: 'ArrowDown'
				},
				player2: {
					up: 'w',
					down: 's'
				}
			},
			paddlePositions: {
				player1: {
					x: 0,
					y: (canvas.height - paddleHeight) / 2
				},
				player2: {
					x: canvas.width - paddleWidth,
					y: (canvas.height - paddleHeight) / 2
				}
			},
			playerCount: 2,
			teamNames: {
				player1: 'Player 1',
				player2: 'Player 2'
			}
		},
		"vs2": {
			controls: {
				player1: {
					up: 'w',
					down: 's'
				},
				player2: {
					up: 'ArrowUp',
					down: 'ArrowDown'
				},
				player3: {
					up: 'i',
					down: 'k'
				},
				player4: {
					up: '8',
					down: '5'
				}
			},
			paddlePositions: {
				player1: {
					x: 0,
					y: paddleHeight
				},
				player2: {
					x: canvas.width - paddleWidth,
					y: paddleHeight
				},
				player3: {
					x: 0,
					y: canvas.height - paddleHeight
				},
				player4: {
					x: canvas.width - paddleWidth,
					y: canvas.height - paddleHeight
				}
			},
			playerCount: 4,
			teamNames: {
				player1: 'Team 1',
				player2: 'Team 2',
			}
		},
		"vs3": {
			controls: {
				player1: {
					up: 'w',
					down: 's'
				},
				player2: {
					up: 'ArrowUp',
					down: 'ArrowDown'
				},
				player3: {
					up: 'i',
					down: 'k'
				},
				player4: {
					up: '8',
					down: '5'
				},
				player5: {
					up: 't',
					down: 'g'
				},
				player6: {
					up: 'o',
					down: 'l'
				}
			},
			paddlePositions: {
				player1: {
					x: 0,
					y: paddleHeight
				},
				player2: {
					x: canvas.width - paddleWidth,
					y: paddleHeight
				},
				player3: {
					x: 0,
					y: (canvas.height - paddleHeight) / 2
				},
				player4: {
					x: canvas.width - paddleWidth,
					y: (canvas.height - paddleHeight) / 2
				},
				player5: {
					x: 0,
					y: canvas.height - paddleHeight
				},
				player6: {
					x: canvas.width - paddleWidth,
					y: canvas.height - paddleHeight
				}
			},
			playerCount: 6,
			teamNames: {
				player1: 'Team 1',
				player2: 'Team 2',
				player3: 'Team 3'
			}
		}
	}
}

const canvasSize = {
	"vs1": {
		w: 800,
		h: 400,
	},
	"vs2": {
		w: 1000,
		h: 600,
	},
	"vs3": {
		w: 1200,
		h: 800,
	},
}
