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

    game.state.add('screenfinal', finalState);

    game.state.add('instructions', instructionState);

    game.state.add('play', playState);

    game.state.add('welcome', initialState);

    game.state.start('welcome');
}