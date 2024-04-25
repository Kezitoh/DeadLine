let initialState = {
    preload: loadAssets,
    create: displayScreen
};

let mainTween, downTween1, downTween2;
let btnAbout, btnConfig, btnPlay;
let levelToPlay;

function loadAssets() {
    game.load.image('fondo', '../assets/Nuevos/fondo_espadas.jpeg');
    game.load.image('aboutButton', '../assets/Nuevos/about.jpeg');
    game.load.image('configButton', '../assets/Nuevos/configuracionboton.png');
    game.load.image('playButton', '../assets/Nuevos/playboton.png');
}

function displayScreen() {
    levelToPlay = 1;
    game.input.enabled = true;
    let img = game.add.image(0, 0, 'fondo');
    img.scale.setTo(2);
    console.log("va a jugar o que perro ijueputamalparido");


    let textTitle = 'DeadLine';
    let styleTitle = {
        font: 'The Constallation',
        fontSize: '80pt',
        fontWeight: 'bold',
        fill: '#b60404'
    };
    game.add.text(50, game.world.height / 6, textTitle, styleTitle);

    btnAbout = game.add.button(game.world.width / 1.75, game.world.height / 3 + 240,
        'aboutButton', onAboutButtonPressed);
    btnAbout.scale.setTo(0.5);
    btnConfig = game.add.button(game.world.width / 1.75, game.world.height / 3 + 120,
        'configButton', onConfigButtonPressed);
    btnPlay = game.add.button(game.world.width / 1.75, game.world.height / 3,
        'playButton', onPlayButtonPressed);

}

function onAboutButtonPressed() {
    // Your Turn 2 - Add the instruction to start the 'about' state
    game.state.start('about');
}

function onConfigButtonPressed() {
    // Your Turn 2 - Add the instruction to start the 'config' state
    game.state.start('config');
}

function onPlayButtonPressed() {
    // Your Turn 2 - Add the instruction to start the 'play' state
    game.state.start('play');
}