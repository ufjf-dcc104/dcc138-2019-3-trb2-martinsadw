function updateTurn(gameState) {
    let {input, turn} = gameState;
    let enemyTurn = (turn.currentTurn + 1) % 2;

    let availableUnitsCount = gameState.unitList[turn.currentTurn].reduce((acc, unit) => {
        return (unit.cooldown > 0 ? acc : acc + 1);
    }, 0);

    if (availableUnitsCount <= 0)
        endTurn(gameState);

    switch (turn.currentStep) {
        case 0: // Select unit
            if (gameState.input.click) {
                let clickedUnitIndex = findUnit(gameState.unitList[turn.currentTurn], input.clickTileX, input.clickTileY);

                if (clickedUnitIndex >= 0) {
                    let clickedUnit = gameState.unitList[turn.currentTurn][clickedUnitIndex];

                    if (clickedUnit.cooldown <= 0) {
                        gameState.turn.selectedUnitIndex = clickedUnitIndex;
                        gameState.turn.moveOptions = calculateDistanceMap(gameState.map.weights, clickedUnit.x, clickedUnit.y);
                        gameState.turn.currentStep = 1;
                    }
                }
            }
            break;
        case 1: // Select movement
            if (gameState.input.click) {
                let selectedUnit = gameState.unitList[turn.currentTurn][gameState.turn.selectedUnitIndex];

                if (input.clickTileX == selectedUnit.x && input.clickTileY == selectedUnit.y) {
                    gameState.turn.attackOptions = calculateDistanceMap(gameState.map.weights, selectedUnit.x, selectedUnit.y, false);
                    gameState.turn.currentStep = 2;
                    break;
                }

                if (mapIsWalkable(gameState.map.weights, input.clickTileX, input.clickTileY) &&
                    findUnit(gameState.unitList[turn.currentTurn], input.clickTileX, input.clickTileY) < 0 &&
                    findUnit(gameState.unitList[enemyTurn], input.clickTileX, input.clickTileY) < 0) {

                    let distance = turn.moveOptions[input.clickTileY][input.clickTileX].cost;
                    if (distance <= selectedUnit.speed) {
                        selectedUnit.x = input.clickTileX;
                        selectedUnit.y = input.clickTileY;
                        gameState.turn.attackOptions = calculateDistanceMap(gameState.map.weights, selectedUnit.x, selectedUnit.y, false);

                        gameState.turn.currentStep = 2;
                    }
                }
            }
            break;
        case 2: // Select action
            if (gameState.input.click) {
                let selectedUnit = gameState.unitList[turn.currentTurn][gameState.turn.selectedUnitIndex];

                if (input.clickTileX == selectedUnit.x && input.clickTileY == selectedUnit.y) {
                    applyDelay(selectedUnit);
                    endTurn(gameState);
                    break;
                }

                let clickedUnitIndex = findUnit(gameState.unitList[enemyTurn], input.clickTileX, input.clickTileY);
                if (clickedUnitIndex >= 0) {
                    let clickedUnit = gameState.unitList[enemyTurn][clickedUnitIndex];

                    let distance = turn.attackOptions[input.clickTileY][input.clickTileX].cost;
                    if (distance <= selectedUnit.attackRange) {
                        clickedUnit.hp -= selectedUnit.attack;

                        if (clickedUnit.hp <= 0) {
                            gameState.unitList[enemyTurn].splice(clickedUnitIndex, 1);
                        }

                        gameState.turn.currentStep = 3;
                    }
                }
            }
            break;
        case 3: // Confirm
            let selectedUnit = gameState.unitList[turn.currentTurn][gameState.turn.selectedUnitIndex];

            if (true) { // Check end of turn
                applyDelay(selectedUnit);
                endTurn(gameState);
            }
            break;
        default:
    }
}

function findUnit(list, x, y) {
    return list.findIndex((elem) => {
        return (elem.x == x && elem.y == y);
    });
}

function applyDelay(unit) {
    unit.cooldown = unit.delay;
}

function endTurn(gameState) {
    let {unitList} = gameState;

    gameState.turn.currentTurn = (gameState.turn.currentTurn == 0 ? 1 : 0);
    gameState.turn.currentStep = 0;

    let t = gameState.turn.currentTurn;
    for (let i = 0; i < unitList[t].length; ++i) {
        let unit = unitList[t][i];

        if (unit.cooldown > 0)
            unit.cooldown--;

        // console.log("CD: ", t, /i, unit.cooldown);
    }
}
