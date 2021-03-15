'use strict';

function create(text)
{
    const wrapper = document.createElement('div');
    wrapper.innerHTML = text;
    return wrapper.firstElementChild;
}

export default {
    create 
};