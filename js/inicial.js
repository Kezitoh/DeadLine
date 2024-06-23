let initialFirstState = {
    preload: loadAssetsInitial,
    create: displayScreenInitial
};

let mainTween;
let btnIntoGame;
let imgtrustInitial;

function loadAssetsInitial() {
    game.load.image('negroinicial', 'assets/UI/ImagenNegraParaTransicion.jpg');

}

function displayScreenInitial() {
    game.input.enabled = true;
    imgtrustInitial = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negroinicial');
    imgtrustInitial.anchor.setTo(0.5, 0.5);
    imgtrustInitial.scale.setTo(20);

    let textTitle = '\n  DeadLine  \n';
    let styleTitle = {
        font: '80pt Titan One',
        fill: '#F9F9F9'
    };

    let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textTitle, styleTitle);
    t.anchor.setTo(0.5, 0.5);
    t.setShadow(30, 30, '#212121', 15);

    // Descomentar el código para el botón y asegurar que la imagen del botón se haya cargado
    //btnIntoGame = game.add.button(game.canvas.width / 2 - 380, game.canvas.height / 3 + 120, 'EasyButton', () => { onDifficultySet(DIFFICULTY.Easy); });

    //btnIntoGame.anchor.setTo(0.5, 0.5);
    //btnIntoGame.scale.setTo(1.5);
}