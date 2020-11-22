var cont, canv;
var linkElement;


// MOBILE NAV DROPDOWN

var dropdown = document.getElementById('mobileexplore');
var expand = document.getElementById('expand');
var expanded;

function navShown(yes) {
    yes
        ? (expand.className = 'expnd',
          setTimeout(() => {dropdown.innerHTML = 'Explore'}, 200),
          expanded = true)
        : (expand.className = 'clpsd',
          dropdown.innerHTML = 'E',
          expanded = false)
}

dropdown.addEventListener('click', e => {
    e.stopPropagation();
    navShown(!expanded)
    document.body.addEventListener('click', () => navShown(false));
});

// Dropdown is open by default, in case javascript is off.
// So when js loads, first thing is to close dropdown.

expand.className = 'clpsd';
setTimeout(() => expand.style.transition = "height .2s, width .2s", 
    200);
expanded = false;



// HANDLE URLS

var lastUrl = '';
var link = '';
var linkchange = new CustomEvent('linkchange');

function refresh(url, fromhist=false){
    var linkAt = url.indexOf('-/');
    if(linkAt > -1){
        link = url.substring(linkAt+2, url.length);
        url = url.substring(0, linkAt);
        if(url === lastUrl){
            document.dispatchEvent(linkchange);
            fromhist 
                ? window.history.replaceState('hist','','/p/'+url+'-/'+link)
                : window.history.pushState('new','','/p/'+url+'-/'+link);
        }
    } else {
        link = '';
    }
    url !== lastUrl && (
        lastUrl = url,
        loadPage(url, fromhist)
    )
}

function mLink(url) {
    var songI = url.indexOf("#");
    var song;
    if (songI > -1) {
        song = url.substring(songI + 1, url.length);
        var tdat;
        if(tdat = tracks.find(t => t.songid === song)){
            playlist = window[tdat.albumid].concat();
            playhead = playlist.indexOf(song);
            playNew();
        } else {
            alert('no such track');
        }
        return url.substring(0, songI);
    } else {
        return url;
    }
}

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




// LOAD PAGE

var pageContent = document.getElementById('pageContent');
function onPlatter(html) {
    var afterhead = html.substring(html.indexOf('</head>')+7, html.length+1);
    var scr = afterhead.substring(afterhead.indexOf('<script>')+8, afterhead.indexOf('</script>'));
    pageContent.innerHTML = afterhead;
    eval(scr);
}

function loadPage(url, fromhist) {
    linkElement && (linkElement.style.cursor = 'wait');
    document.removeEventListener('linkchange', poemp),
    document.removeEventListener('linkchange', songp),
    document.removeEventListener('linkchange', seshp);
    bgFocus && toggleBG();

    var getPage = new XMLHttpRequest();
    getPage.open('POST','/load_page.php');
    getPage.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    getPage.onreadystatechange = function () {
        if (getPage.readyState === 4) {
            if (getPage.status === 200) {
                onPlatter(getPage.responseText);
                var histString = '/p/' + url + (link && ('-/' + link));
                fromhist 
                    ? window.history.replaceState('hist','',histString)
                    : window.history.pushState('new','',histString);
                linkElement && (linkElement.style.cursor = '');
            } else {
                console.log('Error: ' + getPage.status);
            }
        }
    };
    getPage.send('page='+url);
}


// LOAD JSON PAGES

function loadJson(url, callback){
    var getJSON = new XMLHttpRequest();
    getJSON.open('GET', url + '.json');
    getJSON.onreadystatechange = () => {
        if(getJSON.readyState === 4){
            if(getJSON.status === 200){
                var json = JSON.parse(getJSON.responseText);
                callback(json);
            } else {
                console.log('error: ' + getJSON.status);
            }
        }
    }
    getJSON.send();
}

function fromdb(table, id, callback) {
    linkElement && (linkElement.style.cursor = 'wait');
    var query = new XMLHttpRequest();
    query.open('POST','/squery.php');
    query.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    query.onreadystatechange = () => {
        if (query.readyState === 4) {
            query.status === 200
                ? callback(JSON.parse(query.responseText))
                : console.log('Error: ' + query.status);
                linkElement && (linkElement.style.cursor = '');
        }
    };
    query.send(`id=${id}&tab=${table}`);
}

function poemp() {fromdb('poems', link, loadPoem)}
function songp() {fromdb('songs', link, loadSong)}
function seshp() {fromdb('sessions', link, loadSession)}

// function poemp() {loadJson('/js/poems/' + link, loadPoem)}
// function songp() {loadJson('/js/songs/' + link, loadSong)}
// function seshp() {loadJson('/js/entanglement/' + link, loadSession)}

