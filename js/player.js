var playlist;
var playhead = 0;
var up = 0;
var scrubbing = false;

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
var playb = document.getElementById('playb');
var pauseb = document.getElementById('pauseb');
var scrub = document.getElementById('scrub');
var scrubvis = document.getElementById('scrubvis');
var sharesong = document.getElementById('sharesong');

document.getElementById('stickyB').style.visibility = 'visible';

class Slot {
    constructor(row) {
        this.row = row;
        this.a = new Audio();
        this.state = 0;
        this.tid = 'sorentino';
        this.ref = {li:null, lo:null, fin:null, ab:null};
    }
    init(id) {
        this.tid = id;

        var abRef = this.abort.bind(this); this.ref.ab = abRef;
        var liRef = this.lineUp.bind(this); this.ref.li = liRef;
        document.addEventListener('newimage', abRef, {once:true});

        if(fullReady){
            liRef();
        } else {
            document.addEventListener('readyforaudio', liRef, {once:true});
            this.state = 0; console.log(this.row + ': state 0');
        }
    }
    lineUp() {
        var loRef = this.startLoad.bind(this); this.ref.lo = loRef;

        if(this.row==up || Q[+!this.row].state==3){
            loRef();
        } else {
            Q[+!this.row].a.addEventListener('myplaythrough', loRef, {once:true});
            this.state = 1; console.log(this.row + ': state 1');
        }
    }
    startLoad() {
        var finRef = this.loadFin.bind(this); this.ref.fin = finRef;

        let tdat = tracks.find(t => t.songid === this.tid);

        this.a.setAttribute('src', '/'+tdat.filePath); console.log(this.row, this.a);
        this.a.load();
        this.a.addEventListener('myplaythrough', finRef, {once:true});
        this.row==up && showLoading(true);
        this.state = 2; console.log(this.row + ': state 2');
    }
    loadFin() {
        var abRef = this.ref.ab;
        document.removeEventListener('newimage', abRef);

        this.row==up && showLoading(false);
        this.state = 3; console.log(this.row + ': state 3');
    }
    abort(e, reInit=true) {
        console.log(this.row + ': aborting');

        var liRef = this.ref.li;
        document.removeEventListener('readyforaudio', liRef);
        var loRef = this.ref.lo;
        Q[+!this.row].a.removeEventListener('myplaythrough', loRef);
        var finRef = this.ref.fin;
        this.a.removeEventListener('myplaythrough', finRef);
        var abRef = this.ref.ab;
        document.removeEventListener('newimage', abRef);

        this.a.setAttribute('src','');
        
        reInit && this.init(this.tid);
    }
}

var Q = [new Slot(0), new Slot(1)]

var myplaythrough = new CustomEvent('myplaythrough');
function PTtakeover(e) {
    e.currentTarget.dispatchEvent(myplaythrough);
}
Q[0].a.addEventListener('canplaythrough', PTtakeover)
Q[1].a.addEventListener('canplaythrough', PTtakeover)

function alreadyIn(id){
    for(let i=0; i<Q.length; i++){
        if(id === Q[i].tid) return i;
    }
    return -1;
}

function playNew(specific, now){
    var id = specific || playlist[playhead];
    var idNext = playlist[playhead+1] || 'sorentino';

    pauser();
    if(alreadyIn(id) > -1){
        up = alreadyIn(id);
        Q[up].state==3 && (Q[up].a.currentTime = 0);
    } else {
        if(alreadyIn(idNext) > -1){
            up = +!alreadyIn(idNext);
        } else {
            up = 0;
        }
        Q[up].state < 3 && Q[up].abort(null, false);
        Q[up].init(id), console.log(id);
    }
    if(alreadyIn(idNext) < 0){
        Q[+!up].state < 3 && Q[+!up].abort(null, false);
        Q[+!up].init(idNext);
    } else {
        Q[+!up].state==3 && (Q[+!up].a.currentTime = 0);
    }
    showTrack(Q[up].tid);
    now && player();
}

function prev(e){
    e.cancelable && e.preventDefault();

    if (Q[up].a.currentTime > 3){ 
        Q[up].a.currentTime = 0;
    } else if (playhead > 0) {
        var con = pauser();
        up = +!up;
        Q[+!up].a.currentTime = 0;
        playhead -= 1;
        var id = playlist[playhead];
        Q[up].state<3 && Q[up].abort(null, false);
        Q[up].init(id);
        showTrack(Q[up].tid);
        con && player();
    }
}

function next(e, fromLast){
    e.cancelable && e.preventDefault();

    if (playhead < playlist.length - 1) {
        var con = fromLast || pauser();
        up = +!up;
        playhead += 1;
        if(Q[+!up].state<3){
            Q[+!up].a.dispatchEvent(myplaythrough);
            Q[+!up].abort(null, false);
        }
        var idNext;
        if(idNext = playlist[playhead+1]){
            Q[+!up].init(idNext);
        }
        showTrack(Q[up].tid);
        con && player();
    }
}

function playtoggle() {
    Q[up].a.paused ? player() : pauser()
}

