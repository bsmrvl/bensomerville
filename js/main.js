/** Functions for general site functionality.
*/


// REQUESTS

function request(url, type, data=null, callback) {
    var req = new XMLHttpRequest();
    req.open(type, url);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = () => {
        if(req.readyState === 4){
            if(req.status === 200){
                callback(req.responseText);
                linkElement && (linkElement.style.cursor = '');
            } else {
                console.log('Error: ' + req.status);
            }
        }
    }
    linkElement && (linkElement.style.cursor = 'wait');
    req.send(data);
}

function getJSON(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'json';
    req.onreadystatechange = () => {
        if(req.readyState === 4){
            if(req.status === 200){
                callback(req.response);
            } else {
                console.log('Error: ' + req.status);
            }
        }
    }
    req.send();
};



// LOAD PAGES

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

function renderHTML(html) {
    var afterhead = html.substring(html.indexOf('</head>')+7, html.length+1);
    var scr = afterhead.substring(afterhead.indexOf('<script>')+8, afterhead.indexOf('</script>'));
    pageContent.innerHTML = afterhead;
    eval(scr);
}

function loadPage(url, fromhist) {
    document.removeEventListener('linkchange', poemp);
    document.removeEventListener('linkchange', songp);
    document.removeEventListener('linkchange', seshp);
    bgFocus && toggleBG();

    request(
        '/load_page.php',
        'POST',
        `page=${url}`,
        r => {
            renderHTML(r);
            var histString = '/p/' + url + (link && ('-/' + link));
            fromhist 
                ? window.history.replaceState('hist','',histString)
                : window.history.pushState('new','',histString);
        }
    );
}



// LOAD FROM DB

function squery(table, id) {
    return `SELECT * FROM ${table} WHERE tid = "${id}";`
}

function query(qry, callback) {
    request(
        '/query.php',
        'POST',
        `q=${qry}`,
        r => {
            data = JSON.parse(r);
            data.length == 1
                ? callback(data[0])
                : callback(data);
        }
    )
}

function poemp() {query(squery('poems', link), loadPoem)}
function songp() {query(squery('songs', link), loadSong)}
function seshp() {query(squery('sessions', link), loadSession)}

function loadPoem(r){
    document.getElementById('sTitle').innerHTML = r.title;
    document.getElementById('sText').innerHTML = r.words;
}

function loadSong(r){
    var tData = tracks[link];

    document.getElementById('lPlay').setAttribute('name', tData.songid);
    document.getElementById('lTitle').innerHTML = r.title;
    document.getElementById('lText').innerHTML = r.words;

    var lAlbum = document.getElementById('lAlbum');
    lAlbum.innerHTML = tData.album;
    lAlbum.setAttribute('href', '/p/album/'+tData.albumid);

    setImageEvent('/'+r.img);

    resetDynInternals();
}

function loadSession(r){
    canv.style.backgroundSize = 'contain';
    setImageEvent('/'+r.img);
    document.querySelector('.backcanvas').style.backgroundImage = 'url(/'+r.img+')';
    parseInt(r.vert)
        ? (canv.style.backgroundRepeat = 'no-repeat')
        : (canv.style.backgroundRepeat = 'repeat-x'),
    document.getElementById('sDate').innerHTML = r.dat,
    document.getElementById('sLoc').innerHTML = r.loc,
    document.getElementById('sRec').innerHTML = r.rec;

    resetDynInternals();
}

function toggleBG() {
    pageContent.style.zIndex = bgFocus ? 0 : 50;
    document.querySelector('.backcanvas').style.zIndex = bgFocus ? -7 : 50;
    canv.style.zIndex = bgFocus ? 0 : 55;
    bgFocus = !bgFocus;
}

function setBgToggle() {           // Called by session.html
    canv.removeEventListener('click', toggleBG)
    bgFocus = false;	
    canv.addEventListener('click', toggleBG)
}

function addPost(json, postBlock){
    var lBreak = document.createElement('p');
    lBreak.innerHTML = "<br><hr noshade color='#eeeeee'><br><br>";
    postBlock.appendChild(lBreak);

    var blogPost = document.createElement('div');
    blogPost.setAttribute('class','blogpost');
    postBlock.appendChild(blogPost);

    var postDate = document.createElement('div');
    postDate.setAttribute('class','postdate');
    if(json.img){
        postDate.innerHTML = json.dat + '<br>' + `<img src="${json.img}" style="padding-top: 8px;" alt="Blog Post Sample Image">`;
    } else {
        postDate.innerHTML = json.dat;
    }
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
}
    