function loadPoem(obj){
    document.getElementById('sTitle').innerHTML = obj.title;
    document.getElementById('sText').innerHTML = obj.words;
}

function loadSong(obj){
    var tData = tracks.find(t => t.songid === link);

    document.getElementById('lPlay').setAttribute('name', tData.songid);
    document.getElementById('lTitle').innerHTML = obj.title;
    document.getElementById('lText').innerHTML = obj.words;

    var lAlbum = document.getElementById('lAlbum');
    lAlbum.innerHTML = tData.album;
    lAlbum.setAttribute('href', '/p/album/'+tData.albumid);

    setImageEvent('/'+obj.img);

    var ints2 = document.getElementsByClassName('internal2');
    for(let i=0; i<ints2.length; i++){
        ints2[i].addEventListener('click', intLink)
    }
}

function loadSession(obj){
    canv.style.backgroundSize = 'contain';
    setImageEvent('/'+obj.img);
    document.querySelector('.backcanvas').style.backgroundImage = 'url(/'+obj.img+')';
    obj.v 
        ? (canv.style.backgroundRepeat = 'no-repeat')
        : (canv.style.backgroundRepeat = 'repeat-x'),
    document.getElementById('sDate').innerHTML = obj.dat,
    document.getElementById('sLoc').innerHTML = obj.loc,
    document.getElementById('sRec').innerHTML = obj.rec;

    var ints2 = document.getElementsByClassName('internal2');
    for(var i=0; i<ints2.length; i++){
        ints2[i].addEventListener('click', intLink)
    }
}


    // SESSION BG FOCUS

    var bgFocus = false;

    function toggleBG() {
        if(bgFocus) {
            pageContent.style.zIndex = 0;
            document.querySelector('.backcanvas').style.zIndex = -7;
            canv.style.zIndex = 0;
            bgFocus = false;
        } else {
            pageContent.style.zIndex = 50;
            document.querySelector('.backcanvas').style.zIndex = 50;
            canv.style.zIndex = 55;
            bgFocus = true;
        }
    }

    function setBgToggle() {           // Called by session.html
        canv.removeEventListener('click', toggleBG)
        bgFocus = false;	
        canv.addEventListener('click', toggleBG)
    }

    
function loadPosts(posts){
    var i = 0;
    postList = document.getElementsByClassName('blogposts')[0];
    postBlock = document.createElement('div');

    function readyPost(json){
        var lBreak = document.createElement('p');
        lBreak.innerHTML = "<br><hr noshade color='#eeeeee'><br><br>";
        postBlock.appendChild(lBreak);

        var blogPost = document.createElement('div');
        blogPost.setAttribute('class','blogpost');
        postBlock.appendChild(blogPost);

        var postDate = document.createElement('div');
        postDate.setAttribute('class','postdate');
        postDate.innerHTML = json.date;
        blogPost.appendChild(postDate);

        var rightCol = document.createElement('div');
        blogPost.appendChild(rightCol);

        var postTitle = document.createElement('div');
        postTitle.setAttribute('class','posttitle');
        var titleLink = document.createElement('a');
        titleLink.setAttribute('class','internal2');
        titleLink.setAttribute('href',json.link);
        titleLink.innerHTML = json.title;
        postTitle.appendChild(titleLink);
        rightCol.appendChild(postTitle);

        var postSample = document.createElement('div');
        postSample.setAttribute('class','postsample');
        postSample.innerHTML = json.sample;
        rightCol.appendChild(postSample);
        rightCol.appendChild(document.createElement('br'))

        var postLink = document.createElement('a');
        postLink.setAttribute('class','internal2');
        postLink.setAttribute('href',json.link);
        var linkSpan = document.createElement('span');
        linkSpan.setAttribute('class','postlink');
        postLink.appendChild(linkSpan);
        blogPost.appendChild(postLink);

        i++;
        if(i < posts.length){
            loadJson('/js/posts/' + posts[i], readyPost);
        } else {
            postList.appendChild(postBlock);
            var ints2 = document.getElementsByClassName('internal2');
            for(let j=0; j<ints2.length; j++){
                ints2[j].addEventListener('click', intLink)
            }
        }
    }

    loadJson('/js/posts/' + posts[i], readyPost);
}


// READY FOR AUDIO EVENTS

var theImage = new Image();
var newimage = new CustomEvent('newimage');
var readyforaudio = new CustomEvent('readyforaudio');
var fullReady = false;

function readyHandler(){
    document.dispatchEvent(readyforaudio);
    fullReady = true;
}
theImage.addEventListener('load', readyHandler);


