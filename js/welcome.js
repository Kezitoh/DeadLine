let initialState = {
    preload: loadAssets,
    create: displayScreen
};

let mainTween;
let btninstructions, btnConfig, btnPlay;
let btnEasy, btnNormal, btnHard;
let levelToPlay;
let img5;

let p;
let botonesGroup;

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
    game.load.image('negro', '../assets/UI/ImagenNegraParaTransicion.jpg');

    game.load.spritesheet('pc', '../assets/sprites/survivor1_stand.png')
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

    btninstructions = game.add.button(game.canvas.width / 1.3, game.canvas.height / 1.3 + 120,'instructionsButton');


    //botones de niveles
    btnEasy = game.add.button(game.canvas.width / 2 - 380, game.canvas.height / 3 + 120,'EasyButton');
    btnNormal = game.add.button(game.canvas.width / 2 , game.canvas.height / 3 + 120,'NormalButton');
    btnHard = game.add.button(game.canvas.width / 2 + 380, game.canvas.height / 3 + 120,'HardButton');

    btnEasy.anchor.setTo(0.5,0.5);
    btnNormal.anchor.setTo(0.5,0.5);
    btnHard.anchor.setTo(0.5,0.5);
    btninstructions.anchor.setTo(0.5,0.5);

    btninstructions.scale.setTo(1.5);
    btnEasy.scale.setTo(1.5);
    btnNormal.scale.setTo(1.5);
    btnHard.scale.setTo(1.5);
    botonesGroup = game.add.group();
    botonesGroup.add(btninstructions);
    botonesGroup.add(btnEasy);
    botonesGroup.add(btnNormal);
    botonesGroup.add(btnHard);

    botonesGroup.alpha = 0;

    let botonesTween = game.add.tween(botonesGroup).to({
        alpha: 1
    }, 1850, Phaser.Easing.Cubic.Out);
    botonesTween.delay(1500);
    botonesTween.start();

    animacionEntrada();
    animacionEntradaPlayer();

}

function botonesInicio(){
    btninstructions = game.add.button(game.canvas.width / 1.3, game.canvas.height / 1.3 + 120,'instructionsButton', oninstructionsButtonPressed);


    //botones de niveles
    btnEasy = game.add.button(game.canvas.width / 2 - 380, game.canvas.height / 3 + 120,'EasyButton', () => { onDifficultySet(DIFFICULTY.Easy); } );
    btnNormal = game.add.button(game.canvas.width / 2 , game.canvas.height / 3 + 120,'NormalButton',() => { onDifficultySet(DIFFICULTY.Normal); });
    btnHard = game.add.button(game.canvas.width / 2 + 380, game.canvas.height / 3 + 120,'HardButton',() => { onDifficultySet(DIFFICULTY.Hard); });

    btnEasy.anchor.setTo(0.5,0.5);
    btnNormal.anchor.setTo(0.5,0.5);
    btnHard.anchor.setTo(0.5,0.5);
    btninstructions.anchor.setTo(0.5,0.5);

    btninstructions.scale.setTo(1.5);
    btnEasy.scale.setTo(1.5);
    btnNormal.scale.setTo(1.5);
    btnHard.scale.setTo(1.5);
}

function oninstructionsButtonPressed() {
    playerTween = game.add.tween(p).to({
        angle:0
    }, 300, Phaser.Easing.Cubic.Out).to({
        x: game.canvas.width / 1.3
    }, 1000, Phaser.Easing.Cubic.Out).to({
        angle: 90
    }, 300, Phaser.Easing.Cubic.Out).to({
        y:game.canvas.height / 1.3 + 120
    }, 1000, Phaser.Easing.Cubic.Out);
    playerTween.onComplete.add(() => {animacionSalida(() => {game.state.start('instructions');});});
    playerTween.start();

}

function animacionSalida(a){

    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(5);
    img5.alpha = 0;

    mainTween = game.add.tween(img5).to({
        alpha: 1
    }, 1500, Phaser.Easing.Cubic.Out);
    mainTween.onComplete.add(a);
    mainTween.start();
}

function animacionEntrada(){
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(5);
    img5.alpha = 1;

    mainTween = game.add.tween(img5).to({
        alpha: 0
    }, 1500, Phaser.Easing.Cubic.Out);

    mainTween.start();
}

function animacionEntradaPlayer(){
    p = game.add.sprite(-20, game.canvas.height/1.35, 'pc');
    p.anchor.setTo(0.5,0.5);

    let playerTween = game.add.tween(p).to({
        x: game.canvas.width/2,
        angle:0
    }, 1500, Phaser.Easing.Cubic.Out).to({
        angle: -90
    }, 350, Phaser.Easing.Cubic.Out);
    playerTween.delay(1500);
    playerTween.onComplete.add(botonesInicio);

    playerTween.start();
}

function onDifficultySet(d){
    difficulty = d;
    let playerTween;
    if(difficulty == "Easy"){
        playerTween = game.add.tween(p).to({
            angle:-180
        }, 300, Phaser.Easing.Cubic.Out).to({
            x: game.canvas.width / 2 - 380

        }, 1000, Phaser.Easing.Cubic.Out).to({
            angle: -90
        }, 300, Phaser.Easing.Cubic.Out).to({
            y:game.canvas.height / 3 + 120
        }, 1000, Phaser.Easing.Cubic.Out);
        playerTween.onComplete.add(() => {animacionSalida(() => {game.state.start('play');});});
        playerTween.start();
    }
    if(difficulty == "Normal"){
        playerTween = game.add.tween(p).to({
            y:game.canvas.height / 3 + 120
        }, 1000, Phaser.Easing.Cubic.Out);
        playerTween.onComplete.add(() => {animacionSalida(() => {game.state.start('play');});});
        playerTween.start();
    }
    if(difficulty == "Hard"){
        playerTween = game.add.tween(p).to({
            angle:0
        }, 300, Phaser.Easing.Cubic.Out).to({
            x: game.canvas.width / 2 + 380
        }, 1000, Phaser.Easing.Cubic.Out).to({
            angle: -90
        }, 300, Phaser.Easing.Cubic.Out).to({
            y:game.canvas.height / 3 + 120
        }, 1000, Phaser.Easing.Cubic.Out);
        playerTween.onComplete.add(() => {animacionSalida(() => {game.state.start('play');});});
        playerTween.start();
    }
}