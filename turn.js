function findUnit(list, x, y) {
    return list.findIndex((elem) => {
        return (elem.x == x && elem.y == y);
    });
}

function updateTurn(gameState) {
    let {input, turn} = gameState;

    switch (turn.currentStep) {
        case 0: // Select unit
            if (gameState.input.click) {
                clickedUnit = findUnit(gameState.unitList[turn.currentTurn], input.clickTileX, input.clickTileY);

                if (clickedUnit >= 0) {
                    gameState.turn.selectedUnitIndex = clickedUnit;
                    gameState.turn.currentStep = 1;
                }
            }
            break;
        case 1: // Select movement

            if (true) // Check movement selected
                gameState.turn.currentStep = 2;
            break;
        case 2: // Select action

            if (true) // Check action selected
                gameState.turn.currentStep = 3;
            break;
        case 3: // Confirm

            if (true) { // Check end of turn
                gameState.turn.currentTurn = (gameState.turn.currentTurn == 0 ? 1 : 0);
                gameState.turn.currentStep = 0
            }
            break;
        default:
    }
}
