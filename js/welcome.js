let initialState = {
    preload: loadAssets,
    create: displayScreen
};

let mainTween, downTween1, downTween2;
let btninstructions, btnConfig, btnPlay;
let btnEasy, btnNormal, btnHard;
let levelToPlay;
let img5;

const DIFFICULTY = {
    Easy: "Easy",
    Normal: "Normal",
    Hard: "Hard"
};

const Salida = {
    Play: changeScreen(),
    Final: endGame(),
    Inicio: onFinalButtonPressed()
}
let difficulty;

function loadAssets() {
    game.load.image('fondo', '../assets/UI/Fondodejuego.png');
    game.load.image('instructionsButton', 'assets/UI/instructionsButton.png');

    game.load.image('EasyButton', 'assets/UI/easyButton.png');
    game.load.image('NormalButton', 'assets/UI/normalButton.png');
    game.load.image('HardButton', 'assets/UI/hardButton.png');
    game.load.image('negro', '../assets/UI/ImagenNegraParaTransicion.jpg');
}

function displayScreen() {

    levelToPlay = 1;
    game.input.enabled = true;
    let img = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'fondo');
    img.anchor.setTo(0.5,0.5);

    console.log("va a jugar o que perro ijueputamalparido");


    let textTitle = '\n  DeadLine  \n';
    let byus = 'Steven Sánchez  \nRuben Fernandez  \nAlejandro Deben Duque      \n ';
    let styleTitle = {
        font: 'Titan One',
        fontSize: '80pt',
        fill: '#F9F9F9'
    };
    let styleTitle2 = {
        font: 'Titan One',
        fontSize: '20pt',
        fontWeight: 'italic',
        fill: '#F9F9F9'
    };
    let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textTitle, styleTitle);
    t.anchor.setTo(0.5,0.5);
    t.setShadow(30,30,'#212121',15);

    let te = game.add.text(game.canvas.width / 7+50, game.canvas.height - 70, byus, styleTitle2);
    te.anchor.setTo(0.5,0.5);
    te.setShadow(7,7,'#212121',5);

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

    animacionEntrada();

}

function oninstructionsButtonPressed() {
    game.state.start('instructions');
}

function animacionEntrada(){
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(5);
    img5.alpha = 1;

    mainTween = game.add.tween(img5).to({
        alpha: 0
    },1500, Phaser.Easing.Cubic.Out);
    mainTween.start();
}

function onDifficultySet(d){

    difficulty = d;
    animacionSalida(Salida.Play);

}

function animacionSalida(a){
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(5);
    img5.alpha = 0;

    mainTween = game.add.tween(img5).to({
        alpha: 1
    },250, Phaser.Easing.Cubic.Out);
    mainTween.onComplete.add(a);
    mainTween.start();
}

function changeScreen(){
    game.state.start('play');
}
