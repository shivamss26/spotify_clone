
async function fetchAndDisplayData() {
  try {
    const response = await fetch("http://127.0.0.1:5500/songs/");

    const convert = await response.text();
    let div = document.createElement("div");
    div.innerHTML = convert;

    let as = div.getElementsByTagName("a");
    console.log(as);

    const songs = [];
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href);
      }

    }

    return songs;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}



// const main = async (setStatus) => {
//   console.log(setStatus)
//   let songs = await fetchAndDisplayData();
//   let audio = new Audio(songs[0]);

//   if(setStatus){
//     audio.play();
//   }
//   else{
//     audio.pause();
//   }
// }

const main = async (setStatus) => {
  try {
    console.log(setStatus);

    // Fetch the songs data
    let songs = await fetchAndDisplayData();

    // Check if songs is an array and not empty
    if (Array.isArray(songs) && songs.length > 0) {
      let audio = new Audio(songs[0]);

      // Check if setStatus is true or false to play or pause the audio
      if (setStatus) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      console.error("No songs found or songs is not an array");
    }
  } catch (error) {
    console.error("Error fetching or playing songs:", error);
  }
};


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
  { songId: 1, timestamp: Date.now() - 20000 },
];

// Function to simulate song prediction based on user history
function predictNextSong() {
  const songCount = {};

  // Count occurrences of each song in user history
  userHistory.forEach(entry => {
      if (songCount[entry.songId]) {
          songCount[entry.songId]++;
      } else {
          songCount[entry.songId] = 1;
      }
  });

  // Find the most listened song
  const mostListenedSongId = Object.keys(songCount).reduce((a, b) => 
      songCount[a] > songCount[b] ? a : b
  );

  // Predict the next song based on the most listened song
  const nextSongId = (parseInt(mostListenedSongId) % songs.length) + 1;

  return songs.find(song => song.id === nextSongId);
}

// Music player object
const musicPlayer = {
  currentSong: null,
  isPlaying: false,
  audioElement: new Audio(),

  playSong(song) {
      this.currentSong = song;
      this.audioElement.src = `path/to/songs/${song.title}.mp3`;
      this.audioElement.play();
      this.isPlaying = true;
      console.log(`Playing: ${song.title} by ${song.artist}`);
  },

  pauseSong() {
      this.audioElement.pause();
      this.isPlaying = false;
      console.log(`Paused: ${this.currentSong.title}`);
  },

  nextSong() {
      const predictedSong = predictNextSong();
      this.playSong(predictedSong);
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

// Simulating user interface elements
document.body.innerHTML = `
  <div id="player">
      <button id="playBtn">Play/Pause</button>
      <button id="nextBtn">Next</button>
      <div id="currentSong"></div>
  </div>
`;

// Update the current song display
function updateCurrentSongDisplay() {
  const currentSongDisplay = document.getElementById("currentSong");
  if (musicPlayer.currentSong) {
      currentSongDisplay.textContent = `Currently playing: ${musicPlayer.currentSong.title} by ${musicPlayer.currentSong.artist}`;
  } else {
      currentSongDisplay.textContent = "No song is playing";
  }
}

// Updating the display when the song changes
musicPlayer.audioElement.addEventListener("play", updateCurrentSongDisplay);
musicPlayer.audioElement.addEventListener("pause", updateCurrentSongDisplay);
musicPlayer.audioElement.addEventListener("ended", () => {
  musicPlayer.nextSong();
  updateCurrentSongDisplay();
});

// Initial display update
updateCurrentSongDisplay();
