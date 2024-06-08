class MovingObject {
	constructor(x, y, radius, speedX, speedY) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speedX = speedX;
		this.speedY = speedY;
		this.active = true;
		this.color = this.getColor();
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();

		this.move();
	}

	getColor() {
		return 'white';
	}

	move() {
		this.x += this.speedX;
		this.y += this.speedY;
	}

	updatePosition(canvasWidth, canvasHeight) {
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
			this.speedY = -this.speedY;
		}
		if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
			this.speedX = -this.speedX;
		}
	}

	collidesWithPaddle(paddle) {
		let distX = Math.abs(this.x - paddle.x - paddle.width / 2);
		let distY = Math.abs(this.y - paddle.y - paddle.height / 2);

		if (distX > (paddle.width / 2 + this.radius)) return false;
		if (distY > (paddle.height / 2 + this.radius)) return false;

		if (distX <= (paddle.width / 2)) return true;
		if (distY <= (paddle.height / 2)) return true;

		let dx = distX - paddle.width / 2;
		let dy = distY - paddle.height / 2;

		return (dx * dx + dy * dy <= (this.radius * this.radius));
	}

	collidesWithWalls(canvasHeight) {
		return this.y < 0 || this.y > canvasHeight;
	}
}
