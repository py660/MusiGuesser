window.playlist = confirm("Christmas theme?") ? /*["37i9dQZF1DX0Yxoavh5qJV"]*/ ["1cSe1tbdYYYnyoP93yJlRA"] : [
        "37i9dQZF1DWSThc8QnzIme", // Pop Drive (140)
        "37i9dQZF1DXcBWIGoYBM5M", // Today's Top Hits (50)
        "37i9dQZF1DX0kbJZpiYdZl", // Hot Hits USA (50)
        "37i9dQZF1DX5dpn9ROb26T", // Best Pop Songs of 2022 (75)
        "37i9dQZF1DXa2PvUpywmrr", // Party Hits (90)
        "37i9dQZF1DWVmX5LMTOKPw", // Best Hit Songs of 2022 (50)
        "37i9dQZF1DX0b1hHYQtJjp", // Just Good Music (60)
        "7yVlImzPqbVdr8b6oBE7Sa" // Spotify API Demo [Custom Playlist] (21)
    ];
let songs = [];
let id = 0; //Song index

let explicit = !confirm("Disable explicit content?"); //Allow explict content?

let audioObject;
let playing;
let timeStarted = 0;

let iframeElement = document.createElement("iframe");

let score = 0;
let songNumber = 0; //Song number so far (will turn into 1 when first round starts, matching the current status in index.html)
let status = -1; // -1 = still loading, 0 = show gamediv, 1 = play audio, 2 = submit, 3 = restart
// 0 -> 1 -> 2 -> 3 -> 1 -> 2... etc.
let playbtn = document.getElementById("play");
let restartbtn = document.getElementById("restart");
let settingsbtn = document.getElementById("settings");
let openFullSong = document.getElementById("open");

let hudSongNumber = document.getElementById("songnumber");
let hudStatus = document.getElementById("status");
let hudPoints = document.getElementById("points");
let hudTime = document.getElementById("time");

let pregameSection = document.getElementById("pregamesection");
let answerSection = document.getElementById("answersection");
let resultSection = document.getElementById("resultsection");

let titleInput = document.getElementById("titleinput");
let artistInput = document.getElementById("artistinput");
let titleAnswer = document.getElementById("titleanswer");
let artistAnswer = document.getElementById("artistanswer");

titleInput.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 13) {
        btnPress();
    }
});
artistInput.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 13) {
        btnPress();
    }
});

openFullSong.addEventListener("click", () => {
    window.open(playing.url);
});

window.focus()

window.addEventListener("blur", () => {
  setTimeout(() => {
    if (document.activeElement.tagName === "IFRAME") {
      audioObject.pause();
    }
  });
}, { once: false });

/*RestartBTN*/
function restart(){
    window.playlist = confirm("Christmas theme?") ? ["1cSe1tbdYYYnyoP93yJlRA"] : [
        "37i9dQZF1DWSThc8QnzIme", // Pop Drive (140)
        "37i9dQZF1DXcBWIGoYBM5M", // Today's Top Hits (50)
        "37i9dQZF1DX0kbJZpiYdZl", // Hot Hits USA (50)
        "37i9dQZF1DX5dpn9ROb26T", // Best Pop Songs of 2022 (75)
        "37i9dQZF1DXa2PvUpywmrr", // Party Hits (90)
        "37i9dQZF1DWVmX5LMTOKPw", // Best Hit Songs of 2022 (50)
        "37i9dQZF1DX0b1hHYQtJjp", // Just Good Music (60)
        "7yVlImzPqbVdr8b6oBE7Sa" // Spotify API Demo [Custom Playlist] (21)
    ];
    let id = 0;
    let explicit = !confirm("Disable explicit content?"); //Allow explict content?
    if (audioObject){
        audioObject.pause();
        audioObject.remove();
    }
    audioObject = null;
    playing = null;
    timeStarted = 0;
    hudPoints.innerText = "0";
    score = 0;
    songNumber = 0;
    status = -1;
    for (let pid of playlist){
        enumPlist(pid);
    }
    playbtn.innerText = "Loading Song Index...";
    playbtn.disabled = "true";
    shrinkDiv();
}
restartbtn.addEventListener("click", restart);

