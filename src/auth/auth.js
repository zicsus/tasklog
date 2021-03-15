'use strict';
import sendMessage from '../utils/sendMessage';

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
	if (e.key === "Enter") login();
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
			sendMessage("Auth.login", {username, password});
		}
	}
}

chrome.runtime.onMessage.addListener((message, sender, _) => 
{
	console.log(message);
	switch (message.action)
	{
		case "Auth.loginStatus": 
        {
            isLoading(false);
            if (message.status) window.close();
            else alert(message.err);
        } break;
	}
});