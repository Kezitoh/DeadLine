let nameInital = {
    preload: trushInitialAssets,
    create: trushInitial
};

let btnIntoGame;
let imgtrustInitial;

function trushInitialAssets() {
    game.load.image('negroinicial', 'assets/UI/ImagenNegraParaTransicion.jpg');

}

function trushInitial() {
    game.input.enabled = true;
    imgtrustInitial = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negroinicial');
    imgtrustInitial.anchor.setTo(0.5, 0.5);
    imgtrustInitial.scale.setTo(20);

    let textTitleInitial = ' DeadLine ';
    let styleTitleInitial = {
        font: '90pt Titan One',
        fill: '#F9F9F9'
    };
    let textTitleInitial2 = ' (Click on the game screen to continue...) ';
    let styleTitleInitial2 = {
        font: '15pt Titan One',
        fill: '#F9F9F9'
    };


    let te = game.add.text(game.canvas.width / 2, game.canvas.height / 2, textTitleInitial, styleTitleInitial);
    te.anchor.setTo(0.5, 0.5);


    let tex = game.add.text(game.canvas.width / 2, te.bottom + 5, textTitleInitial2, styleTitleInitial2);
    tex.anchor.setTo(0.5, 0.5);
    let botonesTween2 = game.add.tween(tex).to({
        alpha: 0
    }, 1000, Phaser.Easing.Cubic.InOut).to({
        alpha: 1
    }, 1000, Phaser.Easing.Cubic.InOut);
    botonesTween2.loop(true);
    botonesTween2.start();

    te.inputEnabled = true;

    // Cambiar el cursor cuando se pasa sobre el texto
    te.input.useHandCursor = true;
    let botonesTween = game.add.tween(te).to({
        alpha: 0
    }, 1000, Phaser.Easing.Cubic.Out);
    botonesTween.onComplete.add(() => { game.state.start('welcome');})


    // Agregar evento de clic
    te.events.onInputDown.add(() => {
        botonesTween.start();
    });

    let eventInitial = () => {
        game.canvas.removeEventListener('pointerdown', eventInitial); //hostia puta joder tio no me lo puedo creer
        botonesTween.start();
     }

    game.canvas.addEventListener('pointerdown',  eventInitial);

    te.events.onInputOver.add(() => {
        te.fill = '#00FF13'; // Cambia el color a rojo cuando el ratón está encima, fui obligado
    });

    te.events.onInputOut.add(() => {
        te.fill = '#F9F9F9'; // Cambia el color de nuevo al original cuando el ratón sale
    });


}