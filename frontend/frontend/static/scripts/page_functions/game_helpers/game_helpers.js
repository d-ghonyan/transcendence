const getRandomSpeed = () => {
	const rand = Math.random() * 10 - 5;
	return Math.random() < 0.5 ? rand : -rand;
}

const storeGameScore = async (data) => {

	const finalData = {
		matches: data,
		winner: data[2].winner,
	}

	try {
		const res = await fetch(`${blockchain_url}/add_tournament/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(finalData),
		});

	} catch (error) {
		showErrorMessage("Couldn't store data in blockchain: " + error);
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
					y: canvas.height - paddleHeight - 100
				},
				player4: {
					x: canvas.width - paddleWidth - 10,
					y: canvas.height - paddleHeight - 100
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
					y: canvas.height - paddleHeight - 100
				},
				player6: {
					x: canvas.width - paddleWidth - 10,
					y: canvas.height - paddleHeight - 100
				}
			},
			playerCount: 6,
			teamNames: {
				player1: 'Team 1',
				player2: 'Team 2',
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
