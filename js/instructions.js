let instructionState = {
    preload: loadInstructionsAssets,
    create: showSlide1
};

function loadInstructionsAssets(){
    game.load.image('fondo', './assets/kenney_top_down_shooter/Tilesheet/tilesheet_complete.png');
    game.load.image('backBtn', './assets/Nuevos/about.jpeg');
}


let slideTextStyle = {
    font: 'Titan One',
    fontSize: '25pt',
    fill: 'FFFFFF',
    align: 'center'
}

function showBaseScreen(){
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
    btnBack = game.add.button(game.world.width/3, game.world.height/2, 'backBtn', onBackButtonPressed);


}


function showSlide1(){
    showBaseScreen();

    let slide1Text = 'Use WASD or ARROWS to move the player character.\n';
    slide1Text += 'AIM with the MOUSE and LEFT CLICK to SHOOT\n';
    slide1Text += 'SHOOT the enemies to gain points!';
    
    let slide1TextBox = game.add.text(game.world.width / 2, game.world.height / 5, slide1Text, slideTextStyle);
    slide1TextBox.anchor.setTo(0.5, 0);

    let forwardBtn = game.add.button(game.world.width/1.25, game.world.height/1.25, 'backBtn', forwardBtnPress);
    
}

function showSlide2(){
    showBaseScreen();

    let slide2Text = 'A=IGBIUAEBGOIWNEGOIWHEOKFWOEIOWENENIGWIJGOWINGOWIEGOEGOWERGOWEIGJOWGIJWOEIGWOEIGHOWEGH';
    let slide2TextBox = game.add.text(game.world.width / 2, game.world.height / 5, slide2Text, slideTextStyle)

}



game.world.removeAll();

function onBackButtonPressed(){
    game.state.start('welcome');
}

function forwardBtnPress(slideOrigin){
    switch(slideOrigin){
        case 1:
            showSlide2();
            break;
    }
}

function backBtnPress(slideOrigin){
    switch(slideOrigin){
        case 2:
            showSlide1();
            break;
    }
}