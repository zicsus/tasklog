'use strict';

const state = {
	token: "",
	tabId: null
};
	
chrome.storage.sync.get(['ml_token', 'user'], (result) => 
{
	state.token = result.ml_token;	
});

const attachmentBtn = document.getElementById('choose_attachment');
const attachmentInput = document.getElementById('attachment_input');
const attachment = document.getElementById('attachment');
const contentInput = document.getElementById('content');
const submitBtn = document.getElementById('submit');

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
		    attachment.src = e.target.result;

		    setTimeout(() => 
			{
			    const main = document.querySelector(".main");
			    const height = attachment.clientHeight;
			    main.setAttribute("style",`height:${240 + height}px`);
	    	}, 100);
		};
		reader.readAsDataURL(attachmentInput.files[0]);
	}
})

function sendMessage(action, message)
{
	if(!message)
		message = {}

	message.tabId = state.tabId;
	message.action = action;
	chrome.runtime.sendMessage(message);
}

function setProfile(err, data)
{
	document.getElementById("header").src = data.header; 
	document.getElementById("avatar").src = data.avatar; 
	document.getElementById("name").innerHTML = data.name; 
	document.getElementById("streak").innerHTML = data.streak; 
	document.getElementById("score").innerHTML = data.maker_score; 
	document.getElementById("claps").innerHTML = data.praise_received; 
	document.getElementById("rest_days").innerHTML = data.rest_day_balance; 
}

function isLoading(status)
{
	if (status)
	{
		submitBtn.loading = true;
		submitBtn.querySelector('.loader').style.display = "block";
		submitBtn.querySelector('span').style.display = "none";
		submitBtn.querySelector('svg').style.display = "none";
	}
	else
	{
		submitBtn.loading = false;
		submitBtn.querySelector('.loader').style.display = "none";
		submitBtn.querySelector('span').style.display = "block";
		submitBtn.querySelector('svg').style.display = "block";
	}
}

function newTask(content)
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
	else 
	{
		content = content.replace("/done ", '');
	}

	if (!content) return;

	isLoading(true);
	const message = {
		content,
		done,
		in_progress: inProgress
	};

	const formData = new FormData();
    formData.append('content', content);
    formData.append('in_progress', inProgress);
    formData.append('done', done);

	if (attachmentInput.files && attachmentInput.files[0])
	{
		formData.append('attachment', attachmentInput.files[0]);
	}

	fetch(`https://api.getmakerlog.com/tasks/`,
	{
        method: "POST",
        headers: {
            "Authorization": `Token ${state.token}`              
        },
        body: formData
    })
	.then(res => res.json())
	.then((data) => 
	{
		if (data.id)
		{
			contentInput.value = "";
		}
		else
		{
			alert("Something went wrong!");
		}

		isLoading(false);
	})
	.catch(err => 
	{
		alert(err.message);
		isLoading(false);
	});
}

submitBtn.addEventListener('click', () => 
{
	if (!submitBtn.loading || !state.token)
	{
		const content = contentInput.value;
		newTask(content);
	}
});

contentInput.addEventListener('keyup', (e) => 
{
	if (e.which === 13 || e.key === "Enter" || e.code === "Enter")
	{
		if (!submitBtn.loading || !state.token)
		{
			const content = contentInput.value;
			newTask(content);
		}
	}
});

chrome.runtime.onMessage.addListener((message, sender, _) => 
{
	switch (message.action)
	{
		case "Auth.set":
		{
			sendMessage("Api.getProfile");
		} break;

		case "Api.setProfile":
		{
			setProfile(message.err, message.data);
		} break;

		case "Api.newTask.response": 
		{
			alert("done");
		} break;
	}
});

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => 
{
	state.tabId = tabs[0].id;
	sendMessage("Auth.check");
});