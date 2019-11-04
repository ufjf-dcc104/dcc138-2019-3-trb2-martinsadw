function pad(s, n) {
    if (n != 2) console.warn("not implemented");

    return (s < 10 ? "0" + s : "" + s);
}

function Game() {
    this.gameState = {};

    this.gameState.canvas = document.getElementById('canvas');
    this.gameState.ctx = canvas.getContext('2d');

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    // https://stackoverflow.com/a/17130415
    this.gameState.canvas.addEventListener('mousemove', (event) => {
        let canvasRect = canvas.getBoundingClientRect();
        this.mouseX = event.clientX - canvasRect.left;
        this.mouseY = event.clientY - canvasRect.top;
    })

    this.gameState.canvas.addEventListener('mousedown', (event) => {
        this.mouseDown = true;
    })
    this.gameState.canvas.addEventListener('mouseup', (event) => {
        this.mouseDown = false;
    })

    this.gameState.time = 0;
    this.gameState.lastTime = 0;
    this.gameState.framerate = 60;

    this.gameState.tileSize = 48;

    this.map = new Map(map01);

    this.step = (windowTime) => {
        let {canvas, ctx, lastTime, tileSize} = this.gameState;

        this.gameState.time = windowTime / 1000;
        let dT = this.gameState.time - this.gameState.lastTime;
        this.gameState.framerate = this.gameState.framerate * 0.9 + (1 / dT) * 0.1;

        redraw();
        ctx.fillStyle = "#25a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let unitList = [
            {x: 5, y: 12, type: 'char'},
            {x: 6, y: 11, type: 'char'},
            {x: 7, y: 11, type: 'char'},
            {x: 8, y: 12, type: 'char'},
            {x: 4, y: 8, type: 'char'},
        ]

        let mapOffsetX = centerCanvasX - this.map.ids[0].length * 0.5 * tileSize;
        let mapOffsetY = centerCanvasY - this.map.ids.length * 0.5 * tileSize;
        let mouseTileX = Math.floor((this.mouseX - mapOffsetX) / tileSize);
        let mouseTileY = Math.floor((this.mouseY - mapOffsetY) / tileSize);

        this.map.draw(this.gameState, mapOffsetX, mapOffsetY);

        for (let i = 0; i < unitList.length; ++i) {
            let unit = unitList[i];
            drawImage(ctx, unit.type, unit.x * tileSize + mapOffsetX, unit.y * tileSize + mapOffsetY, tileSize, tileSize);
        }

        if (this.mouseDown) {
            ctx.fillStyle = "#0006";
        }
        else {
            ctx.fillStyle = "#9996";
        }
        ctx.fillRect(mouseTileX * tileSize + mapOffsetX, mouseTileY * tileSize + mapOffsetY, tileSize, tileSize);

        // if (availableHUD.gameTime) {
        if (true) {
            ctx.font = "13px sans-serif";
            ctx.fillStyle = "#9f9";
            ctx.fillText(pad(Math.round(this.gameState.framerate), 2), 25, canvas.height - 55);
            ctx.font = "11px sans-serif";
            ctx.fillText("FPS", 43, canvas.height - 55);

            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#9f9";
            let timeMili = Math.floor(this.gameState.time * 1000) % 1000;
            let timeSec = Math.floor(this.gameState.time) % 60;
            let timeMin = Math.floor(this.gameState.time / 60) % 60;
            let timeHour = Math.floor(this.gameState.time / (60 * 60));
            ctx.fillText(timeHour + ":" + pad(timeMin, 2) + ":" + pad(timeSec, 2), 25, canvas.height - 30);

            ctx.font = "13px sans-serif";
            ctx.fillStyle = "#7f7";
            ctx.fillText("." + timeMili, 92, canvas.height - 30);
        }

        // Draw mouse cursor ///////////////////////////////////////////////////
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(this.mouseX, this.mouseY - 10);
        ctx.lineTo(this.mouseX, this.mouseY + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.mouseX - 10, this.mouseY);
        ctx.lineTo(this.mouseX + 10, this.mouseY);
        ctx.stroke();
        ////////////////////////////////////////////////////////////////////////

        this.gameState.lastTime = this.gameState.time;
        window.requestAnimationFrame(this.step);
    }

    window.requestAnimationFrame(this.step);
}

let game = new Game();
