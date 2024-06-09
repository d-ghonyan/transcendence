class Ball extends MovingObject {
	constructor(x, y, radius, speedX, speedY) {
		super(x, y, radius, speedX, speedY);

		this.redraw = true;
	}

	getColor() {
		return 'white';
	}

	async reset(canvas) {

		this.redraw = false;
		await new Promise(r => setTimeout(r, 300));
		this.redraw = true;

		this.move();
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = -this.speedX;
		this.speedY = getRandomSpeed();
	}
}
