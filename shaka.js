"use strict";

function loadShaka() {
    const videoScript = document.createElement("script");
    videoScript.src = "https://cdn.jsdelivr.net/npm/shaka-player@4.1.2/dist/shaka-player.compiled.debug.min.js";
    document.head.appendChild(videoScript);

    return new Promise((resolve, reject) => {
        videoScript.onload = () => {
            if (window.shaka) {
                // Install built-in polyfills to patch browser incompatibilities.
                window.shaka.polyfill.installAll();
                resolve();
            }
            // Check to see if the browser supports the basic APIs Shaka needs.
            if (!shaka.Player.isBrowserSupported()) {
                // This browser does not have the minimum set of APIs we need.
                alert('Browser not supported!');
                reject();
            }
        };
    })
}

async function shakaInitPlayer(manifestUri) {
    // Create a Player instance.
    video = document.querySelector('video');
    player = new shaka.Player(video);

    // Attach player to the window to make it easy to access in the JS console.
    window.shaka = player;

    // Listen for error events.
    player.addEventListener('error', shakaOnErrorEvent);
    
    // Try to load a manifest.
    // This is an asynchronous process.
    try {
        await player.load(manifestUri);
        // This runs if the asynchronous load is successful.
        player.setVideoContainer(video);
    } catch (e) {
        alert(e);
    }
}

function shakaOnErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    alert(event.detail);
}