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

const shakaConfig = {
    streaming: {
        alwaysStreamText: true
    }
}

function setProgressBar() {
    const progress = document.getElementById("progress");
    progress.setAttribute("max", video.duration);
    
    video.addEventListener('timeupdate', () => {
        progress.value = video.currentTime;
    });

    progress.addEventListener('click', (e) => {
        const rect = progress.getBoundingClientRect();
        const pos = (e.pageX  - rect.left) / progress.offsetWidth;
        video.currentTime = pos * video.duration;
    });
}

async function shakaInitPlayer(manifestUri) {
    // Create a Player instance.
    video = document.querySelector('video');
    player = new shaka.Player(video);

    // Attach player to the window to make it easy to access in the JS console.
    window.shaka = player;

    // Listen for error events.
    player.addEventListener('error', shakaOnErrorEvent);

     // set config
     player.configure(shakaConfig);
    
    // Try to load a manifest.
    // This is an asynchronous process.
    try {
        await player.load(manifestUri);
        // This runs if the asynchronous load is successful.
        player.setVideoContainer(video);
        getSubtitleTracks();
        setProgressBar();
    } catch (e) {
        alert(e);
    }
}

function shakaOnErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    alert(event.detail);
}

function getSubtitleTracks() {
    // get subtitle tracks available
    const textTracks = player.getTextTracks();
    console.log(textTracks);

    // set default, otherwise the first option will be set ("el")
    const englishSubtitles = textTracks.find(el => el.language == "en");

    player.setTextTrackVisibility(false);

    if (englishSubtitles) {
        const { id } = englishSubtitles;
        player.selectTextTrack(textTracks[id - 1]);     
    }

    // add subtitle options to UI
    const subtitlesWrapper = document.querySelector(".video-container__subtitle-tracks");
    textTracks.forEach(({language}) => {
        let item = document.createElement("div");
        item.className = "subtitle-item";
        item.innerText = language;
        subtitlesWrapper.appendChild(item);
        item.addEventListener("click", ({ target }) => {
            player.selectTextLanguage(target.innerText);
        })
    });

    video.textTracks[0].addEventListener('cuechange', ({target: {activeCues} = {}}) => {
        console.log("activeCues: ", activeCues)
        if (activeCues) renderSubtitle(activeCues);
    })

    function renderSubtitle(activeCues){
        if (activeCues[0]?.text) {
            document.querySelector(".video-container__subtitles").innerText = activeCues[0].text;
        } else {
            document.querySelector(".video-container__subtitles").innerText = "";
        }
    }
}