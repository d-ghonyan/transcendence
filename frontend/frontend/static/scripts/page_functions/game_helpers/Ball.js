class Ball extends MovingObject {
	constructor(x, y, radius, speedX, speedY) {
		super(x, y, radius, speedX, speedY);
	}

	getColor() {
		return 'white';
	}

	reset(canvas) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = -this.speedX;
		this.speedY = getRandomSpeed();
	}
}
