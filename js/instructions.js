let instructionState = {
    preload: loadInstructionsAssets,
    create: showSlide1
};

function loadInstructionsAssets(){
    game.load.image('fondo', '/assets/kenney_top_down_shooter/Tilesheet/tilesheet_complete.png');
    game.load.image('homeBtn', 'assets/UI/cancelButton.png');
    game.load.image('forwardBtn', 'assets/UI/forwardButton.png');
    game.load.image('backBtn', 'assets/UI/backButton.png');
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
    let titleTextBox = game.add.text(game.world.width / 2, game.world.height / 20, titleText, titleStyle);
    titleTextBox.anchor.setTo(0.5, 0);
    titleTextBox.setShadow(5,5);


}


function showSlide1(){
    showBaseScreen();
    slideNum = 1;
     timer = game.time.events.add(SLIDE_TIME, () => {forwardBtnPress(slideNum)}, this);
    
    
    let slide1Text = 'Use WASD or ARROWS to move the player character.\n';
    slide1Text += 'AIM with the MOUSE and LEFT CLICK to SHOOT\n';
    slide1Text += 'SHOOT the enemies to gain points!';
    
    let slide1TextBox = game.add.text(game.world.width / 2, game.world.height / 5, slide1Text, slideTextStyle);
    slide1TextBox.anchor.setTo(0.5, 0);
    slide1TextBox.setShadow(5,5);

    let forwardBtn = game.add.button(game.world.width/1.25, game.world.height/1.25, 'forwardBtn', () => {forwardBtnPress(slideNum)});
    forwardBtn.scale.setTo(3);

    let backBtn = game.add.button(game.world.width / 12.5, game.world.height / 1.25, 'homeBtn', () => {backBtnPress(slideNum)});
    backBtn.scale.setTo(3);
}

function showSlide2(){
    showBaseScreen();
    slideNum = 2;
    timer = game.time.events.add(SLIDE_TIME, () => {backBtnPress(slideNum)}, this);

    let slide2Text = 'TEXT FOR THE SLIDE 2';
    let slide2TextBox = game.add.text(game.world.width / 2, game.world.height / 5, slide2Text, slideTextStyle);
    slide2TextBox.anchor.setTo(0.5,0);
    slide2TextBox.setShadow(5,5);


    let forwardBtn = game.add.button(game.world.width/1.25, game.world.height/1.25, 'forwardBtn', () => {forwardBtnPress(slideNum)});
    forwardBtn.scale.setTo(3);

    let backBtn = game.add.button(game.world.width / 12.5, game.world.height / 1.25, 'backBtn', () => {backBtnPress(slideNum)});
    backBtn.scale.setTo(3);
}


//game.world.removeAll();

function forwardBtnPress(slideOrigin){
    game.time.events.remove(timer);
    switch(slideOrigin){
        case 1:
            showSlide2();
            break;
        case 2:
            game.state.start('welcome');
            break;
    }
}

function backBtnPress(slideOrigin){
    game.time.events.remove(timer);
    switch(slideOrigin){
        case 1:
            game.state.start('welcome');
            break;
        case 2:
            showSlide1();
            break;
    }
}