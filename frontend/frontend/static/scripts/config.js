const	lang_codes = [ "am", "us", "ru" ];
let		lang = localStorage.getItem("lang") || lang_codes[0];

let		auth_url = "https://localhost:{port}";
let		blockchain_url = "https://localhost:{port}";
const	flag_url = "https://flagicons.lipis.dev/flags/4x3/{lang}.svg";

const	get_flag_url = (lang) => flag_url.replace("{lang}", lang);
const	pushState = (state, url) => window.history.pushState(state, "", url);

const DEFAULTS = {
	paddleWidth: 10,
	paddleHeight: 80,
	paddleSpeed: 15,

	radius: 10,
	ballSize: 10,
	ballSpeed: 5,
	ballSize_min: 5,
	ballSize_max: 20,

	ballSpeed_min: 3,
	ballSpeed_max: 10,
	
	paddleHeight_min: 40,
	paddleHeight_max: 160,
	
	paddleSpeed_min: 6,
	paddleSpeed_max: 25,
	
	paddleWidth_min: 5,
	paddleWidth_max: 30,

	winningScore: 10,
	winningScore_min: 5,
	winningScore_max: 15,

	powerups: ['shrink', 'grow', 'slowDown', 'speedUp'],
};

const POWERUPS = {
	shrink: 40,
	grow: 160,
	slowDown: 6,
	speedUp: 25,
};

const COLORS = {
	shrink: 'red',
	grow: 'green',
	slowDown: 'blue',
	speedUp: 'yellow',
}

const TOURNAMENT_SETTINGS = {
	paddleWidth: DEFAULTS.paddleWidth,
	paddleHeight: DEFAULTS.paddleHeight,
	paddleSpeed: DEFAULTS.paddleSpeed,
	ballSize: DEFAULTS.ballSize,
	ballSpeed: DEFAULTS.ballSpeed,
	winningScore: DEFAULTS.winningScore,
	powerups: [],
}

const resetSettings = () => {
	return {
		paddleWidth: DEFAULTS.paddleWidth,
		paddleHeight: DEFAULTS.paddleHeight,
		paddleSpeed: DEFAULTS.paddleSpeed,
		ballSize: DEFAULTS.ballSize,
		ballSpeed: DEFAULTS.ballSpeed,
		winningScore: DEFAULTS.winningScore,
		powerups: DEFAULTS.powerups,
	};
}

let gameSettings = localStorage.getItem('gameSettings') ? 
		JSON.parse(localStorage.getItem('gameSettings')) : resetSettings();

let gameAnimationId = null;

const globalListeners = {};
