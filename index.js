"use strict";

let video;
let player;

async function initPlayer() {
    try {
        await loadShaka();
    
        let manifestUri;
    
        manifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
        shakaInitPlayer(manifestUri);
    } catch (e) {
        alert(e);
    }
}

// set up basic functionality
function loadPlayer() {
}

function pausePlay() {
}

function destroyPlayer() {
}

// set up handlers
const loadBtn = document.getElementById("load-btn");
const playPauseBtn = document.getElementById("playPause-btn");
const destroyBtn = document.getElementById("destroy-btn");

loadBtn.addEventListener("click", () => {
    loadPlayer();
});

playPauseBtn.addEventListener("click", () => {
    pausePlay();
});

destroyBtn.addEventListener("click", () => {
    destroyPlayer();
});