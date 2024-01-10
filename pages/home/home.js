(() => {
    const url = window.location.href;
    const splittedArr = url.split("/")
    if (splittedArr[splittedArr.length - 1] === "home.html") {
        document.querySelector("#home").classList.add("active-siebar-link")
    } else {
        document.querySelector("#home").classList.remove("active-siebar-link")
    }
})();


import { BUCKET_ID, DATABASE_ID, GENRE_COLLECTION_ID, SONG_COLLECTION_ID } from "../../utils/sceret.js"
import { databases, Query, storage } from "../../appwrite/config.js"

const historyBox = document.querySelector(".history-box")

const populateGenre = async () => {
    try {
        const genreArr = await databases.listDocuments(DATABASE_ID, GENRE_COLLECTION_ID,
            [
                Query.limit(4)
            ])

        genreArr.documents.forEach((element, index) => {
            const historyCard = document.createElement("a")
            historyCard.classList.add("history-card")
            historyCard.classList.add("reset-anchor")
            historyCard.href = `../genre-songs/genre-song.html?genre_name=${element.name}`
            const html = `<div class="song-info">
                            <div class="genre-name">${element.name.toUpperCase()}</div>
                            <div class="song-name">classical</div>
                        </div>`;
            historyCard.innerHTML = html
            historyBox.appendChild(historyCard)
        })
    } catch (error) {
        console.log(error);
    }
}

populateGenre();

const popularSongBox = document.querySelector(".popular-song-box")
const populateSong = async () => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, SONG_COLLECTION_ID,
            [
                Query.limit(3)
            ])

        response.documents.forEach((element, index) => {
            const popularSongRow = document.createElement("div")
            popularSongRow.classList.add("popular-song-row")
            const html = `
              <div class="album-img-box">
                <img src="../../public/hero-img.jpg" alt="song-thumbnail" />
              </div>
              <div class="song-detail-box">
                <div class="song-name">${element.title}</div>
                <div class="artist-name">${element.artist}</div>
              </div>

              <div
                class="play-btn"
                style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0,'opsz' 48;"
              >
                <span class="material-symbols-outlined" id="play-btn"> play_arrow </span>
            `

            popularSongRow.innerHTML = html;
            popularSongRow.querySelector("#play-btn")._songid = element.songid;
            const img = popularSongRow.querySelector("img")
            popularSongRow._id = element.$id
            const result = storage.getFileDownload(BUCKET_ID, element.thumbnailid);
            img.src = result.href

            popularSongBox.appendChild(popularSongRow)
            let isPlaying = false
            popularSongRow.addEventListener("click", async (e) => {
                const audio = document.querySelector("audio")
                if (e.target.id === "play-btn") {
                    let result = null;
                    if (!e.target._clicked) {
                        result = storage.getFileDownload(BUCKET_ID, e.target._songid);
                    }

                    e.target._clicked = true

                    if (result) {
                        audio.src = result.href;
                    }

                    if (!isPlaying) {
                        audio.play();
                        e.target.innerText = "pause"
                    } else {
                        audio.pause();
                        e.target.innerText = "play_arrow"
                    }

                    isPlaying = !isPlaying;
                }
            })

        })


    } catch (error) {
        console.log(error);
    }
}


populateSong();