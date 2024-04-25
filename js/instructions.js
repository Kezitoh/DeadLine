let instructionState = {
    //preload: loadInstructionsAssets,
    create: showInstructions
};

//function loadInstructionsAssets(){}

function showInstructions(){
    //game.add.image(0, 0, 'fondo');

    let titleText = 'HOW TO PLAY'
    let titleStyle = {
        font: 'Titan One',
        fontsize: '30pt',
        fontWeight: 'bold',
        textAlign: 'center',
    };
    game.add.text(80,80, titleText, titleStyle);
}
