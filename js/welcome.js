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
    game.load.image('fondo', 'assets/Nuevos/fondo_espadas.jpeg');
    game.load.image('instructionsButton', 'assets/UI/instructionsButton.png');

    game.load.image('EasyButton', 'assets/UI/easyButton.png');
    game.load.image('NormalButton', 'assets/UI/normalButton.png');
    game.load.image('HardButton', 'assets/UI/hardButton.png');
}

function displayScreen() {
    levelToPlay = 1;
    game.input.enabled = true;
    let img = game.add.image(0, 0, 'fondo');
    img.scale.setTo(2);
    console.log("va a jugar o que perro ijueputamalparido");


    let textTitle = 'DeadLine';
    let byus = 'Steven Sánchez \nRuben Fernandez \nAlejandro Deben Duque';
    let styleTitle = {
        font: 'Titan One',
        fontSize: '80pt',
        fill: '#b60404'
    };
    let styleTitle2 = {
        font: 'Titan One',
        fontSize: '20pt',
        fontWeight: 'italic',
        fill: '#b60404'
    };
    let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textTitle, styleTitle);
    t.anchor.setTo(0.5,0.5);

    let te = game.add.text(game.world.width / 7, game.world.height - 70, byus, styleTitle2);
    te.anchor.setTo(0.5,0.5);

    btninstructions = game.add.button(game.world.width / 1.3, game.world.height / 3 + 120,'instructionsButton', oninstructionsButtonPressed);


    //botones de niveles
    btnEasy = game.add.button(game.world.width / 10, game.world.height / 3 + 240,'EasyButton', () => { onDifficultySet(DIFFICULTY.Easy); } );
    btnNormal = game.add.button(game.world.width / 10, game.world.height / 3 + 120,'NormalButton',() => { onDifficultySet(DIFFICULTY.Normal); });
    btnHard = game.add.button(game.world.width / 10, game.world.height / 3,'HardButton',() => { onDifficultySet(DIFFICULTY.Hard); });

}

function oninstructionsButtonPressed() {
    game.state.start('instructions');
}





function onDifficultySet(d){
    difficulty = d;
    game.state.start('play');
}

