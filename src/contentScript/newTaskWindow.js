'use strict';
import $ from '../utils/element';
import Svg from '../utils/svg';

function createWindow()
{
    const tasklogWindow = document.createElement('tasklog-window');
	const shadow = tasklogWindow.attachShadow({ mode: 'open' });
    
    const baseStyles = $.create(`<link href="${chrome.extension.getURL('css/base.css')}" rel="stylesheet" type="text/css"> `);
    const windowStyles = $.create(`<link href="${chrome.extension.getURL('css/newTaskWindow.css')}" rel="stylesheet" type="text/css"> `);
    const taskWindow = $.create(`<div class="window" dir="ltr"></div>`);
    taskWindow.style.display = 'none';
    const overlay = $.create(`<div class="overlay"></div>`);

    const popup = $.create(`
        <div class='popup'>
            <div class="task">
                <div class="action" id="choose_attachment">
                    ${Svg.image}
                    <input accept="image/*" type="file" id="attachment_input"/>
                </div>
                <input type="text" placeholder="Start typing your task..." id="content" autocomplete="off"/>
                <div class="action" id="add_task">
                    <div class="loader"><div></div><div></div><div></div><div></div></div>
                    ${Svg.arrowRight}
                </div>
            </div>

            <div class="image">
                <img id="attachment"/>
                <span id="attachment_remove">Remove</span>
            </div>
        </div>
    `);

    taskWindow.appendChild(overlay);
    taskWindow.appendChild(popup);
    shadow.appendChild(baseStyles);
    shadow.appendChild(windowStyles);
	shadow.appendChild(taskWindow);
	document.body.appendChild(tasklogWindow);

	return taskWindow;
}

export default createWindow;