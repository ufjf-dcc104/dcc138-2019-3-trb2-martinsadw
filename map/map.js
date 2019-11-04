function map2(arr, func) {
    return arr.map((row) => {
        return row.map((pos) => {
            return func(pos);
        });
    });
}

function Map(map) {
    this.ids = map;

    this.weights = map2(this.ids, (id) => {
        return idWeight[id];
    });

    this.draw = (gameState, offsetX, offsetY) => {
        let {ctx, tileSize} = gameState;

        for (let y = 0; y < this.ids.length; y++) {
            for (let x = 0; x < this.ids[y].length; x++) {
                let tile = this.ids[y][x];

                gameState.ctx.fillStyle = idColor[tile];
                gameState.ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize + 1, tileSize + 1);
                gameState.ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize + 1, tileSize + 1);

                gameState.ctx.strokeStyle = "#4442";
                gameState.ctx.lineWidth = 1;
                gameState.ctx.strokeRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize, tileSize);
            }
        }
    }
}
