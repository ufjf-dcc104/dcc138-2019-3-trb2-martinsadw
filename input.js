let inputState = {
    mouseDown: false,
    mouseX: 0,
    mouseY: 0,
    eventCounter: 0,
    lastClickX: 0,
    lastClickY: 0,
    lastClickCounter: 0,
};

function addInputListener(canvas) {
    // https://stackoverflow.com/a/17130415
    canvas.addEventListener('mousemove', (event) => {
        let canvasRect = canvas.getBoundingClientRect();
        inputState.mouseX = event.clientX - canvasRect.left;
        inputState.mouseY = event.clientY - canvasRect.top;
    });

    canvas.addEventListener('mousedown', (event) => {
        event.preventDefault();
        inputState.eventCounter++;

        inputState.mouseDown = true;
        inputState.lastClickX = inputState.mouseX;
        inputState.lastClickY = inputState.mouseY;
    });
    canvas.addEventListener('mouseup', (event) => {
        event.preventDefault();
        inputState.eventCounter++;

        inputState.mouseDown = false;
        inputState.lastClickCounter = inputState.eventCounter;
    });

    // Prevents context menu
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
}

function updateGameStateInput(gameState) {
    let tileSize = gameState.tileSize;
    let mapOffsetX = centerCanvasX - gameState.map.ids[0].length * 0.5 * tileSize;
    let mapOffsetY = centerCanvasY - gameState.map.ids.length * 0.5 * tileSize;

    gameState.input.clickTileX = screenToWorld(inputState.lastClickX, mapOffsetX, tileSize);
    gameState.input.clickTileY = screenToWorld(inputState.lastClickY, mapOffsetY, tileSize);
    gameState.input.clickTilePosX = worldToScreen(gameState.input.clickTileX, mapOffsetX, tileSize);
    gameState.input.clickTilePosY = worldToScreen(gameState.input.clickTileY, mapOffsetY, tileSize);
    gameState.input.clickMouseX = inputState.lastClickX;
    gameState.input.clickMouseY = inputState.lastClickY;

    if (gameState.input.lastClickCounter < inputState.lastClickCounter) {
        gameState.input.click = true;
    }
    else {
        gameState.input.click = false;
    }

    gameState.input.tileX = screenToWorld(inputState.mouseX, mapOffsetX, tileSize);
    gameState.input.tileY = screenToWorld(inputState.mouseY, mapOffsetY, tileSize);
    gameState.input.tilePosX = worldToScreen(gameState.input.tileX, mapOffsetX, tileSize);
    gameState.input.tilePosY = worldToScreen(gameState.input.tileY, mapOffsetY, tileSize);
    gameState.input.mouseX = inputState.mouseX;
    gameState.input.mouseY = inputState.mouseY;

    gameState.input.mouseDown = inputState.mouseDown;
    gameState.input.lastClickCounter = inputState.lastClickCounter;
}

function screenToWorld(value, offset, tileSize) {
    return Math.floor((value - offset) / tileSize);
}

function worldToScreen(value, offset, tileSize) {
    return value * tileSize + offset;
}