function player() {
    Q[up].a.play();
}

function pauser() {
    if(!Q[up].a.paused){
        Q[up].a.pause();
        return true;
    } else {
        return false;
    }
}


function showTrack(tid) {
    var tdat = tracks.find(t => t.songid === tid);
    pCover.setAttribute("src", '/' + tdat.coverPath);
    pCover.parentNode.setAttribute('href','/p/album/'+tdat.albumid);
    pName.innerHTML = tdat.songname, pName.setAttribute('href','/p/song-/'+tdat.songid);
    pAlbum.innerHTML = tdat.album, pAlbum.setAttribute('href','/p/album/'+tdat.albumid);
    tracklength.innerHTML = tdat.runtime;

    tdat.spotify 
        ? (pSpot.setAttribute("href", tdat.spotify),
          pSpot.style.display = 'block')
        : pSpot.style.display = 'none';
    tdat.youtube 
        ? (pYou.setAttribute("href", tdat.youtube),
          pYou.style.display = 'block')
        : pYou.style.display = 'none';
    tdat.soundcloud 
        ? (pSC.setAttribute("href", tdat.soundcloud),
          pSC.style.display = 'block')
        : pSC.style.display = 'none';
}

function scrubber(e) {
    e.cancelable && e.preventDefault();
    scrubbing = true;
    var seekS = seekbar.offsetLeft + document.getElementById('player').offsetLeft;
    var dif = scrubvis.offsetLeft + seekS - e.clientX;
    var dur = Q[up].a.duration - .01;
    var seekW = seekbar.offsetWidth - 10;
    var con = !Q[up].a.paused;
    var seekTo
    var rower;
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
        Q[up].a.currentTime = seekTo, 
        con && Q[up].a.play(), 
        scrubbing = false
    }
    document.addEventListener('pointermove', scrubMove), 
    document.addEventListener('pointerup', scrubEnd, {once: true})
}

function seekUpdate() {
    if(!scrubbing){
        scrubPosition(Q[up].a.currentTime / Q[up].a.duration * (seekbar.offsetWidth-10));
        tracktime.innerHTML = minSec(Q[up].a.currentTime);
    }
}

function scrubPosition(x) {
    scrub.style.left = x-15 + "px";
    scrubvis.style.left = x + "px";
}

function minSec(seconds) {
    var min = Math.floor(seconds / 60).toString();
    var sec = Math.floor(seconds % 60).toString();
    sec.length===1 && (sec = "0" + sec);
    return min + ":" + sec;
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
    var tracklist = document.getElementsByClassName('tracklist')[0];
    for (let i=0; i<list.length; i++) {
        var tdat = tracks.find(t => t.songid === list[i]);
        var row = document.createElement('tr');
        tracklist.appendChild(row), fillTrackRow(i, row, tdat)
    }
    var pLinks = document.querySelectorAll('tr a');
    for(let i=0; i<pLinks.length; i++) {
        pLinks[i].addEventListener('click', e => e.stopPropagation());
    }
}

function newShuffle(now=false) {
    var shuf = [];
    for(let i=0; i<10; i++) {
        var repeat = false;
        var n = Math.floor(Math.random() * tracks.length);
        t: for(let j=0; j<shuf.length; j++)
            if(tracks[n].songid === shuf[j]) {
                repeat = true;
                break t
            } 
        repeat || shuf.push(tracks[n].songid)
    }
    playlist = shuf.concat();
    playhead = 0;
    playNew(null, now);
}

// function shuffleOne(){
//     playlist.splice(playhead+1, 0, tracks[Math.floor(Math.random()*tracks.length)].songid);
//     playhead++;
//     playNew('', true);
// }

var copied = document.getElementById('copied');
function share() {
    var album = tracks.find(t => t.songid === playlist[playhead]).albumid;
    var link = document.createElement('input'); document.getElementById('footer').appendChild(link);
    link.value = 'https://bensomerville.com/p/album/'+album+'#'+playlist[playhead];
    link.select();
    document.execCommand("copy");
    link.remove();
    copied.style.display = 'block';
    setTimeout(() => {copied.style.display = 'none'}, 2000);
}

function showLoading(sw) {
    sw
        ? (tracktime.style.display = 'none', aLoading.style.display = 'block')
        : (aLoading.style.display = 'none', tracktime.style.display = 'block');
}

function playOrPause(sw) {
    sw
        ? (playb.style.display = 'none', pauseb.style.display = 'inline')
        : (pauseb.style.display = 'none', playb.style.display = 'inline');
}

for(let i=0; i<Q.length; i++) {
    Q[i].a.addEventListener("play", () => playOrPause(true)); 
    Q[i].a.addEventListener("pause", () => playOrPause(false)); 
    Q[i].a.addEventListener("ended", e => next(e, true));
}
document.getElementById('prev').addEventListener('click', prev);
document.getElementById('next').addEventListener('click', next);
document.getElementById('playpause').addEventListener('click', playtoggle);

scrub.addEventListener('pointerdown', scrubber);
sharesong.addEventListener('click', share);
setInterval(seekUpdate, 200);
