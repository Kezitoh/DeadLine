let instructionState = {
    preload: loadInstructionsAssets,
    create: showSlide1
};

function loadInstructionsAssets(){
    game.load.image('fondo', 'assets/UI/Fondodejuego.png');
    game.load.image('homeBtn', 'assets/UI/cancelButton.png');
    game.load.image('forwardBtn', 'assets/UI/forwardButton.png');
    game.load.image('backBtn', 'assets/UI/backButton.png');
    game.load.image('wasdImagen', 'assets/UI/WASD.png');
    game.load.image('silencedPistolImage', 'assets/sprites/pistolaConSilenciador.png');
    game.load.image('pistolImage', 'assets/sprites/pistola.png');
    game.load.image('shotgunImage', 'assets/sprites/escopeta.png');
    game.load.image('assaultRifleImage', 'assets/sprites/AK.png');
}

const SLIDE_TIME = 15000;
const WEAPON_IMAGE_OFFSET = 275;

let slideTextStyle = {
    font: 'Titan One',
    fontSize: '30pt',
    fill: '#FFFFFF',
    align: 'center'
};
let timer;
let slideNum;

function showBaseScreen(){
    game.world.removeAll();
    game.add.image(0, 0, 'fondo');
    let titleText = 'HOW TO PLAY'
    let titleStyle = {
        font: 'Titan One',
        fontSize: '50pt',
        align: 'center',
        fill: '#FFFFFF'
    };
    let titleTextBox = game.add.text(game.canvas.width / 2, game.canvas.height / 20, titleText, titleStyle);
    titleTextBox.anchor.setTo(0.5, 0);
    titleTextBox.setShadow(5,5);


}


function showSlide1(){
    showBaseScreen();
    slideNum = 1;
     timer = game.time.events.add(SLIDE_TIME, () => {forwardBtnPress(slideNum)}, this);

    let slide1Text = 'Use WASD or ARROWS to move the player character.\n';
    slide1Text += 'AIM with the MOUSE and LEFT CLICK to SHOOT.\n';
    slide1Text += 'SHOOT the enemies to gain points!';

    let slide1TextBox = game.add.text(game.canvas.width / 2, game.canvas.height / 5, slide1Text, slideTextStyle);
    slide1TextBox.anchor.setTo(0.5, 0);
    slide1TextBox.setShadow(5,5);

    let forwardBtn = game.add.button(game.canvas.width/1.25, game.canvas.height/1.25, 'forwardBtn', () => {forwardBtnPress(slideNum)});

    let backBtn = game.add.button(game.canvas.width / 12.5, game.canvas.height / 1.25, 'homeBtn', () => {backBtnPress(slideNum)});
    backBtn.scale.setTo(1.5);

    let wasdImage = game.add.sprite(game.canvas.width / 2, game.canvas.height/1.75 , 'wasdImagen');
    wasdImage.anchor.set(0.5);
    wasdImage.scale.setTo(0.5);
    enterAnimation();
}

function showSlide2(){
    showBaseScreen();
    slideNum = 2;
    timer = game.time.events.add(SLIDE_TIME, () => {forwardBtnPress(slideNum)}, this);

    let slide2Text = "Enemies drop coins and gems." + 
                     "\nCoins can be used to buy weapons \nand upgrades in the Safe Zone!" + 
                     "\nYou can swap between weapons \nwith the SHIFT/Control keys." + 
                     "\nEach weapon has different damage, \nammo and fire rates.";

    let slide2TextBox = game.add.text(game.canvas.width / 2, game.canvas.height / 5.5, slide2Text, slideTextStyle);
    slide2TextBox.anchor.setTo(0.5,0);
    slide2TextBox.setShadow(5,5);

    let silencedPistolImage = game.add.sprite(game.canvas.width / 40, game.canvas.height/1.7, 'silencedPistolImage');
    silencedPistolImage.scale.setTo(0.45);
    let pistolImage = game.add.sprite(game.canvas.width / 40 + WEAPON_IMAGE_OFFSET, game.canvas.height/1.7, 'pistolImage');
    pistolImage.scale.setTo(0.45);
    let shotgunImage = game.add.sprite(game.canvas.width / 40 + WEAPON_IMAGE_OFFSET*1.9, game.canvas.height/1.7, 'shotgunImage');
    shotgunImage.scale.setTo(0.45);
    let assaultRifleImage = game.add.sprite(game.canvas.width / 40 + WEAPON_IMAGE_OFFSET*3, game.canvas.height/1.7, 'assaultRifleImage');
    assaultRifleImage.scale.setTo(0.45);



    let forwardBtn = game.add.button(game.canvas.width/1.25, game.canvas.height/1.25, 'forwardBtn', () => {forwardBtnPress(slideNum)});
    let backBtn = game.add.button(game.canvas.width / 12.5, game.canvas.height / 1.25, 'backBtn', () => {backBtnPress(slideNum)});
    
}

function showSlide3() {
    showBaseScreen();
    slideNum = 3;
    timer = game.time.events.add(SLIDE_TIME, () => {forwardBtnPress(slideNum)}, this);

    let slide3Text = "When you have enough points, \nthe barrier dividing the game world will dissapear." +
                     "\nOnce it is gone, the robots will start spawning" +
                     "\nDefeat robots to have a guaranteed gem drop!" +
                     "\n\n You will win the game when you get enough gems!";

    let slide3TextBox = game.add.text(game.canvas.width / 2, game.canvas.height / 5, slide3Text, slideTextStyle);
    slide3TextBox.anchor.setTo(0.5,0);
    slide3TextBox.setShadow(5,5);

    let forwardBtn = game.add.button(game.canvas.width/1.25, game.canvas.height/1.25, 'forwardBtn', () => {forwardBtnPress(slideNum)});
    let backBtn = game.add.button(game.canvas.width / 12.5, game.canvas.height / 1.25, 'backBtn', () => {backBtnPress(slideNum)});
}

function forwardBtnPress(slideOrigin){
    game.time.events.remove(timer);
    switch(slideOrigin){
        case 1:
            showSlide2();
            break;
        case 2:
            showSlide3();
            break;
        case 3:
            exitAnimation(() => {game.state.start('welcome');});
            break;
    }
}

function backBtnPress(slideOrigin){
    game.time.events.remove(timer);
    switch(slideOrigin){
        case 1:
            exitAnimation(() => {game.state.start('welcome');});
            break;
        case 2:
            showSlide1();
            break;
        case 3:
            showSlide2();
            break;
    }
}