// variables lang_codes and lang are defined in config.js, lang_data is in index.html

const updateLanguage = () => {
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
		option.addEventListener("click", function(e) {

			lang = this.id;
			localStorage.setItem("lang", lang);

			selectBtn.style.backgroundImage = this.style.backgroundImage;

			customSelect.classList.remove("active");

			updateLanguage(lang);
		});

		optionContainer.appendChild(option);
	}
}
