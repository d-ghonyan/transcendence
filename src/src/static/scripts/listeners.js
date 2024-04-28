window.addEventListener('popstate', async (e) => {
	e.preventDefault();

	const refreshtoken = localStorage.getItem('refreshtoken');

	const res = await fetch(`${api_url}/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ refreshtoken })
	})

	data = await res.json();

	if (data.status === 200)
	{
		if (e.state)
		{
			changePageContent(e.state.page.html);
		}
	}
	else
	{
		console.log("no token bitch", data.message);
		window.location.href = '/login';
	}
});

window.addEventListener('DOMContentLoaded', () => {
	
});