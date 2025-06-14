const playlistItems = document.querySelectorAll(".playlist-item");
const shareBtns = document.querySelectorAll(".share-btn");
const audioPlayer = document.getElementById("audioPlayer");
const volumeRange = document.getElementById("volume-range");
const progressBar = document.getElementById("progress-bar");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const addSongBtn = document.getElementById("addSongBtn");
const timeDisplay = document.getElementById("time-display");

// Validasi elemen DOM
if (!audioPlayer || !volumeRange || !progressBar || !playPauseBtn || !playPauseIcon || !prevBtn || !nextBtn || !shuffleBtn || !addSongBtn || !timeDisplay) {
  console.error("One or more DOM elements not found:", {
    audioPlayer, volumeRange, progressBar, playPauseBtn, playPauseIcon, prevBtn, nextBtn, shuffleBtn, addSongBtn, timeDisplay
  });
}

let currentSongIndex = 1;
let isSongLoaded = false;

const songs = [
  "https://github.com/quizpedia/assets/raw/main/Provers%20Code.mp3",
  "https://github.com/quizpedia/assets/raw/main/Prove%20Ur%20Love.mp3",
  "https://github.com/quizpedia/assets/raw/main/Stage%202.mp3",
  "https://github.com/quizpedia/assets/raw/main/Prove%20With%20Us.mp3",
  "https://github.com/quizpedia/assets/raw/main/Proof%20of%20the%20Future.mp3",
];

// Catatan: Ganti URL di atas dengan file lokal untuk menghindari masalah CORS, misalnya:
// const songs = ["path/to/local/SynCole-FeelGood.mp3", ...];

const songMetadata = [
  { title: "Provers Code", artist: "Rnoozy" },
  { title: "Prove Your Love", artist: "0XNEET" },
  { title: "Stage 2", artist: "Nvrlxst" },
  { title: "Prove With Us", artist: "Sayang" },
  { title: "Proof Of The Future", artist: "Quinn" },
];

const thumbnails = [
  "https://github.com/quizpedia/assets/raw/main/Rnoozy.jpg",
  "https://github.com/quizpedia/assets/raw/main/0XNEET.png",
  "https://github.com/quizpedia/assets/raw/main/Nvrlxst.jpg",
  "https://github.com/quizpedia/assets/raw/main/Sayang.jpg",
  "https://github.com/quizpedia/assets/raw/main/Quinn.jpg",
];

var swiper = new Swiper(".swiper", {
  effect: "cards",
  cardsEffect: {
    perSlideOffset: 8,
    perSlideRotate: 2,
    slideShadows: false,
  },
  grabCursor: true,
  speed: 700,
  initialSlide: 2,
  centeredSlides: true,
  slidesPerView: "auto",
});

swiper.on("slideChange", () => {
  const newIndex = swiper.realIndex;
  if (newIndex !== currentSongIndex) {
    currentSongIndex = newIndex;
    loadAndPlaySong(currentSongIndex);
    updatePlayPauseIcon(true);
  }
});

function updateSwiperToMatchSong(index) {
  if (swiper.activeIndex !== index) {
    swiper.slideTo(index);
  }
}

function updatePlaylistHighlight(index) {
  const playlistItems = document.querySelectorAll(".playlist-item");
  playlistItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active-playlist-item");
    } else {
      item.classList.remove("active-playlist-item");
    }
  });
}

function loadAndPlaySong(index) {
  if (!songs[index]) {
    console.error("Invalid song URL at index:", index);
    document.querySelector(".player").classList.add("error");
    return;
  }
  if (audioPlayer) {
    audioPlayer.src = songs[index];
    audioPlayer.load();
    playSong();
    updatePlaylistHighlight(index);
    updateSwiperToMatchSong(index);
    isSongLoaded = true;
  }
}

function pauseSong() {
  if (audioPlayer) audioPlayer.pause();
  updatePlayPauseIcon(false);
}

function playSong() {
  if (audioPlayer) {
    audioPlayer.play().then(() => {
      console.log("Audio playback started for:", audioPlayer.src);
      updatePlayPauseIcon(true);
    }).catch((error) => {
      console.error("Error playing audio:", error, "Source:", audioPlayer.src);
      updatePlayPauseIcon(false);
      document.querySelector(".player").classList.add("error");
    });
  }
}

