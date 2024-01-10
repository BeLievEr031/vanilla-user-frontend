



























import { Query, databases, storage } from "../../appwrite/config";
import { BUCKET_ID, DATABASE_ID, SONG_COLLECTION_ID } from "../../utils/sceret";
// console.log(window.location.href);//this will give entire URL
// console.log(window.location.href.split("?")[1]); // this will give the QUERY
// console.log(window.location.href.split("?")[1].split("=")[1]); // this will give the GENRE_NAME
const activeGenre = document.querySelector("#curr-genre")
const genreSongCont = document.querySelector("#genre-song-cont")
let audioElement = document.querySelector("audio")
let playAndPause = document.querySelector("#play")
const progressBar = document.querySelector(".progressBar")
const section = document.querySelector("section")
let totalDuration = document.querySelector("#t-duration")

const GENRE_NAME = window.location.href.split("?")[1].split("=")[1]
activeGenre.innerHTML = GENRE_NAME;
let isPlay = false;
let songArr = null
let index = 0;
let currSongBox = null;
const fetchSongByGenreName = async () => {
    try {
        songArr = await databases.listDocuments(DATABASE_ID, SONG_COLLECTION_ID,
            [
                Query.limit(10),
                Query.equal("genre", [GENRE_NAME])
            ])

        songArr.documents.forEach((element) => {
            const songBox = document.createElement("div");
            // const src = 
            songBox.classList.add("genre-song-box")
            const result = storage.getFileDownload(BUCKET_ID, element.thumbnailid);
            songBox.style.backgroundImage = `url(${result.href})`
            const html = `<div class="song-title">${element.title}</div>
                <div class="song-artist">${element.artist}</div>`
            songBox.innerHTML = html
            genreSongCont.appendChild(songBox)

            songBox.addEventListener("click", async function () {
                try {
                    const src = storage.getFileDownload(BUCKET_ID, element.songid);

                    if (currSongBox === this) {
                        await handlePlayPause();
                        return;
                    }

                    if (currSongBox) {
                        audioElement.remove();
                        audioElement = document.createElement("audio")
                        audioElement.setAttribute("controls", true)
                        audioElement.src = src.href
                        await audioElement.play();
                        setTotalDuration(audioElement.duration)
                        handleProgressBar(audioElement, true);
                        section.appendChild(audioElement)
                    } else {
                        audioElement.src = src.href
                        await handlePlayPause();
                        handleProgressBar(audioElement);
                    }

                    currSongBox = songBox;
                } catch (error) {
                    console.log(error);
                }
            })
        })

    } catch (error) {
        console.log(error);
    }
}

fetchSongByGenreName();

const myBar = document.querySelector(".myBar")
var calculationCount = 1;
var intervalInSeconds = 3;
let tduration = null;

function handleProgressBar(audioElement, isReset = false) {
    if (isReset) {
        myBar.style.width = '0'
        calculationCount = 1;
    }
    let cTime = document.querySelector("#c-time")
    audioElement.addEventListener('timeupdate', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        let currTime = await audioElement.currentTime
        cTime.innerText = formatAudioDuration(currTime);
        const currentSeconds = await audioElement.currentTime;
        if (currentSeconds > (calculationCount * intervalInSeconds)) {
            let percent = (Math.floor(currentSeconds) / Math.ceil(tduration))
            myBar.style.width = (percent * 100) + "%";
            calculationCount++;
        }
    });
}


function formatAudioDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${formattedSeconds}`;
}

progressBar.addEventListener("click", (event) => {
    seek(event)
})

let isLeftDown = false;

progressBar.addEventListener("mousedown", (e) => {
    if (e.buttons === 1) {
        isLeftDown = true;
        audioElement.pause()
    }
})

progressBar.addEventListener("mousemove", (event) => {
    if (isLeftDown) {
        seek(event)
    }
})

progressBar.addEventListener("mouseup", (event) => {
    isLeftDown = false;
    seek(event, true)
})

async function seek(event, isMouseUp = false) {
    var percent = (event.offsetX / progressBar.offsetWidth);
    myBar.style.width = `${percent * 100}%`
    if (audioElement && isMouseUp) {
        audioElement.currentTime = percent * audioElement.duration
        await audioElement.play()
    }
}

async function handlePlayPause() {
    if (isPlay) {
        playAndPause.innerText = "play_arrow"
        audioElement.pause()
    } else {
        if (songArr && audioElement.src === window.location.href) {
            audioElement.src = storage.getFileDownload(BUCKET_ID, songArr.documents[0].songid)
            await audioElement.play()
            setTotalDuration(audioElement.duration)
            handleProgressBar(audioElement);
            return;
        }
        playAndPause.innerText = "pause"
        await audioElement.play()
        // setTotalDuration(audioElement.duration)
    }

    isPlay = !isPlay;
}

playAndPause.addEventListener("click", handlePlayPause)

audioElement.addEventListener("ended", async () => {
    index = index + 1;
    audioElement.src = storage.getFileDownload(BUCKET_ID, songArr.documents[index].songid)
    await audioElement.play()
    setTotalDuration(audioElement.duration)
    handleProgressBar(audioElement, true)
})

function setTotalDuration(totalDurationTime) {
    tduration = totalDurationTime;
    totalDuration.innerText = formatAudioDuration(totalDurationTime);
}

function handleReset() {
    myBar.style.width = '0'
    calculationCount = 1;
}