/*HUD*/
setInterval(()=>{
    if (parseInt(hudPoints.innerText) != score){
        hudPoints.innerText = parseInt(hudPoints.innerText) + Math.ceil((score - 
parseInt(hudPoints.innerText))/50);
    }
}, 25);
setInterval(()=>{
    if (timeStarted == 2){
        hudTime.innerText = new Date(new Date() - playing.date).toISOString().substring(14, 19) + "." + parseInt(new Date(new Date() - playing.date).getMilliseconds().toString().substring(0, 2)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        hudTime.style.color = (new Date().getTime() - playing.date.getTime() > 30 * 1000) ? "var(--danger)" : "var(--fore)"
    }
    // 1 => Hold the time, don't change it.
    if (timeStarted == 0){
        hudTime.innerText = "00:00.00"
    }
}, 10);

/*ENUMPLIST*/
function shuffle(array){ 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}
function enumPlist(pid, offset){
    offset = offset || 0;
    $.ajax({
        url: 'https://musiguesser.python660.repl.co/v1/playlists/' + pid + '/tracks?offset=' + offset,
        success: function(response){
            //console.log(response.items);

            for (let song of response.items){
                console.log(song);
                //console.log(song.track.name, "\n", "By: ", song.track.artists[0].name);
                if (song.track.preview_url){
                    if (explicit || !song.track.explicit){
                        songs.push({
                            name: song.track.name, 
                            artist: song.track.artists[0].name,
                            preview: song.track.preview_url,
                            url: song.track.external_urls.spotify,
                            href: song.track.href,
                            id: song.track.id,
                            art: song.track.album.images[0].url,
                            orig: song
                        });
                    }
                }
            }
            if (response.items.length == 100){
                enumPlist(pid, offset + 100);
            }
            else{
                songs = shuffle(songs);
                console.log(songs.length + " songs retrieved so far.");
                playbtn.innerText = "Start Game";
                playbtn.disabled = false;
                animate(playbtn, "animate__bounce");
                status = 0;
            }
        }
    })
}
for (let pid of playlist){
    enumPlist(pid);// NOTICE THIS IS ASYNC MEANING THAT THE SONGS WON'T BE READY YET!!!!!
}


/*INTERNAL*/
function animate(e, a){
    e.classList.add(a);
    setTimeout(()=>{e.classList.remove(a)}, 1500);
}
function audio(url){
    try {
       audioObject.pause();
    } catch (error) {
       console.log("audio was never playing");
    }
    audioObject = new Audio(url);
    audioObject.play();
}
function updateScore(titleScore, artistScore){
    score = score + titleScore + artistScore;
}

/*BTNPRESS*/
function btnPress(){
    if (status == -1){
        return;
    }
    else if (status == 0){
        hudStatus.innerText = "Ready!";
        
        pregameSection.style.display = "block";
        answerSection.style.display = "none";
        resultSection.style.display = "none";
        
        growDiv();
        playbtn.innerText = "Play Song";
    }
    else if (status%2 == 1){
        playbtn.innerText = "Loading...";
        
        pregameSection.style.display = "none";
        answerSection.style.display = "block";
        resultSection.style.display = "none";
        iframeElement.remove();
        selectSong();

        timeStarted = 2;

        songNumber++;
        hudSongNumber.innerText = "#" + songNumber;
        hudStatus.innerText = "Recognise the tune?";
        playbtn.innerText = "Submit Guess";
    }
    else if (status%2 == 0){
        
        pregameSection.style.display = "none";
        answerSection.style.display = "none";
        resultSection.style.display = "block";

        timeStarted = 1;

        let [titleCorrect, artistCorrect, titleScore, artistScore] = checkGuess(titleInput.innerText, artistInput.innerText);
        titleInput.innerText = "";
        artistInput.innerText = "";

        if (titleCorrect && artistCorrect){
            hudStatus.innerText = "Correct! +" + (titleScore + artistScore) + " points";
            hudStatus.style.backgroundColor = "#32a852";
        }
        else if (! (titleCorrect || artistCorrect)){
            hudStatus.innerText = "Incorrect... +" + (titleScore + artistScore) + " points";
            hudStatus.style.backgroundColor = "#eb4034";
        }
        else{
            hudStatus.innerText = "Partially Correct! +" + (titleScore + artistScore) + " points";
            hudStatus.style.backgroundColor = "#fcba03";
        }
        setTimeout(()=>{hudStatus.style.backgroundColor = "var(--primary)";}, 1000);
        

        updateScore(titleScore, artistScore);
        
        playbtn.innerText = "Play Next Song";
    }
    else {
        alert("Something bad happened; prepare for imminent self-destruction.");
    }
    
    
    status += 1;
}
playbtn.addEventListener("click", btnPress);

function selectSong(){
    let selected = songs[id];
    id++;
    if (id>=songs.length){
        id = 0;
        shuffle(songs);
    }
    //console.log(selected);
    playing = {title: selected.name, artist: selected.artist, date: new Date(), url: selected.url};
    audio(selected.preview);
    titleAnswer.innerText = selected.name;
    artistAnswer.innerText = selected.artist;
    /*
    <iframe id="songiframe" loading="lazy" style="border-radius:12px" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    */
    //console.log(selected.url.split("/").splice(3, 0, "embed")/*.join("/")*/);
    let urlSplit = selected.url.split("/");
    urlSplit.splice(3, 0, "embed");
    //console.log(urlSplit)
    iframeElement = document.createElement('iframe');
    iframeElement.src = urlSplit.join("/");
    iframeElement.style.borderRadius = "12px";
    iframeElement.style.width = "100%";
    iframeElement.style.height = "352px";
    iframeElement.frameBorder = "0";
    iframeElement.allowfullscreen = "";
    iframeElement.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    resultSection.appendChild(iframeElement);  
}

/*CLEANING*/
function smartSplit(string, start, end){
    a = string.split(start)[0]
    b = string.split(end)[1]
    return a ? a : b
}
function clean(string){
    if (!string) return "";
    string = smartSplit(
        smartSplit(
            string.split(" -")[0], "(", ")"
        ), "[", "]")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    var out = "";
    for (let c of string){
        if ("abcdefghijklmnopqrstuvwxyz".includes(c)){
            out = out + c;
        }
    }
    return out;
}

// Check out my desmos for more info on the algorith!
// https://www.desmos.com/calculator/n6jfjahpns
/*CHECKGUESS*/
function checkGuess(title, artist){
    let titleDiff = patienceDiffPlus(clean(title), clean(playing.title));
    let artistDiff = patienceDiffPlus(clean(artist), clean(playing.artist));
    console.log("PatienceDiff results:", titleDiff, artistDiff);
    let titleAccuracy = titleDiff.lines.length;
    let artistAccuracy = artistDiff.lines.length;

    for (let char of titleDiff.lines){
        if (char.aIndex == -1 || char.bIndex == -1){
            titleAccuracy--;
        }
    }
    for (let char of artistDiff.lines){
        if (char.aIndex == -1 || char.bIndex == -1){
            artistAccuracy--;
        }
    }
    let titleAccuracyPercent = (titleAccuracy + 1) / (titleDiff.lines.length + 1); // Prevent NaN
    let artistAccuracyPercent = (artistAccuracy + 1) / (artistDiff.lines.length + 1);
    let timePercent = (new Date().getTime() - playing.date.getTime()) / (30 * 1000);
    console.log("Title Accuracy (out of 1): " + titleAccuracyPercent)
    console.log("Artist Accuracy (out of 1): " + artistAccuracyPercent)
    console.log("Time Used (out of 1): " + timePercent);
    let a = Math.min(500, 550 - 500*timePercent)
    let b = Math.max(0-a, Math.sqrt(titleAccuracyPercent)*4000 - 3500)
    let c = Math.min(500, 550 - 500*timePercent)
    let d = Math.max(0-c, Math.sqrt(artistAccuracyPercent)*4000 - 3500)
    //console.log(a+b, c+d)
    let e = titleAccuracyPercent==1 ? 250:0
    let f = artistAccuracyPercent==1 ? 250:0
    return [titleAccuracyPercent==1, artistAccuracyPercent==1, Math.round(a+b) + e, Math.round(c+d) + f];
}