function togglePlayPause() {
  if (!isSongLoaded) {
    loadAndPlaySong(currentSongIndex);
  } else if (audioPlayer && audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

function updatePlayPauseIcon(isPlaying) {
  if (playPauseIcon) {
    if (isPlaying) {
      playPauseIcon.classList.add("fa-pause");
      playPauseIcon.classList.remove("fa-play");
    } else {
      playPauseIcon.classList.add("fa-play");
      playPauseIcon.classList.remove("fa-pause");
    }
  }
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadAndPlaySong(currentSongIndex);
  swiper.slideTo(currentSongIndex);
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadAndPlaySong(currentSongIndex);
  swiper.slideTo(currentSongIndex);
}

function addSong(artist, title, duration, audioUrl, thumbnailUrl) {
  if (!audioUrl.match(/\.(mp3|wav)$/) || !thumbnailUrl.match(/\.(jpg|png|jpeg)$/)) {
    alert("Invalid audio or thumbnail URL. Please use .mp3/.wav or .jpg/.png/.jpeg files.");
    return;
  }

  songs.push(audioUrl);
  songMetadata.push({ title, artist });
  thumbnails.push(thumbnailUrl);

  const playlist = document.querySelector(".playlist");
  const newItem = document.createElement("div");
  newItem.classList.add("playlist-item");
  newItem.setAttribute("role", "listitem");
  newItem.innerHTML = `
    <img src="${thumbnailUrl}" alt="${artist} - ${title} album cover" loading="lazy">
    <div class="song">
      <p>${artist}</p>
      <p>${title}</p>
    </div>
    <p>${duration}</p>
    <button class="share-btn" aria-label="Share ${title} by ${artist}">
      <i class="fa-solid fa-share"></i>
    </button>
  `;
  playlist.appendChild(newItem);

  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const newSlide = document.createElement("div");
  newSlide.classList.add("swiper-slide");
  newSlide.innerHTML = `
    <img src="${thumbnailUrl}" alt="${artist} album cover" loading="lazy">
    <h1>${artist}</h1>
  `;
  swiperWrapper.appendChild(newSlide);
  swiper.update();

  const newIndex = songs.length - 1;
  newItem.addEventListener("click", () => {
    currentSongIndex = newIndex;
    loadAndPlaySong(newIndex);
  });

  const newShareBtn = newItem.querySelector(".share-btn");
  newShareBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const song = songMetadata[newIndex];
    const siteUrl = "https://succinct-playlist.vercel.app/";
    const tweetText = `Listening to "${song.title}" by ${song.artist} on a Succinct music player powered by Provers! 🎵 Check it out: ${siteUrl} #ProveWithUs #SuccinctMusic`;
    const tweetUrl = encodeURIComponent(tweetText);
    window.open(`https://x.com/intent/tweet?text=${tweetUrl}`, '_blank', 'width=550,height=420');
    newShareBtn.classList.add("share-active");
    setTimeout(() => {
      newShareBtn.classList.remove("share-active");
    }, 500);
  });

  attachPlaylistListeners();
}

function attachPlaylistListeners() {
  const playlistItems = document.querySelectorAll(".playlist-item");
  playlistItems.forEach((item, index) => {
    item.removeEventListener("click", handlePlaylistClick);
    item.addEventListener("click", handlePlaylistClick);
  });
}

function handlePlaylistClick(event) {
  const index = Array.from(document.querySelectorAll(".playlist-item")).indexOf(event.currentTarget);
  currentSongIndex = index;
  loadAndPlaySong(index);
}

attachPlaylistListeners();

if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlayPause);
if (nextBtn) nextBtn.addEventListener("click", nextSong);
if (prevBtn) prevBtn.addEventListener("click", prevSong);
if (addSongBtn) addSongBtn.addEventListener("click", () => {
  addSong(
    "New Artist",
    "New Song",
    "3:00",
    "https://example.com/new-song.mp3",
    "https://example.com/new-song-image.jpg"
  );
});

// Inisialisasi progress bar dan volume range
if (progressBar && volumeRange) {
  progressBar.min = 0;
  progressBar.value = 0;
  volumeRange.min = 0;
  volumeRange.max = 100;
  volumeRange.value = audioPlayer ? audioPlayer.volume * 100 : 50;
  if (volumeRange.style) {
    volumeRange.style.setProperty('--volume-value', `${volumeRange.value}%`);
  }
} else {
  console.error("progressBar or volumeRange not found during initialization");
}

