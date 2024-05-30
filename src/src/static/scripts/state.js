function updateState(state)
{
	pushState(state, state.url);

	const page = state.page;
	// const container = 
	changePageContent(page.html);
}

function appendScript(container, js)
{
	const script = document.createElement("script");
	script.textContent = js;

	container.appendChild(script);
}

function changePageContent(html)
{
	const container = document.getElementById("container");
	container.innerHTML = html;
	
	updateLanguage()
	return container;
}