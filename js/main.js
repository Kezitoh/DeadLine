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
window.onload = startGame;
WebFont.load(wfConfig);

function startGame() {
    game = new Phaser.Game(800,800, Phaser.CANVAS, 'gameScreen');
    // Welcome Screen
    game.state.add('welcome', initialState);
    // About Screen (instructions)
    //game.state.add('about', aboutState);
    //game.state.add('welcome', initialState);
    // Instructions Screen
    game.state.add('instructions', instructionState);
    // Config Screen
    //game.state.add('config', configState);
    // Play Screen
    //game.state.add('play', playState);
    game.state.start('welcome');
}