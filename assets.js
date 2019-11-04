let loadingAssets = [];
let loadedAssets = [];

let assetsName = [];
assetsName['char'] = 'img/char.png';

function loadAsset(name) {
    let asset = new Image();
    asset.addEventListener('load', () => {
        loadedAssets[name] = asset;
    });
    asset.src = assetsName[name];
    loadingAssets[name] = true;
}

function drawImage(ctx, name, x, y, w, h) {
    // console.log(loadedAssets);
    if (loadedAssets[name]) {
        ctx.drawImage(loadedAssets[name], x, y, w, h);
    }
    else {
        if (!loadingAssets[name]) {
            loadAsset(name);
        }

        ctx.save();
        ctx.fillStyle = "#f0f";
        ctx.fillRect(x, y, 20, 20);
        ctx.restore();
    }
}
