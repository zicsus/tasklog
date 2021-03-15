'use strict';

async function checkAuth()
{
    try
    {
        const {token} = await browser.storage.local.get(["token"]);
        if (!token) browser.tabs.create({url: browser.runtime.getURL('auth.html')});
        return token ? true : false;
    }
    catch (err)
    {
        console.log(err);
        throw err;
    }
}

function logout()
{
    browser.storage.local.remove("token");
    browser.storage.local.remove("user");
}

export default {
    checkAuth,
    logout
};