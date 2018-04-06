// nyan
var dx = 2; 
var nyans = [];
var score = 0; 
var life = 5; 
var eventX, eventY; 
var nyanImage = new Image(); 
nyanImage.src = 'images/staticnyan.png';

// flake
var flakeDx = 1; 
var flakes = [];
var flake1 = new Image();
var flake2 = new Image();
var flake3 = new Image();
var flake4 = new Image();
flake1.src = 'images/flake.png';
flake2.src = 'images/flake1.png';
flake3.src = 'images/flake2.png';
flake4.src = 'images/flake3.png';
var flakeImages = [
    flake1, flake2, flake3, flake4
];

// start of flake
function createFlake() {
    var element = document.getElementById('space');
    var randomImage = flakeImages[Math.floor(Math.random() * 4)];
    var startingY = Math.random() * (element.height - randomImage.height);
    var flake = {x : element.width, y : startingY, image : randomImage}; 
    flakes.push(flake);
}

function drawFlake(flake) {
    var element = document.getElementById('space');
    var context = element.getContext('2d');
    context.drawImage(flake.image, flake.x, flake.y);
    flake.x -= flakeDx;
}

function destroyFlake(flake) {
    var index = flakes.indexOf(flake);
    if (flake.x <= 0) { 
        flakes.splice(index, 1); 
    }
}

function tickFlakes() {
    var element = document.getElementById('space');
    var context = element.getContext('2d');
    context.clearRect(0, 0, element.width, element.height);
    for (var i = 0; i < flakes.length; i++) {
        drawFlake(flakes[i]);
        destroyFlake(flakes[i]);
    }
}
// end of flake

// start of nyan
function createNyan() {
    var element = document.getElementById('playground');
    var random = Math.random() * 0.6 + 0.4;
    var nyanWidth = random * nyanImage.width; 
    var nyanHeight = random * nyanImage.height;
    var startingY = Math.random() * (element.height - nyanHeight);
    var nyan = { 
        x : 0, y : startingY, 
        width : nyanWidth, 
        height : nyanHeight, 
        image : nyanImage
    };
    nyans.push(nyan);
}

function drawNyan(nyan) {
    var context = document.getElementById('playground').getContext('2d');
    context.drawImage(
        nyanImage, nyan.x, nyan.y, 
        nyan.width, nyan.height
    );
    nyan.x += dx;
}

function destroyNyan(nyan) {
    var meow = document.getElementById('meow'); 
    var index = nyans.indexOf(nyan);
    if (eventX >= nyan.x && eventX <= nyan.x + nyan.width
       && eventY >= nyan.y && eventY <= nyan.y + nyan.height) {
        meow.load();
        meow.play();
        nyans.splice(index, 1);
        eventX = -1; eventY = -1;       
        score++; 
        displayStatus();
    }
}

function detectEdgeCollision(nyan) {
    var index = nyans.indexOf(nyan);
    var element = document.getElementById('playground');
    var toasters = document.getElementById('toasters');
    if (nyan.x + nyan.width >= element.width - toasters.width) {
        if (life > 1) {
            nyans.splice(index, 1);
            life--;
            displayStatus();
        }
        else {
            window.location = 'gameover.html';
        }
    }
}

function tickNyans() {
    var element = document.getElementById('playground');
    var context = element.getContext('2d');
    context.clearRect(0, 0, element.width, element.height);
    for (var i = 0; i < nyans.length; i++) {
        drawNyan(nyans[i]);
        destroyNyan(nyans[i]);
        detectEdgeCollision(nyans[i]);
    }
}
// end of nyan

function displayStatus() {
    document.getElementById('stats').innerHTML = 
        'SCORE: ' + score + ' | LIFE: ' + life;
}

function setMousedown(event) {
    eventX = event.clientX;
    eventY = event.clientY;
}
    
function on_resize() {
    var canvases = [];
    var nyanElement = document.getElementById('playground');
    var spaceElement = document.getElementById('space');
    canvases.push(nyanElement);
    canvases.push(spaceElement);
    for (var i = 0; i < canvases.length; i++) {
        canvases[i].width = window.innerWidth;
        canvases[i].height = window.innerHeight;
    }
}
    
window.onload = function() {
    var bgmusic = document.getElementById('bgmusic');
    bgmusic.loop = true;
    bgmusic.load();
    bgmusic.play();
    on_resize();

    // nyans
    setInterval(tickNyans, 10);
    setInterval(createNyan, 900);
    displayStatus();
    createNyan();
    tickNyans();
    
    // flakes
    setInterval(tickFlakes, 10);
    setInterval(createFlake, 500);
    createFlake();
    tickFlakes();
}

window.onresize = function() {
    on_resize();
}