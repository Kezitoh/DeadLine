let finalState = {
    preload: loadFinalAssets,
    create: createLevelFinal
};


function loadFinalAssets() {
    loadFinalImages();
}

let winOrLose = false;
let totalItems = 0;
/** @type {Phaser.Button} */
let btnInicio;

let clickSoundFinal;
let sonidoFinal;


function loadFinalImages() {
    game.load.image('bgGamef', 'assets/UI/Fondodejuego.png');
    game.load.image('btnInicioA', 'assets/UI/4x/btnInicioConLetras.png');
    game.load.image('negro', 'assets/UI/ImagenNegraParaTransicion.jpg');

    //sonido
    game.load.audio('click', 'assets/sounds/click1.ogg');
    game.load.audio('soundWin', 'assets/sounds/winSOund.mp3');
    game.load.audio('soundLose', 'assets/sounds/perdedorsonido.mp3');
}

function createLevelFinal() {
    clickSoundFinal = game.add.audio('click');

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
    sonidoFinal = (winOrLose ? game.add.audio('soundWin', 0.3) : game.add.audio('soundLose', 0.3));
    sonidoFinal.play();
    if(winOrLose){//aqui va si gana
        textfinal = "Victoria" ;

        let scoretext3 = "Vida restante: \n ";
        let vidaRestantetexto = " " + healthValue;
        let puntuacionTexto3 = game.add.text(game.canvas.width / 10, game.canvas.height / 3 + 240, scoretext3, stylesub);

        game.add.text(game.canvas.width / 1.5, game.canvas.height / 3 + 240, vidaRestantetexto, stylesub)

        textoFinalBoton();

    } else {//aqui va si pierde
        textfinal = "Derrota";
        textoFinalBoton();
    }
    function textoFinalBoton(){
        let t = game.add.text(game.canvas.width / 2, game.canvas.height / 6, textfinal, styleTitle);
        t.anchor.setTo(0.5,0.5);
        t.setShadow(5,5);

        scoretext = "Tu puntuacion es: ";
        let ptexto = " " + score;
        let puntuacionTexto = game.add.text(game.canvas.width / 10, game.canvas.height / 3, scoretext, stylesub);
        game.add.text(game.canvas.width / 1.5, game.canvas.height / 3, ptexto, stylesub);

        scoretext2 = "Objetos Recogidos: ";
        let otexto = " " + totalItems;
        let puntuacionTexto2 = game.add.text(game.canvas.width / 10, game.canvas.height / 3 + 120, scoretext2, stylesub);
        game.add.text(game.canvas.width / 1.5, game.canvas.height / 3 + 120, otexto, stylesub);

        btnInicio = game.add.button(game.canvas.width / 2, game.canvas.height / 1.25,'btnInicioA',() => {
            let localTween;
            localTween = game.add.tween(sonidoFinal).to({
                volume: 0
            }, 1000, Phaser.Easing.Cubic.Out);
            localTween.onComplete.add(() => {
                sonidoFinal.stop();});
                exitAnimation(() => {game.state.start('welcome');});
            localTween.start();
            clickSoundFinal.play();
            btnInicio.inputEnabled = false;
        });

        btnInicio.inputEnabled = true;
        btnInicio.scale.setTo(0.4);
        btnInicio.anchor.setTo(0.5,0.5);
    }

    enterAnimation();
}
