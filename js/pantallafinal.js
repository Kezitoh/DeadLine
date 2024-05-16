let finalState = {
    preload: loadFinalAssets,
    create: createLevelFinal
};


function loadFinalAssets() {
    loadImages();
}

let winOrLose;
let score

function loadImages() {
    game.load.image('heart', '../assets/UI/heart.png');
    game.load.image('healthBar', '../assets/UI/health_bar.png');
    game.load.image('healthHolder', '../assets/UI/health_holder.png');
    game.load.image('bgGame', '../assets/UI/Fondodejuego.png');
}

function createLevelFinal() {
    game.world.setBounds(0, 0, game.canvas.width*2, game.canvas.height*2);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    wasd = game.input.keyboard.addKeys({w: Phaser.KeyCode.W, a: Phaser.KeyCode.A, s: Phaser.KeyCode.S, d: Phaser.KeyCode.D});

    setDifficulty(difficulty);

    remainingTime = DEFAULT_TIME;


    // Background
    let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGame');
    // Smooth scrolling of the background in both X and Y axis
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;

    // Camera follows the player inside the world
    game.camera.follow(player);


    // Update elapsed time each second
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);

    player = game.add.sprite(game.world.width/2, game.world.height/2, 'pc');
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);

    game.add.sprite(game.world.width/2,game.world.height/2,"heart");
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
}