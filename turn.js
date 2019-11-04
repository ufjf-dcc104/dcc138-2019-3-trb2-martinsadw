function updateTurn(gameState) {
    switch (gameState.currentStep) {
        case 0: // Select unit

            if (true) // Check unit selected
                gameState.currentStep = 1;
            break;
        case 1: // Select movement

            if (true) // Check movement selected
                gameState.currentStep = 2;
            break;
        case 2: // Select action

            if (true) // Check action selected
                gameState.currentStep = 3;
            break;
        case 3: // Confirm

            if (true) { // Check end of turn
                gameState.currentStep = 0
                gameState.currentTurn = (gameState.currentTurn == 0 ? 1 : 0);
            }
            break;
        default:
    }
}
