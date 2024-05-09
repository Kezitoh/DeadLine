const WORLD_WIDTH = 1100;
const WORLD_HEIGHT = 825;
const PLAYER_VELOCITY = 150;

let playState = {
    preload: loadPlayAssets,
    create: createLevel
};




function loadPlayAssets() {
    game.load.spritesheet('collector', 'assets/Nuevos/configuracionboton.png', 32, 48);

    game.load.image('bgGame', 'assets/Nuevos/fondo_espadas.jpeg');
}



function createLevel() {
    exitingLevel = false;
    // Set World bounds (same size as the image background in this case)
    game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Background
    let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGame');
    // Smooth scrolling of the background in both X and Y axis
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;

    // Collide with this image to exit level
    exit = game.add.sprite(game.world.width - 100, game.world.height - 64, 'exit');
    exit.anchor.setTo(0, 1);
    exit.body.setSize(88, 58, 20, 33);

    // Now, set time and create the HUD
    //remainingTime = secondsToGo;
    //createHUD();

    // Create player. Initial position according to JSON data
    player = game.add.sprite(game.world.width/2, game.world.height/2, 'collector');
    player.anchor.setTo(0.5, 0.5);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;

    // Camera follows the player inside the world
    game.camera.follow(player);

    //  Our two animations, walking left and right.
    //player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    // Update elapsed time each second
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
}

function updateLevel() {
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -PLAYER_VELOCITY;
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = PLAYER_VELOCITY;
    } else if (cursors.up.isDown) {
        //  Move to the right
        player.body.velocity.y = - PLAYER_VELOCITY;
    } else if (cursors.down.isDown) {
        //  Move to the right
        player.body.velocity.y = PLAYER_VELOCITY;
    } else {
        //  Stand still
        stopPlayer();
    }
}