'use strict';

function handleContentScript(tabId, message)
{
	switch (message.action)
	{

	}
}

function handleMessage(message)
{
	switch (message.action)
	{
		case "Auth.check":
		{
			Manager.checkAuth(token => { });
		} break;
	}
}

chrome.runtime.onMessage.addListener((message, sender, sendMessage) => 
{
	if (sender.tab)
	{
		handleContentScript(sender.tab, message);
	}
	else
	{
		handleMessage(message);
	}
});

