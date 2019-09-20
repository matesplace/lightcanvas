# lightcanvas

A Node.js library for streaming a HTML Canvas drawing to devices using the E1.31 (sACN) protocol.


## Installation

```bash
npm install lightcanvas
```

## Example Usage

```js
var LightCanvas = require('lightcanvas');
var canvas = new LightCanvas(width, height, hostname);

var ctx = canvas.getContext('2d');
ctx.fillStyle = '#ff0000';
ctx.fillRect(0, 0, width, height);

canvas.update();
```

## License

MIT