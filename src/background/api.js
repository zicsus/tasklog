'use strict';

const Api = (function ()
{
	const baseUrl = "https://api.getmakerlog.com";

	let token = "", user = null;
	chrome.storage.sync.get(['ml_token', 'user'], (result) => 
	{
		token = result.ml_token;
		user = result.user;
	});

	function setToken(ml_token)
	{
		token = ml_token;
		chrome.storage.sync.set({ ml_token }, () => 
		{
			console.log("Login successfull!");
		});
	}

	function getProfile(callback)
	{
		if (user) callback(null, user);

		fetch(`${baseUrl}/me/`,
		{
	        method: "GET",
	        headers: {
	        	"Authorization": `Token ${token}`,
	            "Content-Type": "application/x-www-form-urlencoded"              
	        }
	    })
		.then(res => res.json())
		.then((userData) => 
		{
			getStats(userData.username, (err, statsData) => 
			{
				if (err)
				{
					callback(err, null)
				}

				const result = {
					username: userData.username,
					name: `${userData.first_name} ${userData.last_name}`,
					avatar: userData.avatar,
					header: userData.header,
					remaining_tasks: statsData.remaining_tasks,
					done_today: statsData.done_today,
					streak: statsData.streak,
					praise_received: statsData.praise_received,
					maker_score: statsData.maker_score,
					rest_day_balance: statsData.rest_day_balance
				};

				chrome.storage.sync.set({ user: result }, () => { user = result });

				callback(null, result);
			});
		})
		.catch(err => 
		{
			console.log(err);
			callback(err, null);
		});
	}

	function getStats(username, callback)
	{
		fetch(`${baseUrl}/users/${username}/stats`,
		{
	        method: "GET",
	        headers: {
	        	"Authorization": `Token ${token}`,
	            "Content-Type": "application/x-www-form-urlencoded"              
	        }
	    })
		.then(res => res.json())
		.then((data) => 
		{
			callback(null, data);
		})
		.catch(err => 
		{
			console.log(err);
			callback(err, null);
		});
	}

	function newTask(content, done, inProgress, attachment, callback)
	{
		console.log(attachment)

		const formData = new FormData();
        formData.append('content', content);
        formData.append('in_progress', inProgress);
        formData.append('done', done);

        if (attachment)
        {
        	formData.append('attachment', attachment);
        }

		fetch(`${baseUrl}/tasks/`,
		{
	        method: "POST",
	        headers: {
	            "Authorization": `Token ${token}`              
	        },
	        body: formData
	    })
		.then(res => res.json())
		.then((data) => 
		{ 
			console.log(data);
			callback(null, data);
		})
		.catch(err => 
		{
			console.log(err);
			callback(err, null);
		});
	}

	return {
		getProfile,
		setToken,
		newTask
	}

})();

