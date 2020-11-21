var albums = ['quarry', 'eastcoast', 'entanglement', 'euwCondensed', 'euw', 'greenstone', 'stainless'];
var song = ["tripwired2","tripwired2","eastcoast","eastcoast","tension","tension","diminishing","diminishing","stage","stage","pullmeapart","pullmeapart","rest","rest","mrforeigner","mrforeigner","imaginarypain","imaginarypain","togive","togive","ithought","ithought","father","father","cyclopath","srj","topsong","thatsano","sirdoubts","changesomeone","fatedelay","twoeyes","postal","wheelless","anystar","gb","barcode","hireamaid","stairs","patricians","contraspective","pretensent","whatexcuse","fortuneteller","backbend","becky","manna","manna","counterprofeit","counterprofeit","concavescent","concavescent","tripwired","tripwired","endothermic","endothermic"];
var session = ["2211","2213","3131","3132","3133","3141","3142","3143","3151","3152","3251","3252","3253","3254","3255","4051","4052","4053","4054","4055","4056","4057","4058","4071","4111","4112","4113","4151","4152","4153","4154","4181","4182","4221","4271","4272","4281","5021","5022","5041","5042","5043","5061","5131","5221","5281","5291","6021","6022"];
var poem = ["anystar","comedown","comedown2","endyourreign","everest","evolve1","evolve2","geometry","icynight","incensesmoke","intellectual","lovesmiles","tomoon","wetpaint"];

var cont, canv;
var bgFlop = true;
var theImage = new Image();

var loadFirstSong = new CustomEvent('loadfirstsong');


// MOBILE NAV DROPDOWN

var dropdown = document.getElementById('mobileexplore');
var expand = document.getElementById('expand');
expand.className = 'clpsd';
setTimeout(() => {
    expand.style.transition = "height .2s, width .2s";
}, 200);
var expanded = false;
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
    document.body.addEventListener('click', () => {
        navShown(false)
    });
});



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

var abortShuffle = false;

function mLink(url) {
    var songI = url.indexOf("#");
    var song;
    if (songI > -1) {
        song = url.substring(songI + 1, url.length);
        var tData;
        if(tData = tracks.find(t => t.songid === song)){
            abortShuffle = true;
            currentList = window[tData.albumid].concat();
            listIndex = currentList.indexOf(song);
            playNew();
        } else {
            alert('no such track');
        }
        return url.substring(0, songI);
    } else {
        return url;
    }
}




// LOAD ANYTHING

var pageContent = document.getElementById('pageContent');
function onPlatter(html) {
    var afterhead = html.substring(html.indexOf('</head>')+7, html.length+1);
    var scr = afterhead.substring(afterhead.indexOf('<script>')+8, afterhead.indexOf('</script>'));
    pageContent.innerHTML = afterhead;
    eval(scr);
}

function loadPage(url, fromhist) {
    document.removeEventListener('linkchange', poemp),
    document.removeEventListener('linkchange', songp),
    document.removeEventListener('linkchange', seshp),
    !bgFlop && toggleBG();
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
            } else {
                console.log('Error: ' + getPage.status); // An error occurred during the request.
            }
        }
    };
    getPage.send('page='+url);
}

function linkJson(folder){
    return '/js/' +folder+ '/' +link+ '.json';
}

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

function poemp() {loadJson('/js/poems/' + link, newLoadPoem)}
function songp() {loadJson('/js/songs/' + link, newLoadSong)}
function seshp() {loadJson('/js/entanglement/' + link, newLoadSession)}

function newLoadPoem(json){
    document.getElementById('sTitle').innerHTML = json.title;
    document.getElementById('sText').innerHTML = json.text;
}

function newLoadSong(json){
    var tData = tracks.find(t => t.songid === link);

    document.getElementById('lPlay').setAttribute('name', tData.songid);
    document.getElementById('lTitle').innerHTML = json.title;
    document.getElementById('lText').innerHTML = json.text;

    var lAlbum = document.getElementById('lAlbum');
    lAlbum.innerHTML = tData.album;
    lAlbum.setAttribute('href', '/p/album/'+tData.albumid);
    lAlbum.addEventListener('click', int_link);

    canv.style.backgroundImage = 'url(/'+json.bg+')';
    theImage.src = '/'+json.bg;
    console.log(theImage.src);

    // var internals2 = document.getElementsByClassName('internal2');
    // for(var i=0; i<internals2.length; i++){
    //     internals2[i].addEventListener('click', int_link)
    // }
}

function newLoadSession(json){
    canv.style.backgroundSize = 'contain';
    canv.style.backgroundImage = 'url(/'+json.src+')';
    theImage.src = '/'+json.src;
    console.log(theImage.src);
    document.querySelector('.backcanvas').style.backgroundImage = 'url(/'+json.src+')';
    json.v 
        ? (canv.style.backgroundRepeat = 'no-repeat')
        : (canv.style.backgroundRepeat = 'repeat-x'),
    document.getElementById('sDate').innerHTML = json.date,
    document.getElementById('sLoc').innerHTML = json.loc,
    document.getElementById('sRec').innerHTML = json.rec;

    var internals2 = document.getElementsByClassName('internal2');
    for(var i=0; i<internals2.length; i++){
        internals2[i].addEventListener('click', int_link)
    }
}
function toggleBG() {
    if(bgFlop) {
        document.getElementById('pageContent').style.zIndex = 50;
        document.querySelector('.backcanvas').style.zIndex = 50;
        canv.style.zIndex = 55;
        bgFlop = false;
    } else {
        document.getElementById('pageContent').style.zIndex = 0;
        document.querySelector('.backcanvas').style.zIndex = -7;
        canv.style.zIndex = 0;
        bgFlop = true;
    }
}
function setBgToggle() {
    canv.removeEventListener('click', toggleBG)
    bgFlop = true;	
	canv.addEventListener('click', toggleBG)
}

