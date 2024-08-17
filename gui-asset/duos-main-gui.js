// ==UserScript==
// @name         DUOS
// @namespace    http://tampermonkey.net/
// @version      BETA 0.0.1
// @description  DUOS
// @author       Sky @blurskydev
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    const styles = `
    #macos-key-system {
        width: 400px;
        height: 300px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
        display: none; /* Hide my gui when sky dont accept, tysm */
    }
    #macos-title-bar {
        height: 30px;
        background: #ececec;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    .macos-button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .macos-button.red {
        background: #ff5f57;
    }
    .macos-button.red:hover {
        background: #ff1c1c;
    }
    .macos-button.red:active {
        background: #e00b0b;
        transform: scale(0.9);
    }
    .macos-button.yellow {
        background: #ffbd2e;
    }
    .macos-button.yellow:hover {
        background: #ffaa00;
    }
    .macos-button.yellow:active {
        background: #e09700;
        transform: scale(0.9);
    }
    .macos-button.green {
        background: #28c940;
    }
    .macos-button.green:hover {
        background: #20b335;
    }
    .macos-button.green:active {
        background: #1a9b2c;
        transform: scale(0.9);
    }
    #macos-key-content {
        flex: 1;
        padding: 20px;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        overflow-y: auto;
    }
    #macos-app-icon {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        width: 60px;
        height: 60px;
        cursor: pointer;
        transition: all 0.8s ease;
    }
    #macos-app-icon img {
        width: 100%;
        height: 100%;
        display: block;
    }
    #macos-app-icon.enlarged {
        transform: translateX(-50%) scale(1.2);
        filter: brightness(1.2);
    }
    #macos-app-icon.shrunk {
        transform: translateX(-50%) scale(0.8);
    }
    #macos-fail-dialog {
        width: 350px;
        height: 220px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        display: none; /* Ẩn dialog khi chưa được kích hoạt */
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px;
    }
    #fail-dialog-icon {
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
    }
    #fail-dialog-text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        color: #333;
        margin-bottom: 20px;
    }
    .fail-dialog-button {
        padding: 8px 16px;
        background-color: #007aff;
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        margin: 0 5px;
        transition: background-color 0.3s;
    }
    .fail-dialog-button.cancel {
        background-color: #e0e0e0;
        color: #333;
    }
    .fail-dialog-button.cancel:hover {
        background-color: #cccccc;
    }
    .fail-dialog-button.cancel:active {
        background-color: #b8b8b8;
    }
    .fail-dialog-button:hover {
        background-color: #005fcc;
    }
    .fail-dialog-button:active {
        background-color: #004bb5;
    }
    `;


    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    const keySystem = document.createElement('div');
    keySystem.id = 'macos-key-system';

    keySystem.innerHTML = `
    <div id="macos-title-bar">
        <div class="macos-button red" id="close-btn"></div>
        <div class="macos-button yellow" id="minimize-btn"></div>
        <div class="macos-button green" id="maximize-btn"></div>
    </div>
    <div id="macos-key-content">
        <!-- Nội dung key system sẽ được chèn vào đây -->
        <p>Please enter key to continue.</p>
        <input type="text" id="key-input" placeholder="Nhập key của bạn..." style="width: 100%; padding: 8px; margin-top: 10px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px;">
        <button id="fail-btn" style="margin-top: 20px; padding: 8px 16px; background-color: #ff5f57; color: white; border: none; border-radius: 12px; cursor: pointer;">Fail</button>
    </div>
    `;

    document.body.appendChild(keySystem);


    const failDialog = document.createElement('div');
    failDialog.id = 'macos-fail-dialog';
    failDialog.innerHTML = `
    <img id="fail-dialog-icon" src="https://raw.githubusercontent.com/baolong7651/macos-style-opsc/main/macos-icon-asset/errorfile-icon.png" alt="Icon">
    <div id="fail-dialog-text">Unico-GUI-9.13.0.0.pkg can't be opened. You should move it to the Bin.</div>
    <div>
        <button class="fail-dialog-button cancel" id="fail-dialog-cancel-button">Cancel</button>
        <button class="fail-dialog-button" id="fail-dialog-move-button">Move to Bin</button>
    </div>
    `;

    document.body.appendChild(failDialog);

    let isMaximized = false;
    const initialDimensions = {
        width: keySystem.style.width,
        height: keySystem.style.height,
        top: keySystem.style.top,
        left: keySystem.style.left,
        borderRadius: keySystem.style.borderRadius,
        transform: keySystem.style.transform
    };


    document.getElementById('close-btn').addEventListener('click', function() {
        keySystem.style.display = 'none';
    });

    document.getElementById('minimize-btn').addEventListener('click', function() {
        if (isMaximized) {
            keySystem.style.width = initialDimensions.width;
            keySystem.style.height = initialDimensions.height;
            keySystem.style.top = initialDimensions.top;
            keySystem.style.left = initialDimensions.left;
            keySystem.style.borderRadius = initialDimensions.borderRadius;
            keySystem.style.transform = initialDimensions.transform;
            isMaximized = false;
        }
    });

    document.getElementById('maximize-btn').addEventListener('click', function() {
        if (!isMaximized) {
            keySystem.style.width = '100vw';
            keySystem.style.height = '100vh';
            keySystem.style.top = '0';
            keySystem.style.left = '0';
            keySystem.style.borderRadius = '0';
            keySystem.style.transform = 'none';
            isMaximized = true;
        }
    });


    let isDragging = false;
    let startX, startY;

    keySystem.querySelector('#macos-title-bar').addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - keySystem.offsetLeft;
        startY = e.clientY - keySystem.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(e) {
        if (isDragging) {
            keySystem.style.left = `${e.clientX - startX}px`;
            keySystem.style.top = `${e.clientY - startY}px`;
        }
    }


    const appIcon = document.createElement('div');
    appIcon.id = 'macos-app-icon';
    appIcon.innerHTML = `<img src="chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=3a4db5bd-7690-4a81-9989-71ba5915df16+editor" alt="App Icon">`;

    document.body.appendChild(appIcon);


    appIcon.addEventListener('mouseenter', function() {
        appIcon.classList.add('enlarged');
    });

    appIcon.addEventListener('mouseleave', function() {
        appIcon.classList.remove('enlarged');
    });

    appIcon.addEventListener('click', function() {
        appIcon.classList.add('shrunk');
        setTimeout(() => {
            appIcon.classList.remove('shrunk');
            keySystem.style.display = 'flex'; 
        }, 800); 
    });


    document.getElementById('fail-btn').addEventListener('click', function() {
        failDialog.style.display = 'flex';
    });


    document.getElementById('fail-dialog-move-button').addEventListener('click', function() {
        failDialog.style.display = 'none';
    });


    document.getElementById('fail-dialog-cancel-button').addEventListener('click', function() {
        failDialog.style.display = 'none';
    });

})();
