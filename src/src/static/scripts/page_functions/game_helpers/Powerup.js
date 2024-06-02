class Powerup extends MovingObject {
	constructor(x, y) {

		const speedX = Math.random() < 0.5 ? 5 : -5;
		super(x, y, DEFAULTS.radius, speedX, getRandomSpeed());

		this.effectTypes = ['shrink', 'grow', 'slowDown', 'speedUp'];
		this.effectType = this.effectTypes[Math.floor(Math.random() * this.effectTypes.length)];
		this.effectDuration = 5000;
		this.radius = DEFAULTS.radius;
		this.timeout = null;
		this.paddleProperty = this.getPaddleProperty();

		this.color = this.getColor();
	}

	getPaddleProperty() {
		switch (this.effectType) {
			case 'shrink':
			case 'grow':
				return 'height';
			case 'slowDown':
			case 'speedUp':
				return 'speed';
		}
	}

	getColor() {
		switch (this.effectType) {
			case 'shrink':
				return 'red';
			case 'grow':
				return 'green';
			case 'slowDown':
				return 'blue';
			case 'speedUp':
				return 'yellow';
			default:
				return 'white';
		}
	}

	applyEffect(paddle) {
		if (paddle.effects[this.paddleProperty])
		{
			clearTimeout(paddle.effects[this.paddleProperty]);
		}

		paddle[this.paddleProperty] = POWERUPS[this.effectType];

		paddle.effects[this.paddleProperty] = setTimeout(() => {
			this.revertEffect(paddle);
		}, this.effectDuration);
	}

	revertEffect(paddle) {
		switch (this.effectType) {
			case 'shrink':
			case 'grow':
				paddle.height = DEFAULTS.height;
				break;
			case 'slowDown':
			case 'speedUp':
				paddle.speed = DEFAULTS.speed;
				break;
		}
		paddle.effects[this.paddleProperty] = null;
	}
}
