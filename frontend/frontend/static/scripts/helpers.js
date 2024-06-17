// variables lang_codes and lang are defined in config.js, lang_data is in index.html

const showErrorMessage = (message) => {
	const error = document.getElementById("error");
	error.innerText = message;
	error.classList.remove("hide");

	new Timer(() => {
		hideErrorMessage();
	}, 4000);

	console.error(message);
}

const showWinner = (message) => {
	const winner = document.getElementById("winner");
	winner.innerText = message;
	winner.classList.remove("hide");

	new Timer(() => {
		hideWinner();
	}, 1500);
}

const hideErrorMessage = () => {
	const error = document.getElementById("error");
	error.classList.add("hide");
}

const hideWinner = () => {
	const winner = document.getElementById("winner");
	winner.classList.add("hide");
}

const updateLanguage = () => {
	const selectBtn = document.querySelector(".select-button");
	const activeLang = document.getElementById(lang);

	selectBtn.style.backgroundImage = activeLang.style.backgroundImage;

	for (const key in lang_data)
	{
		const elements = document.getElementsByClassName(key);

		for (let i = 0; i < elements.length; i++)
		{
			elements[i].innerText = lang_data[key][lang];
		}
	}
}

const createLanguageOptions = (optionContainer, selectBtn, customSelect) => {
	for (const lang_code of lang_codes)
	{
		const option = document.createElement("div");
		option.classList.add("option");

		option.id = lang_code;
		option.style.backgroundImage = `url('${ get_flag_url(lang_code) }')`;
		option.addEventListener("click", async function(e) {

			if (getUser())
			{
				try {
					const res = await fetch(`${auth_url}/set_language/`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ language: this.id, username: getUser() }),
					});

					if (res.status !== 200)
						throw new Error(res.message || res.statusText);
				
					storeLang(this.id);
				} catch (error) {
					showErrorMessage("Updating preffered language: " + error);
				}
			}

			lang = this.id;

			selectBtn.style.backgroundImage = this.style.backgroundImage;
			customSelect.classList.remove("active");
			updateLanguage(lang);
		});

		optionContainer.appendChild(option);
	}
}

const getUser = () => localStorage.getItem("user");
const clearUser = () => localStorage.removeItem("user");
const storeUser = (data) => localStorage.setItem("user", data.username);

const storeLang = (lang) => localStorage.setItem("lang", lang);
const clearLang = () => localStorage.removeItem("lang");
const getLang = () => localStorage.getItem("lang");


function addListener(element, event, func)
{
	globalListeners[event] = func;
	element.addEventListener(event, func);
}

class Timer {
	constructor(callback, delay) {
		this.timerId = null;
		this.start;
		this.remaining = delay;
		this.callback = callback;

		this.resume();
	};

	resume() {
		if (this.timerId) return;

		this.start = Date.now();
		this.timerId = window.setTimeout(this.callback, this.remaining);
	};

	pause() {
		window.clearTimeout(this.timerId);
		this.timerId = null;
		this.remaining -= Date.now() - this.start;
	};
}
