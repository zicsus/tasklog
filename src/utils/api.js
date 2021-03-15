'use strict';
import axios from 'axios';

const baseUrl = "https://api.getmakerlog.com";
let token = "", user = null;

(async () => 
{
    const result = await browser.storage.local.get(['token', 'user']);  
    token = result.token;
    user = result.user;
})();

async function login(username, password)
{
    try 
    {
        const {data} = await axios.post(`${baseUrl}/api-token-auth/`, {username, password});
        if (data.token)
        {
            await browser.storage.local.set({token: data.token});
            token = data.token; 
            return true;     
        }
        else return false;
    }
    catch (err)
    {
        console.log(err);
        throw err;
    }
}

async function getProfile(callback)
{
    if (user) callback(user);
    try 
    {
        const headers = {
            "Authorization": `Token ${token}`             
        };
        const {data} = await axios.get(`${baseUrl}/me/`, {headers});
        if (data)
        {
            const stats = await getStats(data.username);
            const result = {
                username: data.username,
                name: `${data.first_name} ${data.last_name}`,
                avatar: data.avatar,
                header: data.header,
                remaining_tasks: stats.remaining_tasks,
                done_today: stats.done_today,
                streak: stats.streak,
                praise_received: stats.praise_received,
                rest_day_balance: stats.rest_day_balance
            };

            await browser.storage.local.set({user: result});
            user = result;
            callback(result);
        }
        else callback(null);
    }
    catch (err)
    {
        console.log(err);
        throw err;
    }
}

async function getStats(username)
{
    try 
    {
        const headers = {
            "Authorization": `Token ${token}`            
        };
        const {data} = await axios.get(`${baseUrl}/users/${username}/stats`, {headers});
        if (data) return data;
        else return null;
    }
    catch (err)
    {
        console.log(err);
        throw err;
    }
}

async function newTask(content, done, inProgress, attachment)
{
    try 
    {
        const headers = {
            "Authorization": `Token ${token}`,
            "Content-Type": "multipart/form-data"              
        };

        const formData = new FormData();
        formData.append('content', content);
        formData.append('in_progress', inProgress);
        formData.append('done', done);
        if (attachment) formData.append('attachment', attachment);

        const {data} = await axios.post(`${baseUrl}/tasks/`, formData, {headers});
        if (data) return data;
        else return null;
    }
    catch (err)
    {
        console.log(err);
        throw err;
    }
}

export default {
    login,
    getProfile, 
    getStats, 
    newTask
};