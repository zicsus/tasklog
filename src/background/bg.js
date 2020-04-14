'use strict';

function handleContentScript(sender, message)
{
	switch (message.action)
	{
		case "Auth.set":
		{
			if (sender.url === chrome.runtime.getURL('/auth/auth.html'))
			{
				Manager.setToken(message.token);
			}
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

