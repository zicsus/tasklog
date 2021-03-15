'use strict';
import Manager from './manager';
import Api from '../utils/api';
import sendMessage from '../utils/sendMessage';

async function handleContentScript(sender, message)
{
	const tabId = sender.tab.id;
	switch (message.action)
	{
		case "Auth.login":
		{
			try
			{
				const status = await Api.login(message.username, message.password);		
				sendMessage("Auth.loginStatus", {status}, tabId);
			}
			catch (err)
			{
				sendMessage("Auth.loginStatus", {status: false, err: err.message}, tabId);
			}
		} break;
	}
}

async function handleMessage(message)
{
	switch (message.action)
	{
		case "Auth.check":
		{
			try 
            {
                const status = await Manager.checkAuth();
                sendMessage("Auth.set", {status});
            }
            catch (err)
            {
                sendMessage("Auth.set", {status: false});
            }
		} break;

		case "Api.getProfile":
		{
            try 
            {
                await Api.getProfile(data => 
				{
					sendMessage("Api.setProfile", {err: null, data});
				});
            }
            catch (err)
            {
                sendMessage("Api.setProfile", {err, data: null});
            }
		} break;

		case "Manager.logout": 
		{
			Manager.logout();
		} break;

		case "Tab.open":
		{
			chrome.tabs.create({ url: message.url });
		} break;
	}
}

function toggleTasklog()
{
	chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => 
	{
		const tabId = tabs[0].id;
		console.log(tabId);
		sendMessage("Tasklog.toggle", {}, tabId);
	});
}

browser.runtime.onMessage.addListener((message, sender, sendMessage) => 
{
	if (sender.tab) handleContentScript(sender, message);
	else handleMessage(message);
});

chrome.contextMenus.create({
	title: "Log task with Tasklog",
	onclick: toggleTasklog,
	contexts: ["all"]
});

browser.commands.onCommand.addListener((command) => 
{
	if (command === "toggle-window") toggleTasklog();
});

