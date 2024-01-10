const activeGenre = document.querySelector("#curr-genre")
const genreSongCont = document.querySelector("#genre-song-cont")
let audioElement = document.querySelector("audio")
let playAndPause = document.querySelector("#play")
const progressBar = document.querySelector(".progressBar")
const section = document.querySelector("section")
let totalDuration = document.querySelector("#t-duration")
let cTime = document.querySelector("#c-time")
const myBar = document.querySelector(".myBar")

let calculationCount = 1;
let intervalInSeconds = 3;
let checkWhenSongPlayHappen = "first";
let isPlay = false;
let prevSong = null;
let currTrack = null;
let index = 0;
let isLeftDown = false;

const songArr = [
    {
        _id: 1,
        songName: "RamSiyaRam",
        src: "../../public/RamSiyaRam.webm",
        artist: "Latish"
    },
    {
        _id: 2,
        songName: "maan meri jaan",
        src: "../../public/maanmerijaan.mp3",
        artist: "Latish"
    },
    {
        _id: 3,
        songName: "sanam re",
        src: "../../public/sanamre.webm",
        artist: "sachin"
    },
    {
        _id: 4,
        songName: "phiraurkya",
        src: "../../public/phiraurkya.webm",
        artist: "sachin"

    },
    {
        _id: 5,
        songName: "Majha raja tu sona",
        src: "../../public/Majharajatusona.webm",
        artist: "Sandeep"

    },

]

const fetchSongByGenreName = () => {
    songArr.forEach((element, idx) => {
        const songBox = document.createElement("div");
        songBox.classList.add("genre-song-box")
        const html = `<div class="song-title">${element.songName}</div>
            <div class="song-artist">${element.artist}</div>`
        songBox.innerHTML = html
        genreSongCont.appendChild(songBox)

        songBox.addEventListener("click", async function () {
            if (currTrack !== this && index !== idx) {
                resetIsPlay();
            }

            handlePlayAndPause(currTrack === this || index === idx ? -1 : idx);

            index = idx;
            currTrack = songBox;
        })

    })
}

fetchSongByGenreName();

async function handlePlayAndPause(index, isEnded = null) {
    if (isPlay && isEnded === null) {
        playAndPause.innerHTML = "play_arrow"
        audioElement.pause();
    } else {
        
        if (index >= 0 && prevSong !== index) {
            audioElement.src = songArr[index].src
        }

        await audioElement.play()
        if (prevSong !== index && index !== -1) {
            handleResetMyBar();
            totalDuration.innerText = formatAudioDuration(audioElement.duration)
            prevSong = index;
        }
        playAndPause.innerText = "pause"
    }

    isPlay = !isPlay;
}

playAndPause.addEventListener("click", async () => {
    if (checkWhenSongPlayHappen === "first") {
        handlePlayAndPause(index);
        checkWhenSongPlayHappen = "clicked"
        return;
    }
    handlePlayAndPause(-1)
})

function resetIsPlay() {
    isPlay = false;
}

function formatAudioDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${formattedSeconds}`;
}

audioElement.addEventListener('timeupdate', async function (e) {
    e.stopPropagation();
    e.preventDefault();

    let currTime = audioElement.currentTime
    cTime.innerText = formatAudioDuration(currTime);
    const currentSeconds = audioElement.currentTime;
    if (currentSeconds > (calculationCount * intervalInSeconds)) {
        let percent = (Math.floor(currentSeconds) / Math.ceil(audioElement.duration))
        myBar.style.width = (percent * 100) + "%";
        calculationCount++;
    }
});

audioElement.addEventListener("ended", async () => {
    index = index + 1;
    if (index === songArr.length - 1) {
        index = 0;
    }

    // Special case because my song is ended here now i want to load another track
    resetIsPlay();
    handlePlayAndPause(index, true)
})

function handleResetMyBar() {
    myBar.style.width = '0';
    calculationCount = 1;
}

progressBar.addEventListener("click", (event) => {
    seek(event,true)
})

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
        await audioElement.play();
    }
}