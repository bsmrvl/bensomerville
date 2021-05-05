/** Site startup.
*/

// CUSTOM EVENTS

const myplaythrough = new CustomEvent('myplaythrough');
const linkchange = new CustomEvent('linkchange');
const newimage = new CustomEvent('newimage');
const readyforaudio = new CustomEvent('readyforaudio');

// PLAYER ELEMENTS

const seekbar = document.getElementById('seekbar');
const tracktime = document.getElementById('tracktime');
const aLoading = document.getElementById('aLoading');
const pCover = document.getElementById('pCover');
const pName = document.getElementById('pName');
const pAlbum = document.getElementById('pAlbum');
const tracklength = document.getElementById('tracklength');
const pSpot = document.getElementById('pSpot');
const pYou = document.getElementById('pYou');
const pSC = document.getElementById('pSC');
const playb = document.getElementById('playb');
const pauseb = document.getElementById('pauseb');
const scrub = document.getElementById('scrub');
const scrubvis = document.getElementById('scrubvis');
const sharesong = document.getElementById('sharesong');
const copied = document.getElementById('copied');

// BODY ELEMENTS

var pageContent = document.getElementById('pageContent');
var cont;
var canv;
var linkElement;

// OTHER GLOBALS

var lastUrl = '';
var link = '';
var tracks;
var bgFocus = false;
var fullReady = false;
const theImage = new Image();
theImage.addEventListener('load', readyHandler);

// PLAYLISTS

var euw = ["cyclopath", "srj", "topsong", "thatsano", "sirdoubts", "changesomeone", "fatedelay", "twoeyes", "postal", "wheelless", "anystar", "regrouping", "gb", "barcode", "hireamaid", "stairs", "sandbridge", "patricians", "contraspective", "pretensent", "whatexcuse", "fortuneteller", "backbend", "becky", "sandbridge2", "earsunderwater"];
var euwCondensed = ["gb", "thatsano", "anystar", "postal", "stairs", "fortuneteller", "topsong", "whatexcuse", "fatedelay", "becky"];
var eastcoast = ["eastcoast"];
var entanglement = ["tension", "diminishing", "stage", "pullmeapart", "rest", "mrforeigner","imaginarypain", "togive", "ithought", "father"];
var greenstone = ["manna", "counterprofeit", "taxi", "concavescent", "tripwired", "endothermic"];
var stainless = ["cactusjuice", "frozenfloor", "trypnosis", "rhythmic"];
var quarry = ["toil", "tripwired2", "sorentino"];

// NAV SHUFFLE OPTIONS

var albums = ['quarry', 'eastcoast', 'entanglement', 'euwCondensed', 'euw', 'greenstone', 'stainless'];
var song = ["tripwired2","tripwired2","eastcoast","eastcoast","tension","tension","diminishing","diminishing","stage","stage","pullmeapart","pullmeapart","rest","rest","mrforeigner","mrforeigner","imaginarypain","imaginarypain","togive","togive","ithought","ithought","father","father","cyclopath","srj","topsong","thatsano","sirdoubts","changesomeone","fatedelay","twoeyes","postal","wheelless","anystar","gb","barcode","hireamaid","stairs","patricians","contraspective","pretensent","whatexcuse","fortuneteller","backbend","becky","manna","manna","counterprofeit","counterprofeit","concavescent","concavescent","tripwired","tripwired","endothermic","endothermic"];
var session = ["2211","2213","3131","3132","3133","3141","3142","3143","3151","3152","3251","3252","3253","3254","3255","4051","4052","4053","4054","4055","4056","4057","4058","4071","4111","4112","4113","4151","4152","4153","4154","4181","4182","4221","4271","4272","4281","5021","5022","5041","5042","5043","5061","5131","5221","5281","5291","6021","6022"];
var poem = ["anystar","comedown","comedown2","endyourreign","everest","evolve1","evolve2","geometry","icynight","incensesmoke","intellectual","lovesmiles","tomoon","wetpaint"];



// INITIALIZE PLAYER

const Q = [new Slot(0), new Slot(1)]

Q[0].a.addEventListener('canplaythrough', dispatchCustom)
Q[1].a.addEventListener('canplaythrough', dispatchCustom)

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

document.getElementById('stickyB').style.visibility = 'visible';



// INITIALIZE NAV

const mobileDrop = new DropDown(
    toggler = document.getElementById('mobileexplore'),
    menu = document.getElementById('expand')
);

for(const shuffles of document.getElementsByClassName('shuffles')){
    shuffles.addEventListener('click', e => {
        e.preventDefault();
        linkElement = e.target;
        var selectfrom = window[e.currentTarget.getAttribute('name')];
        if(selectfrom){
            var goTo = selectfrom[Math.floor(Math.random() * selectfrom.length)];
            selectfrom === albums 
                ? refresh('album/' + goTo) 
                : refresh(e.currentTarget.getAttribute('name') + '-/' + goTo);
        }
    });
}



// POP HANDLER

window.addEventListener('popstate', function() {
    url = window.location.href;
    var p = url.indexOf('/p/');
    var sub;
    p > -1 && (sub = url.substring(p+3, url.length+1));

    if(window.location.hash){
        window.history.replaceState('song','','/p/'+mLink(sub));
    } else {
        p > -1
            ? refresh(sub, true)
            : refresh('home', true);
    }
});



// LOAD FIRST PAGE (either home or set by 'straight.js')




// GET TRACK LIBRARY AND LOAD FIRST SONG

getJSON('/js/tracks.json', r => {


    if (sessionStorage.getItem('firstpage') === null) {
        refresh('home');
    } else {
        refresh(mLink(sessionStorage.getItem('firstpage')));
        sessionStorage.removeItem('firstpage')
    }

    tracks = r;
    playlist = entanglement;
    playhead = 0;
    playNew();
    
});