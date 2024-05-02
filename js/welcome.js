let initialState = {
    preload: loadAssets,
    create: displayScreen
};

let mainTween, downTween1, downTween2;
let btnAbout, btnConfig, btnPlay;
let levelToPlay;

function loadAssets() {
    game.load.image('fondo', '../assets/kenney_top_down_shooter/Tilesheet/tilesheet_complete.png');
}

function displayScreen() {
    levelToPlay = 1;
    game.input.enabled = true;
    game.add.image(0, 0, 'fondo');
    console.log("va a jugar o que perro ijueputamalparido");


    let textTitle = 'DeadLine';
    let styleTitle = {
        //font: 'Rammetto One',
        font: 'The Constallation',
        fontSize: '22pt',
        fontWeight: 'bold',
        fill: '#b60404'
    };
    game.add.text(game.world.width / 2, game.world.height / 6, textTitle, styleTitle);

}