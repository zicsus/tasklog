'use strict';

const Manager = (function ()
{
	function checkAuth(callback)
	{
		chrome.storage.sync.get(["ml_token"], (result) => 
		{
			const token = result.ml_token;
			
			if (!token)
			{
				chrome.tabs.create({url: chrome.runtime.getURL('auth/auth.html')});
			}

			callback(token);
		});
	}

	function logout()
	{
		chrome.storage.sync.remove("ml_token");
		chrome.storage.sync.remove("user");
	}

	return {
		checkAuth,
		logout
	};
})();