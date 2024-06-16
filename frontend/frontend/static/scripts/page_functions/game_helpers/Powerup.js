class Powerup extends MovingObject {
	constructor(x, y, effectTypes) {

		const speedX = Math.random() < 0.5 ? 5 : -5;
		super(x, y, DEFAULTS.ballSize, speedX, getRandomSpeed());

		this.effectTypes = effectTypes || ['shrink', 'grow', 'slowDown', 'speedUp'];
		this.effectType = this.effectTypes[Math.floor(Math.random() * this.effectTypes.length)];
		this.effectDuration = 7000;
		this.radius = DEFAULTS.ballSize;
		this.timeout = null;
		this.paddleProperty = this.getPaddleProperty();
		this.color = COLORS[this.effectType];
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

	applyEffect(paddle) {
		if (paddle.effects[this.paddleProperty])
		{
			clearTimeout(paddle.effects[this.paddleProperty].timerId);
			this.revertEffect(paddle);
		}

		switch (this.effectType) {
			case 'shrink':
				paddle.height /= 2;
				break ;
			case 'grow':
				paddle.height *= 2;
				break ;
			case 'slowDown':
				paddle.speed /= 1.5;
				break ;
			case 'speedUp':
				paddle.speed *= 1.5;
				break ;
		}

		paddle.effects[this.paddleProperty] = new Timer(() => this.revertEffect(paddle), this.effectDuration);
	}

	revertEffect(paddle) {
		switch (this.effectType) {
			case 'shrink':
			case 'grow':
				paddle.height = gameSettings.paddleHeight;
				break ;
			case 'slowDown':
			case 'speedUp':
				paddle.speed = gameSettings.paddleSpeed;
				break ;
		}
		delete paddle.effects[this.paddleProperty];
	}
}
