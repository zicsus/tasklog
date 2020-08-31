'use strict';

function handleContentScript(sender, message)
{
	switch (message.action)
	{
		case "Auth.set":
		{
			Api.setToken(message.token);
		} break;
	}
}

function handleMessage(message)
{
	switch (message.action)
	{
		case "Auth.check":
		{
			Manager.checkAuth(token => 
			{
				Utils.sendMessage("Auth.set", {});
			});
		} break;

		case "Api.getProfile":
		{
			Api.getProfile((err, data) => 
			{
				Utils.sendMessage("Api.setProfile", { err, data });
			});
		} break;

		case "Api.newTask":
		{
			const content = message.content;
			const done = message.done;
			const inProgress = message.in_progress;
			const attachment = message.attachment;
			Api.newTask(content, done, inProgress, attachment, (err, data) => 
			{
				Utils.sendMessage("Api.newTask.response", { err, data });
			});
		} break;

		case "Manager.logout": 
		{
			Manager.logout();
		} break;

		case "Tab.open":
		{
			console.log(message.url);
			chrome.tabs.create({ url: message.url });
		} break;
	}
}

chrome.runtime.onMessage.addListener((message, sender, sendMessage) => 
{
	if (sender.tab)
	{
		handleContentScript(sender, message);
	}
	else
	{
		handleMessage(message);
	}
});

