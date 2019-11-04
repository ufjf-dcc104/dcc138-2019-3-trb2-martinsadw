function pad(s, n) {
    if (n != 2) console.warn("not implemented");

    return (s < 10 ? "0" + s : "" + s);
}

function Game() {
    this.gameState = {};

    this.gameState.canvas = document.getElementById('canvas');
    this.gameState.ctx = canvas.getContext('2d');

    // Input ///////////////////////////////////////////////////////////////////
    addInputListener(this.gameState.canvas);
    this.gameState.input = {
        lastClickCounter: 0,
    };
    ////////////////////////////////////////////////////////////////////////////

    // Time ////////////////////////////////////////////////////////////////////
    this.gameState.time = 0;
    this.gameState.lastTime = 0;
    this.gameState.framerate = 60;
    ////////////////////////////////////////////////////////////////////////////

    // Camera //////////////////////////////////////////////////////////////////
    this.gameState.tileSize = 48;
    ////////////////////////////////////////////////////////////////////////////

    // Turn ////////////////////////////////////////////////////////////////////
    this.gameState.currentTurn = 1;
    this.gameState.currentStep = 1;
    ////////////////////////////////////////////////////////////////////////////

    this.gameState.map = new Map(map01);

    this.step = (windowTime) => {
        let {canvas, ctx, lastTime, tileSize, input} = this.gameState;

        this.gameState.time = windowTime / 1000;
        let dT = this.gameState.time - this.gameState.lastTime;
        this.gameState.framerate = this.gameState.framerate * 0.9 + (1 / dT) * 0.1;

        redraw();
        ctx.fillStyle = "#25a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let unitList1 = [
            {x: 5, y: 12, type: 'char_red'},
            {x: 6, y: 11, type: 'char_red'},
            {x: 7, y: 11, type: 'char_red'},
            {x: 8, y: 12, type: 'char_red'},
            {x: 4, y: 8, type: 'char_red'},
            {x: 9, y: 8, type: 'char_red'},
        ];

        let unitList2 = [
            {x: 1, y: 0, type: 'char_blue'},
            {x: 3, y: 0, type: 'char_blue'},
            {x: 3, y: 1, type: 'char_blue'},
            {x: 5, y: 2, type: 'char_blue'},
            {x: 6, y: 2, type: 'char_blue'},
            {x: 9, y: 5, type: 'char_blue'},
        ];

        updateGameStateInput(this.gameState);

        let mapOffsetX = centerCanvasX - this.gameState.map.ids[0].length * 0.5 * tileSize;
        let mapOffsetY = centerCanvasY - this.gameState.map.ids.length * 0.5 * tileSize;

        this.gameState.map.draw(this.gameState, mapOffsetX, mapOffsetY);

        for (let i = 0; i < unitList1.length; ++i) {
            let unit = unitList1[i];
            drawImage(ctx, unit.type, unit.x * tileSize + mapOffsetX, unit.y * tileSize + mapOffsetY, tileSize, tileSize);
        }
        for (let i = 0; i < unitList2.length; ++i) {
            let unit = unitList2[i];
            drawImage(ctx, unit.type, unit.x * tileSize + mapOffsetX, unit.y * tileSize + mapOffsetY, tileSize, tileSize);
        }

        if (input.mouseDown) {
            ctx.fillStyle = "#0006";
            ctx.fillRect(input.clickTilePosX, input.clickTilePosY, tileSize, tileSize);
        }
        ctx.fillStyle = "#9996";
        ctx.fillRect(input.tilePosX, input.tilePosY, tileSize, tileSize);

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
        ctx.moveTo(input.mouseX, input.mouseY - 10);
        ctx.lineTo(input.mouseX, input.mouseY + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(input.mouseX - 10, input.mouseY);
        ctx.lineTo(input.mouseX + 10, input.mouseY);
        ctx.stroke();
        ////////////////////////////////////////////////////////////////////////

        this.gameState.lastTime = this.gameState.time;
        window.requestAnimationFrame(this.step);
    }

    window.requestAnimationFrame(this.step);
}

let game = new Game();
