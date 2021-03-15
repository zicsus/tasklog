'use strict';
import Api from '../utils/api';
import newTaskWindow from './newTaskWindow';

const taskWindow = newTaskWindow();
const attachmentBtn = taskWindow.querySelector('#choose_attachment');
const attachmentInput = taskWindow.querySelector('#attachment_input');
const attachmentImg = taskWindow.querySelector('#attachment');
const attachmentRemove = taskWindow.querySelector('#attachment_remove');
const contentInput = taskWindow.querySelector('#content');
const addTaskBtn = taskWindow.querySelector('#add_task');
const state = {
    enabled: false,
    loading: false
};

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
            taskWindow.querySelector(".image").style.display = "flex";
		    attachmentImg.src = e.target.result;
		};
		reader.readAsDataURL(attachmentInput.files[0]);
	}
});

attachmentRemove.addEventListener('click', (e) => 
{
	resetImage();
});

addTaskBtn.addEventListener('click', () => 
{
	if (!state.loading) newTask(contentInput.value);
});

contentInput.addEventListener('keyup', (e) => 
{
	if ((e.key === "Enter" || e.code === "Enter") && !state.loading) newTask(contentInput.value);
});

taskWindow.querySelector(".overlay").addEventListener("click", () => toggle())

document.addEventListener("keydown", (e) => 
{
    if ((e.key === "Escape" || e.key === "Esc") && state.enabled) toggle();
});

function isLoading(status)
{
	if (status)
	{
		state.loading = true;
		addTaskBtn.querySelector('.loader').style.display = "block";
		addTaskBtn.querySelector('svg').style.display = "none";
	}
	else
	{
		state.loading = false;
		addTaskBtn.querySelector('.loader').style.display = "none";
		addTaskBtn.querySelector('svg').style.display = "block";
	}
}

function resetImage()
{
    taskWindow.querySelector(".image").style.display = "none";
    attachmentInput.value = "";
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
        isLoading(false);
		alert("Something went wrong!");
	}
}

function toggle()
{
    if (state.enabled)
    {
        state.enabled = false;
        taskWindow.querySelector(".overlay").classList.remove("active");
        taskWindow.querySelector(".popup").classList.remove("active");
        setTimeout(() => 
        {
            taskWindow.style.display = "none";
        }, 200);
    }
    else
    {
        state.enabled = true;
        taskWindow.style.display = "block";
        contentInput.focus();
        setTimeout(() => 
        {
            taskWindow.querySelector(".overlay").classList.add("active");
            taskWindow.querySelector(".popup").classList.add("active");
        }, 200);
    }
}

browser.runtime.onMessage.addListener((message, sender, sendMessage) =>
{
    switch (message.action)
    {
        case "Tasklog.toggle": 
        {
            toggle();
        } break;
    }
});