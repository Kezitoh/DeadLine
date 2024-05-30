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
}

const SLIDE_TIME = 15000;

let slideTextStyle = {
    font: 'Titan One',
    fontSize: '25pt',
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
    slide1Text += 'AIM with the MOUSE and LEFT CLICK to SHOOT\n';
    slide1Text += 'SHOOT the enemies to gain points!\n \n \n \n \n \n \n In a simple way, to win you need the gems that the robots drop';

    let slide1TextBox = game.add.text(game.canvas.width / 2, game.canvas.height / 5, slide1Text, slideTextStyle);
    slide1TextBox.anchor.setTo(0.5, 0);
    slide1TextBox.setShadow(5,5);

    let forwardBtn = game.add.button(game.canvas.width/1.25, game.canvas.height/1.25, 'forwardBtn', () => {forwardBtnPress(slideNum)});

    let backBtn = game.add.button(game.canvas.width / 12.5, game.canvas.height / 1.25, 'homeBtn', () => {backBtnPress(slideNum)});
    backBtn.scale.setTo(1.5);

    let wasdImage = game.add.sprite(game.canvas.width / 6, game.canvas.height/2 , 'wasdImagen');
    wasdImage.anchor.set(0.5);
    wasdImage.scale.setTo(0.25);
    animacionEntrada();
}

function showSlide2(){
    showBaseScreen();
    slideNum = 2;
    timer = game.time.events.add(SLIDE_TIME, () => {backBtnPress(slideNum)}, this);

    let slide2Text = "You can buy weapons in the safe zone \nbut don't stay too comfortable there, \nsedentary lifestyle is Lethal ;3 \nYou can equip the weapons you buy by pressing the Q key \nand with the same key change it for another one.\n \n To win is simple. The only thing you have to do is kill everyone. \nDON'T worry about them, they no longer have life, \nwe make sure of them :)";
    let slide2TextBox = game.add.text(game.canvas.width / 2, game.canvas.height / 5, slide2Text, slideTextStyle);
    slide2TextBox.anchor.setTo(0.5,0);
    slide2TextBox.setShadow(5,5);


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
            animacionSalida(() => {game.state.start('welcome');});
            break;
    }
}

function backBtnPress(slideOrigin){
    game.time.events.remove(timer);
    switch(slideOrigin){
        case 1:
            animacionSalida(() => {game.state.start('welcome');});
            break;
        case 2:
            showSlide1();
            break;
    }
}