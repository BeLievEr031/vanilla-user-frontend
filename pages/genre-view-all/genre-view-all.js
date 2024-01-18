import { BUCKET_ID, DATABASE_ID, GENRE_COLLECTION_ID, SONG_COLLECTION_ID } from "../../utils/sceret.js"
import { databases, Query, storage } from "../../appwrite/config.js"
const historyBox = document.querySelector(".history-box")

const populateGenre = async () => {
    try {
        const genreArr = await databases.listDocuments(DATABASE_ID, GENRE_COLLECTION_ID,
            [
                Query.limit(12)
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