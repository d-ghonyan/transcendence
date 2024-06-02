class Paddle {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.width = DEFAULTS.width;
		this.height = DEFAULTS.height;
		this.speed = DEFAULTS.speed;

		this.effects = {};
	}

	draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height, 'white');
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
