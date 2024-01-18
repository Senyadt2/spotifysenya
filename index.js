// console.log("erer");
let currentsong = new Audio();
let songs;
let currFolder = "songs";
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid Input";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  let a = await fetch(`songs/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
      // console.log(element.href);
    }
  }

  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  //showing all the songs from playlist in left side
  for (const song of songs) {
    // console.log(song);
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
    <img class="invert" src="music.svg" alt="" />
    <div class="info">
    <div class="songname">${decodeURI(song.split("/songs/")[1])}</div>
      <div class="songartist">Song Artist</div>
    </div>
    <div class="playnow">
      <span>Play now</span>
      <img src="play.svg" class="invert" alt="" />
    </div>
  </li>`;
  }
  //attach an event listner to each song from left side ko lis
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((element) => {
    // console.log(element);
    element.addEventListener("click", (e) => {
      // console.log(element.querySelector(".info .songname").textContent);
      //li bata nam leko
      playMusic(element.querySelector(".info .songname").textContent);
    });
  });
  // console.log(songs);
}
//clicked li play
const playMusic = (track, pause = false) => {
  currentsong.src = "songs/" + track;

  if (!pause) {
    // Play the audio only when initiated by a user action
    document.addEventListener("click", function playAudio() {
      currentsong.play();
      play.src = "pause.svg";
      document.removeEventListener("click", playAudio); // Remove the event listener after the first click
    });
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
  //get the list of all songs
  await getsongs("weeknd");
  //song ko name
  playMusic(songs[1].split("/songs/")[1]);

  //attach an event lister to play, next and previous
  let play = document.getElementById("play");
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });
  //listen for timeupdate event
  currentsong.addEventListener("timeupdate", (a) => {
    // console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      //black circle moves with this
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
    // console.log((currentsong.currentTime / currentsong.duration) * 100);
  });
  //Add an event lister to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100; //sakeko song's line
    // console.log(e.target.getBoundingClientRect().width, e.offsetX);
    document.querySelector(".circle").style.left = percent + "%";
    //conveted sakeko song's line back to normal  *  total time
    currentsong.currentTime = (percent / 100) * currentsong.duration;
  });
  //event for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.width = "100%";
  });
  //event for reverse - hamburger
  document.querySelector(".reverse-hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.width = "0%";
  });

  // Setup event listeners after fetching songs
  previous.addEventListener("click", () => {
    let song = [];
    songs.forEach((element) => {
      song.push(element.split(`/${currFolder}/`)[1]);
    });
    console.log(song);
    let index = song.indexOf(
      currentsong.src.split(`${currFolder}/`).slice(-1)[0]
    );
    console.log(currentsong.src.split(`${currFolder}/`).slice(-1)[0]);
    console.log(index);
    if (index - 1 >= 0) {
      console.log(currFolder);
      playMusic(song[index - 1]);
      console.log(song[index - 1]);
      // console.log(songs[index - 1].split(`${currFolder}/`).slice(-1)[0]);
    } else {
      playMusic(song[songs.length - 1]);
      // console.log(songs[songs.length - 1]);
    }
  });
  // Attach an event listener to next
  next.addEventListener("click", () => {
    let song = [];
    songs.forEach((element) => {
      song.push(element.split(`/${currFolder}/`)[1]);
    });
    let index = song.indexOf(
      currentsong.src.split(`${currFolder}/`).slice(-1)[0]
    );
    if (index + 1 < songs.length) {
      playMusic(song[index + 1]);
    } else {
      playMusic(song[0]);
    }
  });
  //event to volumn
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log(e.target.value);
      //e.target.value le 0 to 100 dinxha but .volumn vaneko 0 to 1 hunxha so convert garrna ko lagi
      currentsong.volume = parseInt(e.target.value) / 100;
      // console.log(parseInt(e.target.value) / 100);
    });
  //load the playlist when cliked on card
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log(e);
    e.addEventListener("click", async (item) => {
      // specific thau like img or h1 or p lai dekhauxha
      // console.log(item.target.dataset);
      //jata thiche ne dataset ko value  dekhauxha
      // console.log(item.currentTarget.dataset.folder);
      await getsongs(`${item.currentTarget.dataset.folder}`);
    });
  });
}
main();
