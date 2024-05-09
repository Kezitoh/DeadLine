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
    game.load.image('fondo', '../assets/Nuevos/fondo_espadas.jpeg');
    game.load.image('instructionsButton', '../assets/Nuevos/about.jpeg');

    game.load.image('EasyButton', '../assets/Nuevos/about.jpeg');
    game.load.image('NormalButton', '../assets/Nuevos/configuracionboton.png');
    game.load.image('HardButton', '../assets/Nuevos/playboton.png');
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
        font: 'The Constallation',
        fontSize: '80pt',
        fontWeight: 'bold',
        fill: '#b60404'
    };
    let styleTitle2 = {
        font: 'The Constallation',
        fontSize: '20pt',
        fontWeight: 'bold',
        fill: '#b60404'
    };
    let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textTitle, styleTitle);
    t.anchor.setTo(0.5,0.5);

    let te = game.add.text(game.canvas.width / 4, game.canvas.height - 70, byus, styleTitle2);
    te.anchor.setTo(0.5,0.5);

    btninstructions = game.add.button(game.canvas.width / 1.75, game.canvas.height / 3 + 240,
        'instructionsButton', oninstructionsButtonPressed);
    btninstructions.scale.setTo(0.5);


    //botones de niveles
    btnEasy = game.add.button(game.canvas.width / 6, game.canvas.height / 3 + 240,'EasyButton', () => { onDifficultySet(DIFFICULTY.Easy); } );
    btnEasy.scale.setTo(0.5);
    btnNormal = game.add.button(game.canvas.width / 6, game.canvas.height / 3 + 120,'NormalButton',() => { onDifficultySet(DIFFICULTY.Normal); });
    btnHard = game.add.button(game.canvas.width / 6, game.canvas.height / 3,'HardButton',() => { onDifficultySet(DIFFICULTY.Hard); });

}

function oninstructionsButtonPressed() {
    game.state.start('instructions');
}





function onDifficultySet(d){
    difficulty = d;
    game.state.start('play');
}

