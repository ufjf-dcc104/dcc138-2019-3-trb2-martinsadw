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
    this.gameState.turn = {
        currentTurn: 0,
        currentStep: 0,
        selectedUnitIndex: 0,
        moveOptions: [],
    }
    ////////////////////////////////////////////////////////////////////////////

    // Map /////////////////////////////////////////////////////////////////////
    this.gameState.map = new Map(map01);

    this.gameState.unitList = [
        [
            {x: 5, y: 12, type: 'char_red'},
            {x: 6, y: 11, type: 'char_red'},
            {x: 7, y: 11, type: 'char_red'},
            {x: 8, y: 12, type: 'char_red'},
            {x: 4, y: 8, type: 'char_red'},
            {x: 9, y: 8, type: 'char_red'},
        ],
        [
            {x: 1, y: 0, type: 'char_blue'},
            {x: 3, y: 0, type: 'char_blue'},
            {x: 3, y: 1, type: 'char_blue'},
            {x: 5, y: 2, type: 'char_blue'},
            {x: 6, y: 2, type: 'char_blue'},
            {x: 9, y: 5, type: 'char_blue'},
        ],
    ]
    ////////////////////////////////////////////////////////////////////////////

    this.step = (windowTime) => {
        let {canvas, ctx, lastTime, tileSize, turn, input, unitList} = this.gameState;

        this.gameState.time = windowTime / 1000;
        let dT = this.gameState.time - this.gameState.lastTime;
        this.gameState.framerate = this.gameState.framerate * 0.9 + (1 / dT) * 0.1;

        redraw();
        ctx.fillStyle = "#25a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        updateGameStateInput(this.gameState);
        updateTurn(this.gameState);

        let mapOffsetX = centerCanvasX - this.gameState.map.ids[0].length * 0.5 * tileSize;
        let mapOffsetY = centerCanvasY - this.gameState.map.ids.length * 0.5 * tileSize;

        this.gameState.map.draw(this.gameState, mapOffsetX, mapOffsetY);

        for (let i = 0; i < unitList[0].length; ++i) {
            let unit = unitList[0][i];
            drawImage(ctx, unit.type, unit.x * tileSize + mapOffsetX, unit.y * tileSize + mapOffsetY, tileSize, tileSize);
        }
        for (let i = 0; i < unitList[1].length; ++i) {
            let unit = unitList[1][i];
            drawImage(ctx, unit.type, unit.x * tileSize + mapOffsetX, unit.y * tileSize + mapOffsetY, tileSize, tileSize);
        }

        if (turn.currentStep == 1) {
            let selectedUnit = unitList[turn.currentTurn][turn.selectedUnitIndex];
            ctx.strokeStyle = "#ff0";
            ctx.lineWidth = 4;
            ctx.strokeRect(worldToScreen(selectedUnit.x, mapOffsetX, tileSize) + 2, worldToScreen(selectedUnit.y, mapOffsetY, tileSize) + 2, tileSize - 4, tileSize - 4);

            for (let y = 0; y < turn.moveOptions.length; y++) {
                for (let x = 0; x < turn.moveOptions[y].length; x++) {
                    let tile = turn.moveOptions[y][x];

                    if (!mapIsWalkable(this.gameState.map.weights, x, y) ||
                        tile.cost > 5 ||
                        (x == selectedUnit.x && y == selectedUnit.y))
                        continue;

                    ctx.fillStyle = "#9909";
                    ctx.fillRect(x * tileSize + mapOffsetX, y * tileSize + mapOffsetY, tileSize, tileSize);
                }
            }
        }

        if (input.mouseDown) {
            ctx.fillStyle = "#0006";
            ctx.fillRect(input.clickTilePosX, input.clickTilePosY, tileSize, tileSize);
        }
        ctx.fillStyle = "#9996";
        ctx.fillRect(input.tilePosX, input.tilePosY, tileSize, tileSize);

        // this.gameState.map.debugDraw(this.gameState, this.temp, 5, mapOffsetX, mapOffsetY);
        // for (let y = 0; y < this.temp.length; y++) {
        //     for (let x = 0; x < this.temp[y].length; x++) {
        //         let tile = this.temp[y][x];
        //
        //         if (tile.cost > 5) continue;
        //
        //         ctx.font = "10px sans-serif";
        //         ctx.fillStyle = "#000";
        //         ctx.fillText(tile.cost, x * tileSize + mapOffsetX + 5, y * tileSize + mapOffsetY + 15);
        //
        //         if (tile.prev) {
        //             // ctx.fillStyle = "#444";
        //             // ctx.fillText(tile.prev.x + "x" + tile.prev.y, x * tileSize + mapOffsetX + 5, y * tileSize + mapOffsetY + 30);
        //
        //             ctx.beginPath();
        //             ctx.lineWidth = 2;
        //             ctx.strokeStyle = "#000";
        //             ctx.moveTo(x * tileSize + mapOffsetX + 24, y * tileSize + mapOffsetY + 24);
        //             ctx.lineTo(tile.prev.x * tileSize + mapOffsetX + 24, tile.prev.y * tileSize + mapOffsetY + 24);
        //             ctx.stroke();
        //         }
        //     }
        // }

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

            let turnName = [
                "Red",
                "Blue",
            ];
            let stepName = [
                "Select",
                "Move",
                "Attack",
                "Confirm",
            ];
            ctx.font = "13px sans-serif";
            ctx.fillStyle = "#7f7";
            ctx.fillText(turnName[turn.currentTurn] + " - " + stepName[turn.currentStep], 25, canvas.height - 75);
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
