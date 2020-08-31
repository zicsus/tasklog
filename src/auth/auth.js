'use strict';

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const loginBtn = document.getElementById('login');

function isLoading(status)
{
	if (status)
	{
		loginBtn.loading = true;
		loginBtn.querySelector('.loader').style.display = "block";
		loginBtn.querySelector('span').style.display = "none";
	}
	else
	{
		loginBtn.loading = false;
		loginBtn.querySelector('.loader').style.display = "none";
		loginBtn.querySelector('span').style.display = "block";
	}
}

loginBtn.addEventListener('click', login);
passwordInput.addEventListener("keypress", (e) => 
{
	if (e.key === "Enter" || e.keyCode === 32)
	{
		login();
	}
});


function login()
{
	if (!loginBtn.loading)
	{
		const username = usernameInput.value;
		const password = passwordInput.value;
		if(username && password)
		{
			isLoading(true);
			sendRequest(username, password);
		}
	}
}

function sendRequest(username, password)
{
	fetch('https://api.getmakerlog.com/api-token-auth/',
	{
        method: "post",
        headers: {
            "content-type": "application/x-www-form-urlencoded"                
        },
        body: `username=${username}&password=${password}`
    })
	.then(res => res.json())
	.then((data) => 
	{ 
		if (data.token)
		{
			const message = {
				action: "Auth.set",
				token: data.token
			};
			chrome.runtime.sendMessage(message);
			window.close();
		}
		else
		{
			console.log(data);
			alert("Please check your credentials!");
		}

		isLoading(false);
	})
	.catch(err => 
	{
		console.log(err);
		isLoading(false);
		alert(err.message);
	});
}
