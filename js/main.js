/** @type {Phaser.Game} */
let game;

let wfConfig = {
    active: function () {
        startGame();
    },
    google: {
        families: ['Titan One']
    },
    custom: {}
};

WebFont.load(wfConfig);

function startGame() {
    game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'gameScreen');
    //game.canvas.backgroundColor = Phaser.Color.AQUA;

    game.state.add('screenFinal', finalState);

    game.state.add('instructions', instructionState);

    game.state.add('play', playState);

    game.state.add('welcome', initialState);

    game.state.start('play');
}