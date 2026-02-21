async function getsongs() {

    let b = await fetch('http://127.0.0.1:3000/songs/');
    let data = await b.text();
    console.log(data);

    // Parse the fetched HTML
    let parser = new DOMParser();
    let doc = parser.parseFromString(data, "text/html");

    // Now get <a> tags from the parsed document
    let allanchorelements = doc.getElementsByTagName('a');

    let songs = [];

    for (let i = 0; i < allanchorelements.length; i++) {
        let allawithhref = allanchorelements[i].href;
        if (allawithhref.endsWith('.mp3')) {
            songs.push(allawithhref);
        }
    }

    return songs;

}

async function main() {

    let songs = await getsongs();
    console.log(songs);

    songs = songs.map(song => song.replace(/%20/g, " "));
    songs = songs.map(song => song.split("%5C").pop());

    console.log(songs);

    let orderedSongs = [
        songs.find(s => s.includes("Arz Kiya Hai (Coke Studio Bharat) - Anuv Jain.mp3")),
        songs.find(s => s.includes("For A Reason - Karan Aujla, Ikky.mp3")),
        songs.find(s => s.includes("Balenci - Shubh.mp3")),
        songs.find(s => s.includes("Kanwal - Afusic ft. Hasan Raheem.mp3")),
        songs.find(s => s.includes("Ehsaas - Faheem Abdullah, Duha Shah, Vaibhav Pani, Hyder Dar.mp3"))
    ]

    let displaySongs = orderedSongs.map(song => song.replace(".mp3", ""));

    let audio = new Audio;
    let currentIndex = -1;

    function playSong(index) {
        currentIndex = index;

        audio.src = "http://127.0.0.1:3000/songs/" + orderedSongs[index];
        audio.play();

        songinfo.innerHTML = `${displaySongs[index]}`;

        playbuttons.forEach(img => img.src = "images/play.svg");
        playsongimg.forEach(img => img.src = "images/playsong.svg");
        Playerplaybutton.src = "images/pause.svg";

        if (playbuttons[index]) playbuttons[index].src = "images/pause.svg";
        if (playsongimg[index]) playsongimg[index].src = "images/pause.svg";
    }


    let Playerplaybutton = document.querySelector(".playsong2");


    let songscontainer = document.querySelector(".songscont");
    songscontainer.innerHTML = "<ul></ul>";

    displaySongs.forEach(song => {
        songscontainer.querySelector("ul").innerHTML += `<li><div class="songname">${song}</div> <span>Play Now <img src=images/playsong.svg alt="playsong"></span> </li>`
    });


    let playbuttons = document.querySelectorAll(".card .playbutton img");

    playbuttons.forEach((button, index) => {
        button.addEventListener("click", () => {

            if (currentIndex !== index || audio.paused) {
                playSong(index);
            }

            else {
                audio.pause();
                button.src = "images/play.svg";
                Playerplaybutton.src = "images/playsong.svg";
                playsongimg[index].src = "images/playsong.svg";
            }

        });

    });

    let songinfo = document.querySelector(".songname2");
    songinfo.innerHTML = `${displaySongs[0]}`;
    audio.src = "http://127.0.0.1:3000/songs/" + orderedSongs[0];
    currentIndex = 0;

    let playsong = document.querySelectorAll(".songscont span");
    let playsongimg = document.querySelectorAll(".songscont img");
    console.log(playsongimg);

    playsong.forEach((button, index) => {
        button.addEventListener("click", () => {

            if (currentIndex !== index || audio.paused) {
                playSong(index);

            }

            else {
                audio.pause();
                playsongimg[index].src = "images/playsong.svg";
                Playerplaybutton.src = "images/playsong.svg";
                playbuttons[index].src = "images/play.svg";
            }

        });

    });

    Playerplaybutton.addEventListener("click", () => {

        if (audio.paused) {
            // If nothing loaded, load first song
            if (!audio.src) {
                playSong(0);
            } else {
                audio.play();
                Playerplaybutton.src = "images/pause.svg";
                if (playbuttons[currentIndex]) playbuttons[currentIndex].src = "images/pause.svg";
                if (playsongimg[currentIndex]) playsongimg[currentIndex].src = "images/pause.svg";
            }
        } else {
            // Pause current song
            audio.pause();
            Playerplaybutton.src = "images/playsong.svg";
            if (playbuttons[currentIndex]) playbuttons[currentIndex].src = "images/play.svg";
            if (playsongimg[currentIndex]) playsongimg[currentIndex].src = "images/playsong.svg";
        }
    });

    // When song ends, reset icon back to play

    audio.addEventListener("ended", () => {
        if (currentIndex !== -1) {
            // Reset all icons
            if (playbuttons[currentIndex]) playbuttons[currentIndex].src = "images/play.svg";
            if (playsongimg[currentIndex]) playsongimg[currentIndex].src = "images/playsong.svg";
            Playerplaybutton.src = "images/playsong.svg";

            // Optionally: auto-play next song
            // currentIndex = (currentIndex + 1) % orderedSongs.length;
            // playSong(currentIndex);
        }
    });



    let Playerpreviousbutton = document.querySelector(".previoussong");

    Playerpreviousbutton.addEventListener("click", () => {
        if (currentIndex === -1) currentIndex = orderedSongs.length - 1;
        else currentIndex = (currentIndex - 1 + orderedSongs.length) % orderedSongs.length;
        playSong(currentIndex);
    });


    let Playernextbutton = document.querySelector(".nextsong");

    Playernextbutton.addEventListener("click", () => {
        if (currentIndex === -1) currentIndex = 0;
        else currentIndex = (currentIndex + 1) % orderedSongs.length;
        playSong(currentIndex);
    });


    let timeElement = document.querySelector(".time");
    let seekbar = document.querySelector(".seekbar");
    let circle = seekbar.querySelector("img");

    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);

        if (secs < 10) secs = "0" + secs;
        return `${mins}:${secs}`;
    }

    audio.addEventListener("loadedmetadata", () => {
        timeElement.textContent = `00:00 / ${formatTime(audio.duration)}`;
    })

    audio.addEventListener("timeupdate", () => {
        timeElement.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

        if (audio.duration) {
            let percent = (audio.currentTime / audio.duration) * 99;
            circle.style.left = percent + "%";
        }
    })

    // Seek when user clicks on bar
    seekbar.addEventListener("click", (e) => {
        let rect = seekbar.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let percent = offsetX / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Adding an event listener to Hamburger
    let hamburger = document.querySelector(".Hamburger");
    let left = document.querySelector(".left");

    hamburger.addEventListener("click", () => {
        left.classList.add("active");
        document.body.classList.add("noscroll");


    });

    // Adding an event listener to Cross
    let cross = document.querySelector(".cross");

    cross.addEventListener("click", () => {
        left.classList.remove("active");
        document.body.classList.remove("noscroll");
    })

    let volumebar = document.querySelector(".volumecont input");

    // When user moves the volume slider
    volumebar.addEventListener("input", () => {
        audio.volume = volumebar.value; 
    });

    let volumeimg = document.querySelector(".volume");

    volumeimg.addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            audio.volume = 0;
            volumebar.value = 0;
        }     

        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            audio.volume = 0.10;
            volumebar.value = 0.10;

        }
        
    })




}

main();



