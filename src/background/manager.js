'use strict';

const Manager = (function ()
{

	function setToken(ml_token)
	{
		chrome.storage.sync.set({ ml_token }, () => 
		{
			console.log("Login successfull!");
		});
	}

	function checkAuth(callback)
	{
		chrome.storage.sync.get(['ml_token'], (result) => 
		{
			const token = result.ml_token;
			
			if (!token)
			{
				chrome.tabs.create({url: chrome.runtime.getURL('auth/auth.html')});
			}

			callback(token);
		});
	}

	return {
		checkAuth,
		setToken
	};
})();