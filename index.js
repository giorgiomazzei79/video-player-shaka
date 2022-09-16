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
    if (!player) {
        initPlayer();
    } else {
        alert("Player already loaded");
    }
}

function pausePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function destroyPlayer() {
    player.destroy();
    player = null;

    // reset subtitles
    document
        .querySelector(".video-container__subtitles").innerText = "";
    document
        .querySelector(".video-container__subtitle-tracks")
        .classList.add("hide");
    document
        .querySelector(".video-container__subtitle-tracks")
        .innerHTML = "";
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