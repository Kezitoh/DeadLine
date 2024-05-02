let instructionState = {
    preload: loadInstructionsAssets,
    create: showInstructions
};

function loadInstructionsAssets(){
    game.load.image('fondo', './assets/kenney_top_down_shooter/Tilesheet/tilesheet_complete.png');
    game.load.image('btnWelcome', './assets/Nuevos/about.jpeg')
}

function showInstructions(){
    game.add.image(0, 0, 'fondo');

    let titleText = 'HOW TO PLAY'
    let titleStyle = {
        font: 'Titan One',
        fontSize: '40pt',
        align: 'center',
        fill: '#FFFFFF'
    };

    let instructionsText = 'Use WASD or ARROWS to move the player character.\n';
    instructionsText += 'AIM with the MOUSE and LEFT CLICK to SHOOT\n';
    instructionsText += 'SHOOT the enemies to gain points!';
    let instructionsStyle = {
        font: 'Titan One',
        fontSize: '20pt',
        fill: 'FFFFFF',
        align: 'center'
    }
    let t = game.add.text(game.world.width / 2, game.world.height / 15, instructionsText, instructionsStyle);
    t.x -= t.width / 2;
    game.add.text(game.world.width / 2, game.world.height / 20, titleText, titleStyle);



}
