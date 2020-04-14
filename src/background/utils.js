'use strict';

const Utils = (function ()
{
	function sendMessage(action, message, tabId)
	{
		if (!message)
			message = {};
		message.action = action;

		if (tabId)
		{
			chrome.tabs.sendMessage(tabId, message);
		}
		else
		{
			chrome.runtime.sendMessage(message);
		}
	}

	return {
		sendMessage
	};
})();