let loadingAssets = [];
let loadedAssets = [];

let assetsName = [];
assetsName['char'] = 'img/char.png';
assetsName['char_red'] = 'img/char_red.png';
assetsName['archer_red'] = 'img/archer_red.png';
assetsName['char_blue'] = 'img/char_blue.png';
assetsName['archer_blue'] = 'img/archer_blue.png';

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
