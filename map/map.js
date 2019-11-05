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

                ctx.fillStyle = idColor[tile];
                ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize + 1, tileSize + 1);
                ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize + 1, tileSize + 1);

                ctx.strokeStyle = "#4442";
                ctx.lineWidth = 1;
                ctx.strokeRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize, tileSize);
            }
        }
    }

    this.debugDraw = (gameState, distance, maxCost, offsetX, offsetY) => {
        let {ctx, tileSize} = gameState;

        for (let y = 0; y < distance.length; y++) {
            for (let x = 0; x < distance[y].length; x++) {
                let tile = distance[y][x];

                if (tile.cost > maxCost) continue;

                ctx.font = "10px sans-serif";
                ctx.fillStyle = "#000";
                ctx.fillText(tile.cost, x * tileSize + offsetX + 5, y * tileSize + offsetY + 15);

                if (tile.prev) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#222";
                    ctx.moveTo(x * tileSize + offsetX + 24, y * tileSize + offsetY + 24);
                    ctx.lineTo(tile.prev.x * tileSize + offsetX + 24, tile.prev.y * tileSize + offsetY + 24);
                    ctx.stroke();
                }
            }
        }
    };
}

function mapIsWalkable(map, x, y) {
    if (y < 0 || y >= map.length || x < 0 || x >= map[y].length)
        return false;

    return (map[y][x] >= 0);
}
// TODO(andre:2019-11-05): Considerar as unidades no calculo de movimento
function calculateDistanceMap(weigthMap, x, y, useCost = true) {
    if (!mapIsWalkable(weigthMap, x, y))
        return null;

    let closed = [];
    let distance = [];
    for (let y = 0; y < weigthMap.length; ++y) {
        closed[y] = [];
        distance[y] = [];
        for (let x = 0; x < weigthMap[y].length; ++x) {
            closed[y][x] = false;
            distance[y][x] = {cost: -1, prev: null};
        }
    }

    let open = [{x: x, y: y}];
    distance[y][x].cost = 0;

    while (open.length > 0) {
        open.sort();
        let curr = open.shift();
        let neighbors = [
            {x: curr.x + 1, y: curr.y    },
            {x: curr.x - 1, y: curr.y    },
            {x: curr.x    , y: curr.y + 1},
            {x: curr.x    , y: curr.y - 1},
        ];

        for (let i = 0; i < neighbors.length; ++i) {
            let newPos = neighbors[i];

            if (mapIsWalkable(weigthMap, newPos.x, newPos.y) && !closed[newPos.y][newPos.x]) {
                if (distance[newPos.y][newPos.x].cost < 0) {
                    open.push(newPos);
                }

                let oldDistance = distance[newPos.y][newPos.x].cost;
                let newDistance = distance[curr.y][curr.x].cost + weigthMap[newPos.y][newPos.x];
                if (!useCost) {
                    newDistance = distance[curr.y][curr.x].cost + 1;
                }

                if (oldDistance < 0 || oldDistance > newDistance) {
                    distance[newPos.y][newPos.x].cost = newDistance;
                    distance[newPos.y][newPos.x].prev = {x: curr.x, y: curr.y};
                }
            }
        }

        closed[curr.y][curr.x] = true;
    }

    return distance;
}
