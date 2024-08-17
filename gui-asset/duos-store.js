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
    #macos-store {
        width: 800px;
        height: 600px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        display: none; 
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
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
    .macos-button.yellow {
        background: #ffbd2e;
    }
    .macos-button.yellow:hover {
        background: #ffaa00;
    }
    .macos-button.green {
        background: #28c940;
    }
    .macos-button.green:hover {
        background: #20b335;
    }

    #macos-content {
        flex: 1;
        padding: 20px;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        overflow-y: auto;
    }

    #macos-search {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 14px;
        outline: none;
    }

    #macos-app-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .macos-app {
        width: 150px;
        padding: 15px;
        margin: 10px;
        text-align: center;
        background: #f7f7f7;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .macos-app img {
        width: 50px;
        height: 50px;
        border-radius: 12px;
    }

    .macos-app h3 {
        margin: 10px 0;
        font-size: 14px;
        color: #333;
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
    `;


    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    const macosStore = document.createElement('div');
    macosStore.id = 'macos-store';

    macosStore.innerHTML = `
    <div id="macos-title-bar">
        <div class="macos-button red" id="close-btn"></div>
        <div class="macos-button yellow" id="restore-btn"></div>
        <div class="macos-button green" id="maximize-btn"></div>
    </div>
    <div id="macos-content">
        <input type="text" id="macos-search" placeholder="Tìm ứng dụng...">
        <div id="macos-app-list">
            <div class="macos-app">
                <img src="https://via.placeholder.com/50" alt="App 1">
                <h3>App 1</h3>
            </div>
            <div class="macos-app">
                <img src="https://via.placeholder.com/50" alt="App 2">
                <h3>App 2</h3>
            </div>
            <div class="macos-app">
                <img src="https://via.placeholder.com/50" alt="App 3">
                <h3>App 3</h3>
            </div>
            <div class="macos-app">
                <img src="https://via.placeholder.com/50" alt="App 4">
                <h3>App 4</h3>
            </div>
        </div>
    </div>
    `;


    const appIcon = document.createElement('div');
    appIcon.id = 'macos-app-icon';
    appIcon.innerHTML = `<img src="https://raw.githubusercontent.com/baolong7651/macos-style-opsc/main/macos-icon-asset/recordapp-icon.png" alt="App Icon">`;

    document.body.appendChild(macosStore);
    document.body.appendChild(appIcon);


    document.getElementById('close-btn').addEventListener('click', function() {
        macosStore.style.display = 'none';
    });

    let isMaximized = false;
    const initialDimensions = {
        width: macosStore.style.width,
        height: macosStore.style.height,
        top: macosStore.style.top,
        left: macosStore.style.left,
        borderRadius: macosStore.style.borderRadius,
        transform: macosStore.style.transform
    };

    document.getElementById('restore-btn').addEventListener('click', function() {
        if (isMaximized) {
            macosStore.style.width = initialDimensions.width;
            macosStore.style.height = initialDimensions.height;
            macosStore.style.top = initialDimensions.top;
            macosStore.style.left = initialDimensions.left;
            macosStore.style.borderRadius = initialDimensions.borderRadius;
            macosStore.style.transform = initialDimensions.transform;
            isMaximized = false;
        }
    });

    document.getElementById('maximize-btn').addEventListener('click', function() {
        if (!isMaximized) {
            macosStore.style.width = '100vw';
            macosStore.style.height = '100vh';
            macosStore.style.top = '0';
            macosStore.style.left = '0';
            macosStore.style.borderRadius = '0';
            macosStore.style.transform = 'none';
            isMaximized = true;
        }
    });


    let isDragging = false;
    let startX, startY;

    macosStore.querySelector('#macos-title-bar').addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - macosStore.offsetLeft;
        startY = e.clientY - macosStore.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(e) {
        if (isDragging) {
            macosStore.style.left = `${e.clientX - startX}px`;
            macosStore.style.top = `${e.clientY - startY}px`;
        }
    }


    appIcon.addEventListener('mouseenter', function() {
        appIcon.classList.add('enlarged');
    });

    appIcon.addEventListener('mouseleave', function() {
        appIcon.classList.remove('enlarged');
    });

    appIcon.addEventListener('click', function() {
        macosStore.style.display = 'flex'; 
    });

})();
