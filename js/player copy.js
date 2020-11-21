var currentList, displayedList, temp, nextTrack, listIndex = 0,
    current = 0,
    ready = 1,
    scrubbing = false;
var seekbar = document.getElementById('seekbar');
var tracktime = document.getElementById('tracktime');
var aLoading = document.getElementById('aLoading');
var pCover = document.getElementById('pCover');
var pName = document.getElementById('pName');
var pAlbum = document.getElementById('pAlbum');
var tracklength = document.getElementById('tracklength');

var pSpot = document.getElementById('pSpot');
var pYou = document.getElementById('pYou');
var pSC = document.getElementById('pSC');

var audios = document.getElementById('audios');
for (var i = 0; i < 2; i++) {
    var u = document.createElement('audio');
    u.setAttribute('preload','auto');
    audios.appendChild(u);
}
var a = document.getElementById('audios').children;
var playpause = document.getElementById('playpause');
var scrub = document.getElementById('scrub');
var scrubvis = document.getElementById('scrubvis');
var sharesong = document.getElementById('sharesong');


document.getElementById('stickyB').style.visibility = 'visible';




class testSlot {
    constructor(id, row) {
        this.row = row;
        this.a = new Audio();
        this.state = 0;
        this.tdat = tracks.find(t => t.songid === id);
        this.lineR = null;
        this.loadR = null;
        this.loadFR = null;
        this.abortR = null;
    }
    init() {
        var abortRef = this.abort.bind(this);
        this.abortR = abortRef;
        document.addEventListener('fakeimageupdate', abortRef, {once:true});
        var lineUpRef = this.lineUp.bind(this);
        this.lineR = lineUpRef;
        if(theImage.complete){
            lineUpRef();
        } else {
            console.log('waiting');
            this.state = 0;
            console.log(this.row + ': state 0');
            theImage.addEventListener('load', lineUpRef, {once:true});
        }
    }
    abort() {
        console.log(this.row + ': aborting slot');
        var lineUpRef = this.lineR;
        var startLoadRef = this.loadR;
        var loadFinRef = this.loadFR;
        this.a.setAttribute('src','');
        this.a.removeEventListener('myplaythrough', loadFinRef);
        slots[+!this.row].a.removeEventListener('myplaythrough', startLoadRef);
        theImage.removeEventListener('load', lineUpRef);
    }
    lineUp() {
        var startLoadRef = this.startLoad.bind(this);
        this.loadR = startLoadRef;
        if(this.row==current || slots[+!this.row].state==3){
            startLoadRef();
        } else {
            this.state = 1;
            console.log(this.row + ': state 1');
            slots[+!this.row].a.addEventListener('myplaythrough', startLoadRef, {once:true});
        }
    }
    startLoad() {
        var loadFinRef = this.loadFin.bind(this);
        this.loadFR = loadFinRef;
        this.row==current && showLoading(true);
        this.a.setAttribute('src', '/'+this.tdat.filePath);
        console.log(this.row, this.a)
        this.a.load();
        this.state = 2;
        console.log(this.row + ': state 2');
        this.a.addEventListener('myplaythrough', loadFinRef, {once:true})
    }
    loadFin() {
        var abortRef = this.abortR;
        this.state = 3;
        document.removeEventListener('fakeimageupdate', abortRef);
        console.log(this.row + ': state 3');
    }
}

var slots = [
    new testSlot('tension', 0),
    new testSlot('tension', 1)
]

document.addEventListener('fakeimageupdate', function() {
    slots[1].state = 3;
    slots[0].init();
});
// inst.state = 3;
// console.log(inst.state);


// var slot = [
//     {audio:a[0], tdat:tracks[0], state:3},
//     {audio:a[1], tdat:tracks[1], state:3}
// ]

// function initSong(id, x){
//     function abort(e, dry=false){
//         console.log(x + ': aborting slot');
//         slot[x].audio.setAttribute('src','');
//         slot[x].audio.removeEventListener('myplaythrough', loadFinished);
//         slot[+!x].audio.removeEventListener('myplaythrough', startLoad);
//         theImage.removeEventListener('load', lineUp);
//         dry || initSong(slot[x].tdat.songid, x);
//     }
//     function loadFinished(){
//         slot[x].state = 3;
//         document.removeEventListener('fakeimageupdate', abort);
//         console.log(x + ': state 3');
//     }
//     function startLoad(){
//         x==current && showLoading(true);
//         slot[x].audio.setAttribute('src', '/'+slot[x].tdat.filePath);
//         console.log(x, slot[x].audio)
//         slot[x].audio.load();
//         slot[x].state = 2;
//         console.log(x + ': state 2');
//         slot[x].audio.addEventListener('myplaythrough', loadFinished, {once:true})
//     }
//     function lineUp(){
//         if(x==current || slot[+!x].state==3){
//             startLoad();
//         } else {
//             slot[x].state = 1;
//             console.log(x + ': state 1');
//             slot[+!x].audio.addEventListener('myplaythrough', startLoad, {once:true});
//         }
//     }
//     if(id=='dryabort'){
//         abort(null, dry=true);
//     } else if(id=='push'){
//         console.log('pushed');
//         slot[+!x].audio.dispatchEvent(myplaythrough);
//         // startLoad();
//         // slot[+!x].audio.removeEventListener('myplaythrough', startLoad);
//     } else {
//         slot[x].tdat = tracks.find(t => t.songid === id);

