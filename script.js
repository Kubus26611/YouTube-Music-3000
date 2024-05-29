document.addEventListener('DOMContentLoaded', () => {
    showTime();
    loadTrack(track_index);
    generateSongList();
});

function showTime() {
    const timeElem = document.getElementById('time');
    const update = () => {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        timeElem.innerText = timeString;
        requestAnimationFrame(update);
    };
    update();
}

let track_index = 0;
let isPlaying = false;
let updateTimer;

const music_list = [
    { img: 'images/stay.png', name: 'Stay', artist: 'The Kid LAROI, Justin Bieber', music: 'music/stay.mp3' },
    { img: 'images/fallingdown.jpg', name: 'Falling Down', artist: 'Wid Cards', music: 'music/fallingdown.mp3' },
    { img: 'images/faded.png', name: 'Faded', artist: 'Alan Walker', music: 'music/Faded.mp3' },
    { img: 'images/ratherbe.jpg', name: 'Rather Be', artist: 'Clean Bandit', music: 'music/Rather Be.mp3' }
];

const track_art = document.querySelector('.track-art');
const track_name = document.querySelector('.track-name');
const track_artist = document.querySelector('.track-artist');
const curr_time = document.querySelector('.current-time');
const total_duration = document.querySelector('.total-duration');
const seek_slider = document.querySelector('.seek-slider');
const playpause_btn = document.querySelector('.playpause-track');
const song_list = document.getElementById('song-list');
const curr_track = new Audio();

function loadTrack(index) {
    clearInterval(updateTimer);
    resetValues();
    const track = music_list[index];
    curr_track.src = track.music;
    curr_track.load();

    track_art.style.backgroundImage = `url(${track.img})`;
    track_name.textContent = track.name;
    track_artist.textContent = track.artist;
    updateTimer = setInterval(setUpdate, 1000);
    curr_track.addEventListener('ended', nextTrack);
}

function resetValues() {
    curr_time.textContent = '00:00';
    total_duration.textContent = '00:30';
    seek_slider.value = 0;
}

function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
    track_index = (track_index + 1) % music_list.length;
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    track_index = (track_index - 1 + music_list.length) % music_list.length;
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    const seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setUpdate() {
    if (!isNaN(curr_track.duration)) {
        const seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        const currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime % 60);
        const durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration % 60);

        currentSeconds = currentSeconds < 10 ? '0' + currentSeconds : currentSeconds;
        durationSeconds = durationSeconds < 10 ? '0' + durationSeconds : durationSeconds;

        curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
        total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
    }
}

function generateSongList() {
    const fragment = document.createDocumentFragment();
    music_list.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('song-item');
        li.innerHTML = `
            <div class="song-thumb" style="background-image: url('${song.img}');"></div>
            <div class="song-info">
                <p class="song-name">${song.name}</p>
                <p class="song-artist">${song.artist}</p>
            </div>
        `;
        li.addEventListener('click', () => {
            loadTrack(index);
            playTrack();
        });
        fragment.appendChild(li);
    });
    song_list.innerHTML = '';
    song_list.appendChild(fragment);
}
