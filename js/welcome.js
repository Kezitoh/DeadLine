let initialState = {
    preload: loadAssets,
    create: displayScreen
};

let mainTween;
let btninstructions;
/** @type {Phaser.Button} */
let btnEasy;
/** @type {Phaser.Button} */
let btnNormal;
/** @type {Phaser.Button} */
let btnHard;

let img5;
let playSoundBG = false;

let p;
let botonesGroup;

const DIFFICULTY = {
    Easy: "Easy",
    Normal: "Normal",
    Hard: "Hard"
};

let difficulty;
let clickSound;
let bgSound;

function loadAssets() {
    game.load.image('fondo', 'assets/UI/Fondodejuego.png');
    game.load.image('instructionsButton', 'assets/UI/instructionsButton.png');

    game.load.image('EasyButton', 'assets/UI/easyButton.png');
    game.load.image('NormalButton', 'assets/UI/normalButton.png');
    game.load.image('HardButton', 'assets/UI/hardButton.png');
    game.load.image('negro', 'assets/UI/ImagenNegraParaTransicion.jpg');

    game.load.spritesheet('pc', 'assets/sprites/survivor1_stand.png')

    loadSoundsWelcome();
}

function loadSoundsWelcome(){
    game.load.audio('click', 'assets/sounds/click1.ogg');
    game.load.audio('soundBg', 'assets/sounds/musicafondoinicio.mp3');
}

function displayScreen() {
    clickSound = game.add.audio('click');
    bgSound = game.add.audio('soundBg', 0.1, true);
    game.input.enabled = true;
    let img = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'fondo');
    img.anchor.setTo(0.5,0.5);

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

    enterAnimation();
    enterAnimationPlayer();
    if(!playSoundBG){
        bgSound.play();
        playSoundBG = true;
    }
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

    btnEasy.inputEnabled = true;
    btnNormal.inputEnabled = true;
    btnHard.inputEnabled = true;
    btninstructions.inputEnabled = true;
}

function oninstructionsButtonPressed() {
    btninstructions.inputEnabled = false;
    btnHard.inputEnabled = false;
    btnNormal.inputEnabled = false;
    btnEasy.inputEnabled = false;
    clickSound.play();
    playerTween = game.add.tween(p).to({
        angle:0
    }, 300, Phaser.Easing.Cubic.Out).to({
        x: game.canvas.width / 1.3
    }, 1000, Phaser.Easing.Cubic.Out).to({
        angle: 90
    }, 300, Phaser.Easing.Cubic.Out).to({
        y:game.canvas.height / 1.3 + 120
    }, 1000, Phaser.Easing.Cubic.Out);
    playerTween.onComplete.add(() => {exitAnimation(() => {game.state.start('instructions');});});
    playerTween.start();

}

function exitAnimation(a){

    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(20);
    img5.alpha = 0;

    mainTween = game.add.tween(img5).to({
        alpha: 1
    }, 1500, Phaser.Easing.Cubic.Out);
    mainTween.onComplete.add(a);
    mainTween.start();
}

function enterAnimation(){
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(20);
    img5.alpha = 1;

    mainTween = game.add.tween(img5).to({
        alpha: 0
    }, 1500, Phaser.Easing.Cubic.Out);

    mainTween.start();
}

function enterAnimationPlayer(){
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
    let soundTween;
    clickSound.play();
    playSoundBG = false;
    soundTween = game.add.tween(bgSound).to({
        volume: 0
    }, 3000, Phaser.Easing.Cubic.Out);
    soundTween.onComplete.add(() => {
        bgSound.stop();
        playSoundBG = false;});
    soundTween.start();
    if(difficulty == "Easy"){
        btnEasy.inputEnabled = false;
        btnHard.inputEnabled = false;
        btnNormal.inputEnabled = false;
        btninstructions.inputEnabled = false;
        playerTween = game.add.tween(p).to({
            angle:-180
        }, 300, Phaser.Easing.Cubic.Out).to({
            x: game.canvas.width / 2 - 380

        }, 1000, Phaser.Easing.Cubic.Out).to({
            angle: -90
        }, 300, Phaser.Easing.Cubic.Out).to({
            y:game.canvas.height / 3 + 120
        }, 1000, Phaser.Easing.Cubic.Out);
        playerTween.onComplete.add(() => {exitAnimation(() => {game.state.start('play');});});
        playerTween.start();
    }
    if(difficulty == "Normal"){
        btnNormal.inputEnabled = false;
        btnEasy.inputEnabled = false;
        btnHard.inputEnabled = false;
        btninstructions.inputEnabled = false;
        playerTween = game.add.tween(p).to({
            y:game.canvas.height / 3 + 120
        }, 1000, Phaser.Easing.Cubic.Out);
        playerTween.onComplete.add(() => {exitAnimation(() => {game.state.start('play');});});
        playerTween.start();
    }
    if(difficulty == "Hard"){
        btnHard.inputEnabled = false;
        btnNormal.inputEnabled = false;
        btnEasy.inputEnabled = false;
        btninstructions.inputEnabled = false;
        playerTween = game.add.tween(p).to({
            angle:0
        }, 300, Phaser.Easing.Cubic.Out).to({
            x: game.canvas.width / 2 + 380
        }, 1000, Phaser.Easing.Cubic.Out).to({
            angle: -90
        }, 300, Phaser.Easing.Cubic.Out).to({
            y:game.canvas.height / 3 + 120
        }, 1000, Phaser.Easing.Cubic.Out);
        playerTween.onComplete.add(() => {exitAnimation(() => {game.state.start('play');});});
        playerTween.start();
    }
}