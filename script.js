const nomeMusica = document.getElementById('nome-musica');
const bandName = document.getElementById ('nome-banda');
const capa = document.getElementById ('capa-do-disco');
const song = document.getElementById('audio');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const progressoAtual = document.getElementById('progresso-atual');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('aleatorio');
const repeatButton = document.getElementById('repetir');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const NãoVouMentir = {
    nomeMusica : 'Não Vou Mentir',
    artista : 'Lagum',
    file: 'não_vou_mentir',
    liked: false,
}; 
const DoTeuLado = {
    nomeMusica : 'Do Teu Lado',
    artista : 'L7nnon',
    file: 'do_teu_lado',
    liked: false,
}; 
const SweaterWeather = {
    nomeMusica : 'Sweater Weather',
    artista : 'The Neighbourhood',
    file: 'sweater_weather',
    liked: true, 
}; 
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [NãoVouMentir, DoTeuLado, SweaterWeather];
let sortedPlaylist = [...originalPlaylist]; 
let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-fill');
    play.querySelector('.bi').classList.add('bi-pause-fill');
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-fill');
    play.querySelector('.bi').classList.remove('bi-pause-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else{
        playSong();
    }
}

function likeButtonRender(){
    if (sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

function initializeSong(){
    capa.src = `images/${sortedPlaylist[index].file}.webp`; 
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    nomeMusica.innerText = sortedPlaylist[index].nomeMusica;
    bandName.innerText = sortedPlaylist[index].artista;
    likeButtonRender(); 
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    } 
    else {
        index -= 1;  
    }
    initializeSong();
    playSong();
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    } 
    else {
        index += 1;  
    }
    initializeSong();
    playSong();
}

function updateProgress(){
    const barWidth = (song.currentTime/song.duration)*100;
    progressoAtual.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime; 
}

function shuffledArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1; 
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()* size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1; 

    }
}

function shuffleButtonClicked(){
    if (isShuffled === false){
        isShuffled = true;
        shuffledArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonButtonClicked() {
    if(repeatOn === false){
      repeatOn = true;
      repeatButton.classList.add('button-active');
    }  
    else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');  
    }
}

function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber) {
   let hours = Math.floor(originalNumber/3600);
   let min = Math.floor((originalNumber - hours * 3600)/60);
   let secs = Math.floor(originalNumber - hours* 3600 - min* 60);

   return `${hours.toString().padStart(2, '0')}:${min
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);song.duration;  
}

function likeButtonButtonClicked() {
    if(sortedPlaylist[index].liked === false){
      sortedPlaylist[index].liked = true;

    }
    else {
        sortedPlaylist[index].liked = false; 
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}




initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat); 
song.addEventListener('loadedmetadata', updateTotalTime); 
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonButtonClicked);
likeButton.addEventListener('click', likeButtonButtonClicked);