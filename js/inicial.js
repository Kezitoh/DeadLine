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

    let te = game.add.text(game.canvas.width / 2, game.canvas.height / 2, textTitleInitial, styleTitleInitial);
    te.anchor.setTo(0.5, 0.5);

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

    te.events.onInputOver.add(() => {
        te.fill = '#FF0000'; // Cambia el color a rojo cuando el ratón está encima
    });

    te.events.onInputOut.add(() => {
        te.fill = '#F9F9F9'; // Cambia el color de nuevo al original cuando el ratón sale
    });
}