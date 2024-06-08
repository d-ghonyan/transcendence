const	lang_codes = [ "am", "us", "ru" ];
let		lang = localStorage.getItem("lang") || lang_codes[0];

const	api_url = "http://localhost:8001";
const	flag_url = "https://flagicons.lipis.dev/flags/4x3/{lang}.svg";

const	get_flag_url = (lang) => flag_url.replace("{lang}", lang);
const	pushState = (state, url) => window.history.pushState(state, "", url);

let gameAnimationId = null;

const globalListeners = {};