function newLoadPosts(posts){
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
            var internals2 = document.getElementsByClassName('internal2');
            for(var j=0; j<internals2.length; j++){
                internals2[j].addEventListener('click', int_link)
            }
        }
    }

    loadJson('/js/posts/' + posts[i], readyPost);
}




// PAGE MANAGEMENT

var scrolls = [],
    scrollIDs = [];
function setScrl(hash) {
    scrollIDs.indexOf(hash) > -1
        ? scrolls[scrollIDs.indexOf(hash)] = window.scrollY
        : (scrolls.push(window.scrollY), scrollIDs.push(hash));
}
function getScrl(hash) {
    scrollIDs.indexOf(hash) > -1
        ? window.scroll(0, scrolls[scrollIDs.indexOf(hash)])
        : window.scroll(0, 0);
}

function updateHeight(cont, canv) {
    var n = cont.offsetHeight + 200;
    n > window.innerHeight ? (canv.style.height = n+'px') : (canv.style.height = window.innerHeight+'px');

    // getScrl(window.location.hash)
}

function int_link(e) {
    e.preventDefault();
    var url = e.currentTarget.getAttribute('href')
    var p = url.indexOf('/p/');
    p > -1
        ? refresh(url.substring(p+3, url.length+1))
        : refresh('home');
}

var firstPage = true;

var fakeimageupdate = new CustomEvent('fakeimageupdate');

var allcoversloaded = new CustomEvent('allcoversloaded');

function onPageLoad(n = "Ben Somerville", bgPath, bgPos, bgSiz, bgRep, loadEvent) {
    document.title = n, 
    displayedList = undefined;
    var links = document.getElementsByTagName('a');
    for(var i=0; i<links.length; i++){
        links[i].addEventListener('click', e => {
            var n = e.currentTarget.getAttribute("href");
            (n.includes("soundcloud") || n.includes("spotify") || n.includes("youtu")) && pauser()
        })
    }
    var internals = document.getElementsByClassName('internal');
    for(var i=0; i<internals.length; i++){
        internals[i].removeEventListener('click', int_link)
    }
    for(var i=0; i<internals.length; i++){
        internals[i].addEventListener('click', int_link)
    }

    var players = document.getElementsByClassName('player');
    for(var i=0; i<players.length; i++){
        players[i].addEventListener('click', e => {
            e.stopPropagation();
            var song = e.currentTarget.getAttribute('name');
            var list = window[e.currentTarget.getAttribute('data-list')] || displayedList || window[tracks.find(t => t.songid === song).albumid];
            currentList = list.concat();
            listIndex = currentList.indexOf(song),
            playNew('', !0);
        })
    }
    cont = document.getElementById('content'),
    canv = document.getElementById('canvas');
    console.log('load event:' + loadEvent);
    if(bgPath){ 
        if(loadEvent){
            document.addEventListener(loadEvent, function(){
                canv.style.backgroundImage = "url(" + bgPath + ")";
                theImage.src = bgPath;
                document.dispatchEvent(fakeimageupdate);
                console.log(theImage.src);
                firstPage && (firstPage = false, document.dispatchEvent(loadFirstSong));
            }, {once:true});
        } else {
            canv.style.backgroundImage = "url(" + bgPath + ")";
            theImage.src = bgPath;
            document.dispatchEvent(fakeimageupdate);
            console.log(theImage.src);
            firstPage && (firstPage = false, document.dispatchEvent(loadFirstSong));
        }
    }
    if(bgPos) canv.style.backgroundPosition = bgPos;
    if(bgSiz) canv.style.backgroundSize = bgSiz;
    if(bgRep) canv.style.backgroundRepeat = bgRep;
    cont && new ResizeSensor(cont, (function () {
        updateHeight(cont, canv)
    }));
    window.scroll(0, 0);
}




// NAV EXPLORE SHUFFLES

var shuffless = document.getElementsByClassName('shuffles');
for(var i=0; i<shuffless.length; i++){
    shuffless[i].addEventListener('click', e => {
        e.preventDefault();
        var selectfrom = window[e.currentTarget.getAttribute('name')];
        if(selectfrom){
            var goTo = selectfrom[Math.floor(Math.random() * selectfrom.length)];
            selectfrom === albums 
                ? refresh('album/'+goTo) 
                : refresh(e.currentTarget.getAttribute('name') + '-/' + goTo);
                // : console.log(e.currentTarget.getAttribute('name') + '-/' + goTo)
        }
    })
}


// WHY ARE THERE MULTIPLE OF THESE?

var shufflers = document.getElementsByClassName('shuffler');
for(var i=0; i<shufflers.length; i++){
    shufflers[i].addEventListener('click', shuffleOne)
}


window.addEventListener('popstate', (function () {
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
}));

document.addEventListener('loadfirstsong', function(){
    abortShuffle || newShuffle();
}, {once: true});

if (sessionStorage.getItem('firstpage') === null) {
    refresh('home');
} else {
    refresh(mLink(sessionStorage.getItem('firstpage')));
    sessionStorage.removeItem('firstpage')
}