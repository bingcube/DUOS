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
    #ventura-gui {
        width: 500px;
        height: 400px;
        background: rgba(255, 255, 255, 0.97);
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
    }
    #ventura-title-bar {
        height: 30px;
        background: #ececec;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    .ventura-button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .ventura-button.red {
        background: #ff5f57;
    }
    .ventura-button.red:hover {
        background: #ff1c1c;
    }
    .ventura-button.red:active {
        background: #e00b0b;
        transform: scale(0.9);
    }
    .ventura-button.yellow {
        background: #ffbd2e;
    }
    .ventura-button.yellow:hover {
        background: #ffaa00;
    }
    .ventura-button.yellow:active {
        background: #e09700;
        transform: scale(0.9);
    }
    .ventura-button.green {
        background: #28c940;
    }
    .ventura-button.green:hover {
        background: #20b335;
    }
    .ventura-button.green:active {
        background: #1a9b2c;
        transform: scale(0.9);
    }
    #ventura-content {
        flex: 1;
        padding: 20px;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #ventura-icon {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
    }
    #ventura-progress {
        width: 80%;
        margin-top: 20px;
        margin-bottom: 15px; 
    }
    #ventura-progress-bar {
        width: 0;
        height: 6px;
        background-color: #007aff;
        border-radius: 3px;
        transition: width 0.3s;
    }
    #cancel-button {
        margin-top: 20px;
        padding: 8px 16px;
        background-color: #e0e0e0;
        color: #333;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        transition: background-color 0.3s;
    }
    #cancel-button:hover {
        background-color: #cccccc;
    }
    #cancel-button:active {
        background-color: #b8b8b8;
    }
    `;


    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    const venturaGUI = document.createElement('div');
    venturaGUI.id = 'ventura-gui';

    venturaGUI.innerHTML = `
    <div id="ventura-title-bar">
        <div class="ventura-button red" id="close-btn"></div>
        <div class="ventura-button yellow" id="minimize-btn"></div>
        <div class="ventura-button green" id="maximize-btn"></div>
    </div>
    <div id="ventura-content">
        <img id="ventura-icon" src="https://raw.githubusercontent.com/baolong7651/macos-style-opsc/main/macos-icon-asset/ventura-icon.png" alt="Icon">
        <h2>macOS Ventura beta</h2>
        <p>macOS Ventura beta will be installed on the disk "Bootable macOS".</p>
        <div id="ventura-progress">
            <div id="ventura-progress-bar"></div>
        </div>
        <p style="margin-top: 10px;">About 56 minutes remaining</p> <!-- Distance on the word -->
        <button id="cancel-button">Cancel</button>
    </div>
    `;

    document.body.appendChild(venturaGUI);


    let isMaximized = false;
    const initialDimensions = {
        width: venturaGUI.style.width,
        height: venturaGUI.style.height,
        top: venturaGUI.style.top,
        left: venturaGUI.style.left,
        borderRadius: venturaGUI.style.borderRadius,
        transform: venturaGUI.style.transform
    };


    document.getElementById('close-btn').addEventListener('click', function() {
        venturaGUI.style.display = 'none';
    });

    document.getElementById('minimize-btn').addEventListener('click', function() {
        if (isMaximized) {
            venturaGUI.style.width = initialDimensions.width;
            venturaGUI.style.height = initialDimensions.height;
            venturaGUI.style.top = initialDimensions.top;
            venturaGUI.style.left = initialDimensions.left;
            venturaGUI.style.borderRadius = initialDimensions.borderRadius;
            venturaGUI.style.transform = initialDimensions.transform;
            isMaximized = false;
        }
    });

    document.getElementById('maximize-btn').addEventListener('click', function() {
        if (!isMaximized) {
            venturaGUI.style.width = '100vw';
            venturaGUI.style.height = '100vh';
            venturaGUI.style.top = '0';
            venturaGUI.style.left = '0';
            venturaGUI.style.borderRadius = '0';
            venturaGUI.style.transform = 'none';
            isMaximized = true;
        }
    });


    document.getElementById('cancel-button').addEventListener('click', function() {
        venturaGUI.style.display = 'none';
    });


    function updateProgressBar() {
        const progressBar = document.getElementById('ventura-progress-bar');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += 1;
                progressBar.style.width = width + '%';
            }
        }, 560); 
    }

    updateProgressBar();

})();