function loadPosts(blog, starting, callback){
    var postList = document.getElementsByClassName('blogposts')[0];
    var postBlock = document.createElement('div');
    var qry;
    starting
        ? qry = `SELECT * FROM posts WHERE bid="${blog}" AND bpos<${starting} ORDER BY bpos DESC LIMIT 3`
        : qry = `SELECT * FROM posts WHERE bid="${blog}" ORDER BY bpos DESC LIMIT 3`;
    query(qry, posts => {
        for(const post of posts){
            addPost(post, postBlock);
        }
        postList.appendChild(postBlock);
        resetDynInternals();

        callback(parseInt(posts[posts.length-1].bpos));
    });
}

function callLoadPosts(blog) {         // called by news.html and datascience.html
    var lastShownPost;
    function updateLast(n){
        lastShownPost = n;
    }
    loadPosts(blog, null, updateLast);
    
    var loadMore;
    if (loadMore = document.getElementById('loadmore')){
        loadMore.addEventListener('click', e => {
            linkElement = e.target;
            lastShownPost > 1 && loadPosts(blog, lastShownPost, updateLast);
        });
    }
}



// DELAY AUDIO LOADING UNTIL AFTER BG IMAGE

function readyHandler(){
    document.dispatchEvent(readyforaudio);
    fullReady = true;
}

function setImageEvent(path, loadEvent){
    function setBG(){
        canv.style.backgroundImage = "url(" + path + ")";
        theImage.src = path;
    }

    fullReady = false;
    document.dispatchEvent(newimage);
    if(loadEvent){
        document.removeEventListener(loadEvent, setBG);
        document.addEventListener(loadEvent, setBG, {once:true});
    } else {
        setBG();
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

function setExtPlayers(){
    for(const link of document.getElementsByTagName('a')){
        link.addEventListener('click', e => {
            var n = e.currentTarget.getAttribute("href");
            (n.includes("soundcloud") || n.includes("spotify") || n.includes("youtu")) && pauser();
        });
    }
}

function resetInternals(){
    for(const int of document.getElementsByClassName('internal')){
        int.removeEventListener('click', intLink);
        int.addEventListener('click', intLink);
    }
}

function resetDynInternals(){
    for(const int of document.getElementsByClassName('internal2')){
        int.removeEventListener('click', intLink);
        int.addEventListener('click', intLink);
    }
}

function setPlayers(){
    for(const player of document.getElementsByClassName('player')){
        player.addEventListener('click', e => {
            e.stopPropagation();
            let song = e.currentTarget.getAttribute('name');
            let list = window[e.currentTarget.getAttribute('data-list')] || window[tracks[song].albumid];
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

function onPageLoad(n="Ben Somerville", bg={path:null, pos:null, siz:null, rep:null, att:null}, loadEvent) {
    document.title = n, 

    cont = document.getElementById('content'),
    canv = document.getElementById('canvas');

    if(bg.path) setImageEvent(bg.path, loadEvent);
    if(bg.pos) canv.style.backgroundPosition = bg.pos;
    if(bg.siz) canv.style.backgroundSize = bg.siz;
    if(bg.rep) canv.style.backgroundRepeat = bg.rep;
    if(bg.att) canv.style.backgroundAttachment = bg.att;

    setExtPlayers();
    resetInternals();
    setPlayers();

    cont && new ResizeSensor(cont, () => updateHeight(cont, canv));
    window.scroll(0, 0);
}



// NAV DROPDOWN

class DropDown {
    constructor(toggler, menu) {
        this.toggler = toggler;
        this.menu = menu;
        this.state = false;

        this.menu.className = 'clpsd';
        setTimeout(() => this.menu.style.transition = "height .2s, width .2s", 200);

        this.toggler.addEventListener('click', e => {
            e.stopPropagation();
            this.toggle();
            document.body.addEventListener('click', () => this.toggle(false), {once:true});
        });
    }

    toggle(so=!this.state) {
        if (so) {
            this.menu.className = 'expnd';
            setTimeout(() => this.toggler.innerHTML='Explore', 200);
        } else {
            this.menu.className = 'clpsd';
            this.toggler.innerHTML = 'E';
        }
        this.state = so;
    }
}