'use strict';

const sendMessage = (action, message, tabId) =>
{
	if (!message) message = {};
	message.action = action;

	if (tabId) browser.tabs.sendMessage(tabId, message);
	else browser.runtime.sendMessage(message);
}

export default sendMessage;