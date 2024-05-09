const WORLD_WIDTH = 1100;
const WORLD_HEIGHT = 825;
const PLAYER_VELOCITY = 150;
const MAX_HEALTH = 100;
const DEFAULT_TIME = 60;

let playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel


}

let hudGroup, healthBar, healthValue, healthTween, hudTime, hudScore, hudDifficulty;
let remainingTime;
let score;
//let difficulty = "Normal"; //esto no irá aquí en el futuro, irá en pantalla de inicio
//const DIFFICULTY = {Normal : 0, Easy: 1, Hard: 2};


function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
}



function loadSprites() {
    game.load.spritesheet('collector', 'assets/Nuevos/configuracionboton.png', 32, 48);
}

function loadSounds() {

}

function loadLevel(level) {
    game.load.image('bgGame', 'assets/Nuevos/fondo_espadas.jpeg');
}



function loadImages() {
    game.load.image('heart', '../assets/UI/heart.png');
    game.load.image('healthBar', '../assets/UI/health_bar.png');
    game.load.image('healthHolder', '../assets/UI/health_holder.png');
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

function createLevel() {
    setDifficulty(difficulty);
    remainingTime = DEFAULT_TIME;
    createHUD();
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
}

function setDifficulty(difficulty) {
    switch (difficulty) {
        case DIFFICULTY.Normal || 'Normal':

            break;

        case DIFFICULTY.Easy || 'Easy':
            break;
        case DIFFICULTY.Hard || 'Hard': 

            break;
    }
}

function createHUD() {
    hudGroup = game.add.group();
    hudGroup.create(5,5,'heart');
    hudGroup.create(50, 5, 'healthHolder');
    healthBar = hudGroup.create(50, 5, 'healthBar');
    hudTime = game.add.text(game.world.width/2, 10, setRemainingTime(remainingTime), {
        font: 'bold 25pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudTime);
    hudScore = game.add.text(game.world.width-100, 13, '0000', {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudScore);
    hudDifficulty = game.add.text(hudTime.x+hudTime.width+10, 13, difficulty, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.fixedToCamera = true;
    healthValue = MAX_HEALTH;
    score = 0;
}

function updateHealthBar() {
    if (healthTween)
        healthTween.stop();
    healthTween = game.add.tween(healthBar.scale).to({x: healthValue/MAX_HEALTH, y: 1}, 300, Phaser.Easing.Cubic.Out);
    healthTween.start();
}

function setRemainingTime(seconds) {
    return String(Math.trunc(seconds / 60)).padStart(2, "0") + ":" +
    String(seconds % 60).padStart(2, "0");
}

function updateTime(offset = 0) {
    if(offset != 0) {
        remainingTime += offset;
    }
    remainingTime = Math.max(-1, remainingTime -1);
    hudTime.setText(setRemainingTime(remainingTime));
    if(remainingTime < 0) {
        game.time.events.remove(timerClock);
        game.time.events.add(2500, endGame, this);
    }
}

function updateScore() {
    hudScore.setText((score+'').padStart(4,'0'))
}
