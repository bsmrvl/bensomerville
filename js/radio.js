var radioStatus = false,
    radioRun = false;
var neon = document.getElementById('neon');
var radio = document.getElementById('radio');
var rAudio;

// function checkRadio() {
//     var getJ = new XMLHttpRequest();
//     getJ.open('GET','checkRadio.json');
//     getJ.onreadystatechange = () => {
//         if(getJ.readyState === 4 && getJ.status === 200) {
//             var o = JSON.parse(getJ.responseText);
//             o.rStatus != radioStatus && (
//                 radioStatus = o.rStatus, 
//                 radioStatus ? neon.className = 'neOn' : neon.className = 'neOff', 
//                 (!radioStatus && radioRun) && stopRadio()
//             )
//         }
//     };
//     getJ.send();
// }

if(typeof(EventSource)!=="undefined") {
    var eSource = new EventSource("toggleRadio.php");

	eSource.onmessage = function() {
        radioStatus = !radioStatus;
        radioStatus ? neon.className = 'neOn' : neon.className = 'neOff', 
        (!radioStatus && radioRun) && stopRadio()
	};
}
else {
	document.getElementById("serverData").innerHTML="Whoops! Your browser doesn't receive server-sent events.";
}

function startRadio() {
    pauser();
    document.getElementById('player').style.display = 'none';
    radio.style.display = 'block';
    rAudio = document.createElement('AUDIO');
    rAudio.setAttribute('src','https://quarrycast.hopto.org/stream');
    radio.appendChild(rAudio);
    rAudio.play();
    radioRun = true;
}

function stopRadio() {
    rAudio.remove();
    radio.style.display = 'none';
    document.getElementById('player').style.display = 'block';
    radioRun = false;
}

neon.addEventListener('click', () => {
    radioStatus && startRadio()
})