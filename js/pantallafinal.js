let finalState = {
    preload: loadFinalAssets,
    create: createLevelFinal
};


function loadFinalAssets() {
    loadFinalImages();
}

let winOrLose = false;
let objetos = 0;
let btnInicio;


function loadFinalImages() {
    game.load.image('bgGamef', '../assets/UI/Fondodejuego.png');
    game.load.image('btnInicioA', '../assets/UI/4x/btnInicioConLetras.png');
}

function createLevelFinal() {
    let styleTitle = {
        font: 'Titan One',
        fontSize: '80pt',
        fill: '#FFFFFF'
    };
    let stylesub = {
        font: 'Titan One',
        fontSize: '40pt',
        fill: '#FFFFFF'
    };
    // Background
    let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGamef');
    let textfinal;
    let scoretext;
    let scoretext2;
    if(winOrLose){//aqui va si gana
        textfinal = "Victoria" ;

        let scoretext3 = "Hasta toda esta vida te sobro: \n " + healthBar;
        let puntuacionTexto3 = game.add.text(game.canvas.width / 2, game.canvas.height / 3 + 240, scoretext3, stylesub);
        puntuacionTexto3.anchor.setTo(0.5,0.5);

        textoFinalBoton();

    } else {//aqui va si pierde
        textfinal = "Derrota";
        textoFinalBoton();
    }

    function onFinalButtonPressed() {
        game.state.start('welcome');
    }

    function textoFinalBoton(){
        let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textfinal, styleTitle);
        t.anchor.setTo(0.5,0.5);
        t.setShadow(5,5);

        scoretext = "Tu puntuacion es: " + score;
        let puntuacionTexto = game.add.text(game.canvas.width / 2, game.canvas.height / 3, scoretext, stylesub);
        puntuacionTexto.anchor.setTo(0.5,0.5);

        scoretext2 = "Recogiste " + objetos + " objetos.";
        let puntuacionTexto2 = game.add.text(game.canvas.width / 2, game.canvas.height / 3 + 120, scoretext2, stylesub);
        puntuacionTexto2.anchor.setTo(0.5,0.5);

        btnInicio = game.add.button(game.canvas.width / 2, game.canvas.height / 1.25,'btnInicioA',onFinalButtonPressed);
        btnInicio.scale.setTo(0.4);
        btnInicio.anchor.setTo(0.5,0.5);
    }



}