const DEFAULTS = {
	width: 10,
	height: 80,
	speed: 15,
	radius: 10,


	ballSize_min: 5,
	ballSize_max: 20,

	ballSpeed_min: 5,
	ballSpeed_max: 10,
	
	paddleHeight_min: 40,
	paddleHeight_max: 160,
	
	paddleSpeed_min: 6,
	paddleSpeed_max: 25,
	
	paddleWidth_min: 10,
	paddleWidth_max: 30,
};

const POWERUPS = {
	shrink: 40,
	grow: 160,
	slowDown: 6,
	speedUp: 25,
};

const getRandomSpeed = () => {
	const rand = Math.random() * 10 - 5;
	return Math.random() < 0.5 ? rand : -rand;
}

/* 
@params {Object} data
@params {Array} data.matches [{ user1, user2, score1, score2, winner }]
@params {String} data.winner

no this description isn't chatgpt generated
*/
const storeGameScore = async (data) => {

	try {
		const res = await fetch(`${blockchain_url}/add_tournament/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data),
		});
	} catch (error) {
		console.error("Couldn't store data in blockchain: " + error);
		
		/// TODO: Show error message to user
	}
}

const gameOptions = ({ canvas, paddleWidth, paddleHeight }) => {
	return {
		"vs1": {
			controls: {
				player1: {
					up: 'w',
					down: 's'
				},
				player2: {
					up: 'ArrowUp',
					down: 'ArrowDown'
				},
			},
			paddlePositions: {
				player1: {
					x: 10,
					y: (canvas.height - paddleHeight) / 2
				},
				player2: {
					x: canvas.width - paddleWidth - 10,
					y: (canvas.height - paddleHeight) / 2
				}
			},
			playerCount: 2,
			teamNames: {
				player1: 'Player 1',
				player2: 'Player 2'
			},
			ballCount: 1,
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
					up: 't',
					down: 'g'
				},
				player4: {
					up: '8',
					down: '5'
				}
			},
			paddlePositions: {
				player1: {
					x: 10,
					y: paddleHeight
				},
				player2: {
					x: canvas.width - paddleWidth - 10,
					y: paddleHeight
				},
				player3: {
					x: 10,
					y: canvas.height - paddleHeight
				},
				player4: {
					x: canvas.width - paddleWidth - 10,
					y: canvas.height - paddleHeight
				}
			},
			playerCount: 4,
			teamNames: {
				player1: 'Team 1',
				player2: 'Team 2',
			},
			ballCount: 2,
		},
		"vs3": {
			controls: {
				player1: {
					up: 'w',
					down: 's'
				},
				player2: {
					up: 'o',
					down: 'l'
				},
				player3: {
					up: 'r',
					down: 'f'
				},
				player4: {
					up: 'ArrowUp',
					down: 'ArrowDown'
				},
				player5: {
					up: 'y',
					down: 'h'
				},
				player6: {
					up: '8',
					down: '5'
				}
			},
			paddlePositions: {
				player1: {
					x: 10,
					y: paddleHeight
				},
				player2: {
					x: canvas.width - paddleWidth - 10,
					y: paddleHeight
				},
				player3: {
					x: 10,
					y: (canvas.height - paddleHeight) / 2
				},
				player4: {
					x: canvas.width - paddleWidth - 10,
					y: (canvas.height - paddleHeight) / 2
				},
				player5: {
					x: 10,
					y: canvas.height - paddleHeight
				},
				player6: {
					x: canvas.width - paddleWidth - 10,
					y: canvas.height - paddleHeight
				}
			},
			playerCount: 6,
			teamNames: {
				player1: 'Team 1',
				player2: 'Team 2',
				player3: 'Team 3'
			},
			ballCount: 4,
		}
	}
}

const powerupConfig = {
	shrink: {
		name: "Shrink",
		description: "Shrinks the paddle.",
		color: "red",
	},
	grow: {
		name: "Grow",
		description: "Expands the paddle.",
		color: "green",
	},
	slowDown: {
		name: "Slowness",
		description: "Slows down the paddle.",
		color: "blue",
	},
	speedUp: {
		name: "Speed",
		description: "Speeds up the paddle.",
		color: "yellow",
	},
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
