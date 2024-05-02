let playState = {
    preload: loadPlayAssets,
    create: disHardScreenPlay
};




function loadPlayAssets() {
    game.load.image('fondo', '../assets/Nuevos/fondo_espadas.jpeg');
}

function disHardScreenPlay() {
    levelToHard = 1;
    game.input.enabled = true;
    let img = game.add.image(0, 0, 'fondo');
    img.scale.setTo(2);

}