//         document.addEventListener('fakeimageupdate', abort, {once:true});

//         if(theImage.complete){
//             lineUp();
//         } else {
//             slot[x].state = 0;
//             console.log(x + ': state 0');
//             theImage.addEventListener('load', lineUp, {once:true});
//         }
//     }
// }

var myplaythrough = new CustomEvent('myplaythrough');
// slot[0].audio.addEventListener('canplaythrough', () => {
//     slot[0].audio.dispatchEvent(myplaythrough);
// });
// slot[1].audio.addEventListener('canplaythrough', () => {
//     slot[1].audio.dispatchEvent(myplaythrough);
// });
slots[0].a.addEventListener('canplaythrough', () => {
    slots[0].a.dispatchEvent(myplaythrough);
});
slots[1].a.addEventListener('canplaythrough', () => {
    slots[1].a.dispatchEvent(myplaythrough);
});

function checkIn(id){
    for(var i=0; i<slots.length; i++){
        if(id === slots[i].tdat.songid){
            return i;
        }
    }
    return -1;
}

function playNew(specific, now){
    var id = specific || currentList[listIndex];
    var idNext = currentList[listIndex+1];

    pauser();
    if(checkIn(id) > -1){
        current = checkIn(id);
        slot[current].state==3 && (slot[current].audio.currentTime = 0);
        console.log('there?');
    } else {
        if(checkIn(idNext) > -1){
            current = +!checkIn(idNext);
            console.log('there next?');
        } else {
            current = 0;
        }
        slot[current].state < 3 && initSong('dryabort', current);
        initSong(id, current);
    }
    if(checkIn(idNext) < 0){
        slot[+!current].state < 3 && initSong('dryabort', +!current);
        initSong(idNext, +!current);
    } else {
        slot[+!current].state==3 && (slot[+!current].audio.currentTime = 0);
    }
    showTrack(slot[current].tdat);
    now && player();
}

function prev(e){
    e.cancelable && e.preventDefault();

    if (slot[current].audio.currentTime > 3){ 
        slot[current].audio.currentTime = 0;
    } else if (listIndex > 0) {
        var con = pauser();
        slot[current].audio.currentTime = 0;
        current = +!current;
        listIndex -= 1;
        var id = currentList[listIndex];
        initSong(id, current);
        showTrack(slot[current].tdat);
        con && player();
    }
}

function next(e, keepon){
    e.cancelable && e.preventDefault();

    if (listIndex < currentList.length - 1) {
        var con = keepon || pauser();
        current = +!current;
        listIndex += 1;
        if(slot[+!current].state<3){
            initSong(id='push', current);
            initSong(id='dryabort', +!current);
        }
        var idNext;
        if(idNext = currentList[listIndex+1]){
            initSong(idNext, +!current);
        }
        showTrack(slot[current].tdat);
        con && player();
    }
}

function playtoggle() {
    slot[current].audio.paused ? player() : pauser()
}

function player() {
    slot[current].audio.play();
}

function pauser() {
    if(!slot[current].audio.paused){
        slot[current].audio.pause();
        return true;
    } else {
        return false;
    }
}


function showTrack(t) {
    pCover.setAttribute("src", '/' + t.coverPath),
    pCover.parentNode.setAttribute('href','/p/album/'+t.albumid),
    pName.innerHTML = t.songname, pName.setAttribute('href','/p/song-/'+t.songid),
    pAlbum.innerHTML = t.album, pAlbum.setAttribute('href','/p/album/'+t.albumid),

    tracklength.innerHTML = t.runtime,

    t.spotify 
        ? (pSpot.setAttribute("href", t.spotify),
          pSpot.style.display = 'block')
        : pSpot.style.display = 'none';
    t.youtube 
        ? (pYou.setAttribute("href", t.youtube),
          pYou.style.display = 'block')
        : pYou.style.display = 'none';
    t.soundcloud 
        ? (pSC.setAttribute("href", t.soundcloud),
          pSC.style.display = 'block')
        : pSC.style.display = 'none';
}

