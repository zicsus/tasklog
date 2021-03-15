'use strict';
import Api from '../utils/api';
import sendMessage from '../utils/sendMessage';

const state = {
	user: null
};

const attachmentBtn = document.getElementById('choose_attachment');
const attachmentInput = document.getElementById('attachment_input');
const attachmentImg = document.getElementById('attachment');
const attachmentRemove = document.getElementById('attachment_remove');
const contentInput = document.getElementById('content');
const addTaskBtn = document.getElementById('add_task');
const logoutBtn = document.getElementById('logout');

document.getElementById("name").addEventListener("click", () => sendMessage("Tab.open", { url: `https://getmakerlog.com/@${state.user.username}` }));
document.querySelector("#discuss").addEventListener("click", () => sendMessage("Tab.open", { url: "https://getmakerlog.com/discussions" }));
document.querySelector("#stories").addEventListener("click", () => sendMessage("Tab.open", { url: "https://getmakerlog.com/stories" }));
document.querySelector("#explore").addEventListener("click", () => sendMessage("Tab.open", { url: "https://getmakerlog.com/" }));

logoutBtn.addEventListener("click", () => 
{
	sendMessage("Manager.logout", {});
	window.close();
});

attachmentBtn.addEventListener('click', (e) => 
{
	attachmentInput.click();
});

attachmentInput.addEventListener('change', (e) => 
{
	if (attachmentInput.files && attachmentInput.files[0]) 
	{
		let reader = new FileReader();
		reader.onload = (e) => 
		{
			document.querySelector(".image").style.display = "flex";
		    attachmentImg.src = e.target.result;
		};
		reader.readAsDataURL(attachmentInput.files[0]);
	}
});

addTaskBtn.addEventListener('click', () => 
{
	if (!addTaskBtn.loading) newTask(contentInput.value);
});

contentInput.addEventListener('keyup', (e) => 
{
	if (e.key === "Enter" || e.code === "Enter")
	{
		if (!addTaskBtn.loading) newTask(contentInput.value);
	}
});

attachmentRemove.addEventListener('click', (e) => 
{
	resetImage();
});

function resetImage()
{
    document.querySelector(".image").style.display = "none";
    attachmentInput.value = "";
}

function setProfile(err, data)
{
	if (data)
	{
		state.user = data;
		document.getElementById("header").src = data.header; 
		document.getElementById("avatar").src = data.avatar; 
		document.querySelector("#name h1").innerHTML = data.name; 
		document.getElementById("streak").innerHTML = data.streak;
		document.getElementById("claps").innerHTML = data.praise_received; 
		document.getElementById("rest_days").innerHTML = data.rest_day_balance;
	}
}

function isLoading(status)
{
	if (status)
	{
		addTaskBtn.loading = true;
		addTaskBtn.querySelector('.loader').style.display = "block";
		addTaskBtn.querySelector('svg').style.display = "none";
	}
	else
	{
		addTaskBtn.loading = false;
		addTaskBtn.querySelector('.loader').style.display = "none";
		addTaskBtn.querySelector('svg').style.display = "block";
	}
}

async function newTask(content)
{
	let done = true, 
		inProgress = false;

	if (content.startsWith("/todo "))
	{
		done = false;
		inProgress = false;
		content = content.replace("/todo ", '');
	}
	else if (content.startsWith("/doing "))
	{
		done = false;
		inProgress = true;
		content = content.replace("/doing ", '');
	}
	else content = content.replace("/done ", '');

	if (!content) return;
	isLoading(true);

	let attach = undefined;
	if (attachmentInput.files && attachmentInput.files[0]) attach = attachmentInput.files[0];

	try
	{
		const data = await Api.newTask(content, done, inProgress, attach);
		isLoading(false);
		if (data.id) 
		{
			contentInput.value = "";
			resetImage();
		}
		else alert("Something went wrong!");
	}
	catch (err)
	{
		alert("Something went wrong!");
	}
}

chrome.runtime.onMessage.addListener((message, sender, _) => 
{
	switch (message.action)
	{
		case "Auth.set":
		{
			if (message.status) sendMessage("Api.getProfile");
			else window.close();
		} break;

		case "Api.setProfile":
		{
			setProfile(message.err, message.data);
		} break;
	}
});

sendMessage("Auth.check");