let initialState = {
    preload: loadAssets,
    create: displayScreen
};

let mainTween, downTween1, downTween2;
let btninstructions, btnConfig, btnPlay;
let btnEasy, btnNormal, btnHard;
let levelToPlay;

const DIFFICULTY = {
    Easy: "Easy",
    Normal: "Normal",
    Hard: "Hard"
};
let difficulty;

function loadAssets() {
    game.load.image('fondo', '../assets/UI/Fondodejuego.png');
    game.load.image('instructionsButton', 'assets/UI/instructionsButton.png');

    game.load.image('EasyButton', 'assets/UI/easyButton.png');
    game.load.image('NormalButton', 'assets/UI/normalButton.png');
    game.load.image('HardButton', 'assets/UI/hardButton.png');
}

function displayScreen() {
    levelToPlay = 1;
    game.input.enabled = true;
    let img = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'fondo');
    img.anchor.setTo(0.5,0.5);

    console.log("va a jugar o que perro ijueputamalparido");


    let textTitle = 'DeadLine';
    let byus = 'Steven Sánchez \nRuben Fernandez \nAlejandro Deben Duque';
    let styleTitle = {
        font: 'Titan One',
        fontSize: '80pt',
        fill: '#FFFFFF'
    };
    let styleTitle2 = {
        font: 'Titan One',
        fontSize: '20pt',
        fontWeight: 'italic',
        fill: '#FFFFFF'
    };
    let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textTitle, styleTitle);
    t.anchor.setTo(0.5,0.5);
    t.setShadow(5,5);

    let te = game.add.text(game.canvas.width / 7, game.canvas.height - 70, byus, styleTitle2);
    te.anchor.setTo(0.5,0.5);
    te.setShadow(5,5);

    btninstructions = game.add.button(game.canvas.width / 1.8, game.canvas.height / 1.4 + 120,'instructionsButton', oninstructionsButtonPressed);


    //botones de niveles
    btnEasy = game.add.button(game.canvas.width / 2 - 380, game.canvas.height / 3 + 120,'EasyButton', () => { onDifficultySet(DIFFICULTY.Easy); } );
    btnNormal = game.add.button(game.canvas.width / 2 , game.canvas.height / 3 + 120,'NormalButton',() => { onDifficultySet(DIFFICULTY.Normal); });
    btnHard = game.add.button(game.canvas.width / 2 + 380, game.canvas.height / 3 + 120,'HardButton',() => { onDifficultySet(DIFFICULTY.Hard); });

    btnEasy.anchor.setTo(0.5,0.5);
    btnNormal.anchor.setTo(0.5,0.5);
    btnHard.anchor.setTo(0.5,0.5);

    btninstructions.scale.setTo(1.5);
    btnEasy.scale.setTo(1.5);
    btnNormal.scale.setTo(1.5);
    btnHard.scale.setTo(1.5);

}

function oninstructionsButtonPressed() {
    game.state.start('instructions');
}





function onDifficultySet(d){
    difficulty = d;
    game.state.start('play');
}

