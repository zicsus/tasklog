'use strict';

let tabId = null;

function sendMessage(action, message)
{
	if(!message)
		message = {}

	message.tabId = tabId;
	message.action = action;
	chrome.runtime.sendMessage(message);
}

chrome.runtime.onMessage.addListener((message, sender, sendMessage) => 
{
	switch (message.action)
	{
	}
});

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => 
{
	tabId = tabs[0].id;
	sendMessage("Auth.check");
});