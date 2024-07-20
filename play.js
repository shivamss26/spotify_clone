// Mock data for songs
const songs = [
    { id: 1, title: "Song A", artist: "Artist 1", duration: 210 },
    { id: 2, title: "Song B", artist: "Artist 2", duration: 180 },
    { id: 3, title: "Song C", artist: "Artist 3", duration: 240 },
    { id: 4, title: "Song D", artist: "Artist 4", duration: 200 },
    { id: 5, title: "Song E", artist: "Artist 5", duration: 190 }
];

// Mock user listening history
let userHistory = [
    { songId: 1, timestamp: Date.now() - 100000 },
    { songId: 2, timestamp: Date.now() - 50000 },
    { songId: 3, timestamp: Date.now() - 20000 },
];

// Function to simulate song prediction based on user history
function predictNextSong() {
    const lastPlayedSong = userHistory[userHistory.length - 1];
    let nextSongId = (lastPlayedSong.songId % songs.length) + 1;
    return songs.find(song => song.id === nextSongId);
}

// Music player object
const musicPlayer = {
    currentSong: null,
    isPlaying: false,
    audioElement: new Audio(),
    volume: 0.5,

    playSong(song) {
        this.currentSong = song;
        this.audioElement.src = `path/to/songs/${song.title}.mp3`;
        this.audioElement.volume = this.volume;
        this.audioElement.play();
        this.isPlaying = true;
        console.log(`Playing: ${song.title} by ${song.artist}`);
        this.updateCurrentSongDisplay();
    },

    pauseSong() {
        this.audioElement.pause();
        this.isPlaying = false;
        console.log(`Paused: ${this.currentSong.title}`);
        this.updateCurrentSongDisplay();
    },

    nextSong() {
        const predictedSong = predictNextSong();
        userHistory.push({ songId: predictedSong.id, timestamp: Date.now() });
        this.playSong(predictedSong);
    },

    setVolume(volume) {
        this.volume = volume;
        this.audioElement.volume = volume;
        console.log(`Volume set to: ${volume * 100}%`);
    },

    updateCurrentSongDisplay() {
        const currentSongDisplay = document.getElementById("currentSong");
        if (this.currentSong) {
            currentSongDisplay.textContent = `Currently playing: ${this.currentSong.title} by ${this.currentSong.artist}`;
        } else {
            currentSongDisplay.textContent = "No song is playing";
        }
    }
};

// Event listeners for player controls
document.getElementById("playBtn").addEventListener("click", () => {
    if (!musicPlayer.isPlaying) {
        if (musicPlayer.currentSong) {
            musicPlayer.playSong(musicPlayer.currentSong);
        } else {
            const firstSong = songs[0];
            musicPlayer.playSong(firstSong);
        }
    } else {
        musicPlayer.pauseSong();
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    musicPlayer.nextSong();
});

document.getElementById("volumeSlider").addEventListener("input", (event) => {
    const volume = event.target.value / 100;
    musicPlayer.setVolume(volume);
});

// Simulating user interface elements
document.body.innerHTML = `
    <div id="player">
        <button id="playBtn">Play/Pause</button>
        <button id="nextBtn">Next</button>
        <input id="volumeSlider" type="range" min="0" max="100" value="50">
        <div id="currentSong"></div>
    </div>
`;

// Initial display update
musicPlayer.updateCurrentSongDisplay();
