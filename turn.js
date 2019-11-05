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
                let clickedUnitIndex = findUnit(gameState.unitList[turn.currentTurn], input.clickTileX, input.clickTileY);

                if (clickedUnitIndex >= 0) {
                    let clickedUnit = gameState.unitList[turn.currentTurn][clickedUnitIndex];
                    gameState.turn.selectedUnitIndex = clickedUnitIndex;
                    gameState.turn.moveOptions = calculateDistanceMap(gameState.map.weights, clickedUnit.x, clickedUnit.y);
                    gameState.turn.currentStep = 1;
                }
            }
            break;
        case 1: // Select movement
            if (gameState.input.click) {
                let selectedUnit = gameState.unitList[turn.currentTurn][gameState.turn.selectedUnitIndex];

                if (mapIsWalkable(gameState.map.weights, input.clickTileX, input.clickTileY) &&
                    findUnit(gameState.unitList[turn.currentTurn], input.clickTileX, input.clickTileY) < 0) {

                    let distance = turn.moveOptions[input.clickTileY][input.clickTileX].cost;
                    if (distance <= 5) {
                        selectedUnit.x = input.clickTileX;
                        selectedUnit.y = input.clickTileY;
                        gameState.turn.attackOptions = calculateDistanceMap(gameState.map.weights, selectedUnit.x, selectedUnit.y, false);

                        gameState.turn.currentStep = 2;
                    }
                }
            }
            break;
        case 2: // Select action

            // if (true) // Check action selected
            //     gameState.turn.currentStep = 3;
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
