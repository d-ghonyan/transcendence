class Paddle {
	constructor(x, y, width=DEFAULTS.paddleWidth, height=DEFAULTS.paddleHeight, speed=DEFAULTS.paddleSpeed) {
		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;
		this.speed = speed;

		this.effects = {};
	}

	draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height, 'white');
	}

	moveUp() {
		if (this.y > 0) {
			this.y -= this.speed;
		}
	}

	moveDown(canvasHeight) {
		if (this.y + this.height < canvasHeight) {
			this.y += this.speed;
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