function scrubber(e) {
    e.cancelable && e.preventDefault(), 
    scrubbing = true;
    var seekS = seekbar.offsetLeft + document.getElementById('player').offsetLeft;
    var dif = scrubvis.offsetLeft + seekS - e.clientX,
        dur = a[current].duration - .01,
        seekW = seekbar.offsetWidth - 10,
        con = !a[current].paused,
        seekTo, rower;
    pauser();
    function scrubMove(e) {
        e.cancelable && e.preventDefault();
        rower = e.clientX + dif;
        rower < seekS 
            ? (scrubPosition(0), seekTo = 0) 
        : rower > seekS + seekW 
            ? (scrubPosition(seekW), seekTo = dur) 
        : 
            (scrubPosition(rower - seekS), seekTo = (rower - seekS) / seekW * dur), 
        tracktime.innerHTML = minSec(seekTo)
    }
    function scrubEnd() {
        document.removeEventListener('pointermove', scrubMove), 
        a[current].currentTime = seekTo, 
        con && a[current].play(), 
        scrubbing = false
    }
    document.addEventListener('pointermove', scrubMove), 
    document.addEventListener('pointerup', scrubEnd, {once: true})
}

function seekUpdate() {
    scrubbing || (scrubPosition(a[current].currentTime / a[current].duration * (seekbar.offsetWidth - 10)), 
    tracktime.innerHTML = minSec(a[current].currentTime))
}

function scrubPosition(t) {
    scrub.style.left = t - 15 + "px", scrubvis.style.left = t + "px";
}

function minSec(seconds) {
    var min = Math.floor(seconds / 60).toString();
    var sec = Math.floor(seconds % 60).toString();
    sec.length===1 && (sec = "0" + sec);
    return min + ":" + sec
}

function fillTrackRow(i, row, tData) {
    row.setAttribute('name', tData.songid),
    row.setAttribute('class', 'player');

    var tNum = document.createElement('td'); tNum.innerHTML = i + 1;
    var tName = document.createElement('td'); tName.innerHTML = tData.songname;
    var tTime = document.createElement('td'); tTime.innerHTML = tData.runtime;
    var tPage = document.createElement('td'); 

    row.appendChild(tNum),
    row.appendChild(tName),
    row.appendChild(tTime),
    row.appendChild(tPage);

    if ("n" === tData.instrumental) {
        var pLink = document.createElement('a'); pLink.innerHTML = "Lyrics";
        pLink.setAttribute('class', 'internal'), 
        pLink.setAttribute('href', "/p/song-/" + tData.songid), 
        tPage.appendChild(pLink);
    }
}

function trackList(list) {
    // displayedList = list;
    var tracklist = document.getElementsByClassName('tracklist')[0];
    for (var i = 0; i < list.length; i++) {
        var tData = tracks.find(t => t.songid === list[i]),
            row = document.createElement('tr');
        tracklist.appendChild(row), fillTrackRow(i, row, tData)
    }
    var pLinks = document.querySelectorAll('tr a');
    for(var i=0; i<pLinks.length; i++) {
        pLinks[i].addEventListener('click', e => {
            e.stopPropagation();
            // window.location.assign("/" + e.target.getAttribute("href"));
        })
    }
}

function newShuffle(now = false) {
    var shuf = [];
    for (var i = 0; i < 10; i++) {
        var repeat = false;
        var n = Math.floor(Math.random() * tracks.length);
        t: for (var j = 0; j < shuf.length; j++)
            if (tracks[n].songid === shuf[j]) {
                repeat = true;
                break t
            } 
        repeat || shuf.push(tracks[n].songid)
    }
    // currentList = shuf.concat(), listIndex = 0, playNew('', now)
}

function shuffleOne(){
    currentList.splice(listIndex+1, 0, tracks[Math.floor(Math.random()*tracks.length)].songid);
    listIndex++;
    playNew('', true);
}

var copied = document.getElementById('copied');
function share() {
    var album = tracks.find(t => t.songid === currentList[listIndex]).albumid;
    var link = document.createElement('input'); document.getElementById('footer').appendChild(link);
    link.value = 'https://bensomerville.com/p/album/'+album+'#'+currentList[listIndex];
    link.select();
    document.execCommand("copy");
    link.remove();
    copied.style.display = 'block';
    setTimeout(() => {copied.style.display = 'none'}, 2000);
}


var aArray = Array.prototype.slice.call(a);

function showLoading(yes) {
    yes
        ? (aLoading.style.display = 'block', tracktime.style.display = 'none')
        : (aLoading.style.display = 'none', tracktime.style.display = 'block')
}

for(var i=0; i<a.length; i++) {
    a[i].addEventListener("play", (function () {
        playpause.setAttribute("src", "/img/icons/pause.png")
    })), 
    a[i].addEventListener("pause", (function () {
        playpause.setAttribute("src", "/img/icons/play.png")
    })), 
    a[i].addEventListener("ended", (function (e) {
        next(e, true);
    })), 
    a[i].addEventListener("canplaythrough", (function (e) {
        aArray.indexOf(e.currentTarget) === current && showLoading(false)
    }))
}
document.getElementById('prev').addEventListener('click', e => prev(e));
playpause.addEventListener('click', () => playtoggle());
document.getElementById('next').addEventListener('click', e => next(e))

scrub.addEventListener('pointerdown', (e => scrubber(e))), 
sharesong.addEventListener('click', () => share()),
setInterval(() => seekUpdate(), 200)
