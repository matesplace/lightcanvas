var LightCanvas = require('../lib/index.js');

var width = 40;
var height = 10;

var canvas = new LightCanvas(width, height, 'localhost');

var ctx = canvas.getContext('2d');
ctx.fillStyle = '#ff0000';
ctx.fillRect(0, 0, width, height);

canvas.setUniverseSize(0x01, 160);
canvas.setUniverseSize(0x02, 160);
canvas.setUniverseSize(0x03, 80);

setInterval(() => {
    canvas.update();
}, 1000);