function setImageEvent(path, loadEvent){
    fullReady = false;
    document.dispatchEvent(newimage);
    if(loadEvent){
        document.removeEventListener(loadEvent, setBG);
        document.addEventListener(loadEvent, setBG, {once:true});
    } else {
        setBG();
    }

    function setBG(){
        canv.style.backgroundImage = "url(" + path + ")";
        theImage.src = path;
        console.log(theImage.src);
    }
}



// PAGE LOAD TASKS

function intLink(e) {
    e.preventDefault();
    linkElement = e.target;
    var url = e.currentTarget.getAttribute('href')
    var p = url.indexOf('/p/');
    p > -1
        ? refresh(url.substring(p+3, url.length+1))
        : refresh('home');
}

function setExtPlayers(links){
    for(let i=0; i<links.length; i++){
        links[i].addEventListener('click', e => {
            var n = e.currentTarget.getAttribute("href");
            (n.includes("soundcloud") || n.includes("spotify") || n.includes("youtu")) && pauser();
        });
    }
}

function resetInternals(ints){
    for(let i=0; i<ints.length; i++){
        ints[i].removeEventListener('click', intLink);
        ints[i].addEventListener('click', intLink);
    }
}

function setPlayers(players){
    for(let i=0; i<players.length; i++){
        players[i].addEventListener('click', e => {
            e.stopPropagation();
            let song = e.currentTarget.getAttribute('name');
            let list = window[e.currentTarget.getAttribute('data-list')] || window[tracks.find(t => t.songid === song).albumid];
            playlist = list.concat();
            playhead = playlist.indexOf(song),
            playNew('', true);
        });
    }
}

function updateHeight(cont, canv) {
    var n = cont.offsetHeight + 200;
    n > window.innerHeight 
        ? (canv.style.height = n+'px') 
        : (canv.style.height = window.innerHeight+'px');
}

function onPageLoad(n="Ben Somerville", bg={path:null, pos:null, siz:null, rep:null}, loadEvent) {
    document.title = n, 

    cont = document.getElementById('content'),
    canv = document.getElementById('canvas');

    if(bg.path) setImageEvent(bg.path, loadEvent);
    if(bg.pos) canv.style.backgroundPosition = bg.pos;
    if(bg.siz) canv.style.backgroundSize = bg.siz;
    if(bg.rep) canv.style.backgroundRepeat = bg.rep;

    var links = document.getElementsByTagName('a');
    setExtPlayers(links);
    var internals = document.getElementsByClassName('internal');
    resetInternals(internals);
    var players = document.getElementsByClassName('player');
    setPlayers(players);

    cont && new ResizeSensor(cont, () => updateHeight(cont, canv));
    window.scroll(0, 0);
}



// NAV EXPLORE LINKS

var shuffless = document.getElementsByClassName('shuffles');
for(var i=0; i<shuffless.length; i++){
    shuffless[i].addEventListener('click', e => {
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



// FIRST LOAD

newShuffle();

if (sessionStorage.getItem('firstpage') === null) {
    refresh('home');
} else {
    refresh(mLink(sessionStorage.getItem('firstpage')));
    sessionStorage.removeItem('firstpage')
}


// ARRAYS

var albums = ['quarry', 'eastcoast', 'entanglement', 'euwCondensed', 'euw', 'greenstone', 'stainless'];
var song = ["tripwired2","tripwired2","eastcoast","eastcoast","tension","tension","diminishing","diminishing","stage","stage","pullmeapart","pullmeapart","rest","rest","mrforeigner","mrforeigner","imaginarypain","imaginarypain","togive","togive","ithought","ithought","father","father","cyclopath","srj","topsong","thatsano","sirdoubts","changesomeone","fatedelay","twoeyes","postal","wheelless","anystar","gb","barcode","hireamaid","stairs","patricians","contraspective","pretensent","whatexcuse","fortuneteller","backbend","becky","manna","manna","counterprofeit","counterprofeit","concavescent","concavescent","tripwired","tripwired","endothermic","endothermic"];
var session = ["2211","2213","3131","3132","3133","3141","3142","3143","3151","3152","3251","3252","3253","3254","3255","4051","4052","4053","4054","4055","4056","4057","4058","4071","4111","4112","4113","4151","4152","4153","4154","4181","4182","4221","4271","4272","4281","5021","5022","5041","5042","5043","5061","5131","5221","5281","5291","6021","6022"];
var poem = ["anystar","comedown","comedown2","endyourreign","everest","evolve1","evolve2","geometry","icynight","incensesmoke","intellectual","lovesmiles","tomoon","wetpaint"];