if (audioPlayer) {
  audioPlayer.addEventListener("loadedmetadata", () => {
    if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
      if (progressBar) {
        progressBar.max = audioPlayer.duration;
        progressBar.value = audioPlayer.currentTime;
        progressBar.style.setProperty('--progress-value', '0%');
        console.log("Metadata loaded: duration =", audioPlayer.duration, "progressBar.max =", progressBar.max);
      }
      if (timeDisplay) {
        updateTimeDisplay();
      }
    } else {
      console.error("Invalid duration:", audioPlayer.duration, "Source:", audioPlayer.src);
      document.querySelector(".player").classList.add("error");
    }
    if (volumeRange) {
      volumeRange.value = audioPlayer.volume * 100;
      volumeRange.style.setProperty('--volume-value', `${volumeRange.value}%`);
      console.log("Initial volume set to:", audioPlayer.volume);
    }
  });

  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration) && !isNaN(audioPlayer.currentTime) && !audioPlayer.paused) {
      if (progressBar) {
        progressBar.value = audioPlayer.currentTime;
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.setProperty('--progress-value', `${progressPercent}%`);
        console.log("Timeupdate: progressBar.value =", progressBar.value, "max =", progressBar.max);
      }
      if (timeDisplay) {
        updateTimeDisplay();
      }
    } else {
      console.log("Timeupdate skipped: paused =", audioPlayer.paused, "currentTime =", audioPlayer.currentTime, "duration =", audioPlayer.duration);
    }
  });

  audioPlayer.addEventListener("canplay", () => {
    console.log("Audio can play, duration:", audioPlayer.duration, "Source:", audioPlayer.src);
  });

  audioPlayer.addEventListener("volumechange", () => {
    if (volumeRange) {
      volumeRange.value = audioPlayer.volume * 100;
      volumeRange.style.setProperty('--volume-value', `${volumeRange.value}%`);
      console.log("Volume changed to:", audioPlayer.volume);
    }
  });

  audioPlayer.addEventListener("error", (e) => {
    console.error("Audio error:", e.message, "Source:", audioPlayer.src);
    document.querySelector(".player").classList.add("error");
  });

  if (progressBar) {
    progressBar.addEventListener("input", () => {
      if (!isNaN(audioPlayer.duration) && !isNaN(progressBar.value)) {
        audioPlayer.currentTime = progressBar.value;
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.setProperty('--progress-value', `${progressPercent}%`);
        console.log("Seek to:", progressBar.value);
      } else {
        console.error("Invalid seek value:", progressBar.value, "duration:", audioPlayer.duration);
      }
    });

    progressBar.addEventListener("change", () => {
      if (audioPlayer.paused) {
        playSong();
      }
    });
  }

  if (volumeRange) {
    volumeRange.addEventListener("input", () => {
      const newVolume = volumeRange.value / 100;
      if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1) {
        audioPlayer.volume = newVolume;
        volumeRange.style.setProperty('--volume-value', `${volumeRange.value}%`);
        console.log("Volume adjusted to:", audioPlayer.volume);
      } else {
        console.error("Invalid volume value:", newVolume);
      }
    });
  }

  audioPlayer.addEventListener("ended", nextSong);
}

if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    if (randomIndex !== currentSongIndex) {
      currentSongIndex = randomIndex;
      loadAndPlaySong(currentSongIndex);
    } else {
      const nextRandomIndex = (randomIndex + 1) % songs.length;
      currentSongIndex = nextRandomIndex;
      loadAndPlaySong(currentSongIndex);
    }
  });
}

if (shareBtns) {
  shareBtns.forEach((shareBtn, index) => {
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const song = songMetadata[index];
      const siteUrl = "https://succinct-playlist.vercel.app/";
      const tweetText = `Gprove... 🎶 
Just vibin’, listening "${song.title}" by ${song.artist} on Succinct music player. You gotta hear this:
${siteUrl}
#ProveWithUs #SuccinctStars`;
      const tweetUrl = encodeURIComponent(tweetText);
      window.open(`https://x.com/intent/tweet?text=${tweetUrl}`, '_blank', 'width=550,height=420');
      shareBtn.classList.add("share-active");
      setTimeout(() => {
        shareBtn.classList.remove("share-active");
      }, 500);
    });
  });
}

// Fungsi untuk memperbarui tampilan waktu
function updateTimeDisplay() {
  if (timeDisplay && audioPlayer) {
    const currentTime = formatTime(audioPlayer.currentTime);
    const duration = formatTime(audioPlayer.duration);
    timeDisplay.textContent = `${currentTime} / ${duration}`;
  }
}

// Fungsi untuk format waktu (menit:detik)
function formatTime(seconds) {
  if (isNaN(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
