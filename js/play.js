
const PLAYER_VELOCITY = 150;
const MAX_HEALTH = 100;
const DEFAULT_TIME = 2;

let playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel
};


/** @type {Phaser.Group} */
let hudGroup
let healthBar, healthValue, healthTween, hudTime, hudScore, hudDifficulty;
let remainingTime;
let score;
/** @type {Phaser.Sprite} */
let player;
/** @type {Phaser.CursorKeys} */
let cursors;
let wasd;

function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
}



function loadSprites() {
    game.load.spritesheet('pc', '../assets/sprites/survivor1_stand.png')
}

function loadImages() {
    game.load.image('heart', '../assets/UI/heart.png');
    game.load.image('healthBar', '../assets/UI/health_bar.png');
    game.load.image('healthHolder', '../assets/UI/health_holder.png');
    game.load.image('bgGame', '../assets/UI/Fondodejuego.png');
}

function loadSounds() {

}

function loadLevel(level) {
}


function createLevel() {
    game.world.setBounds(0, 0, game.canvas.width*2, game.canvas.height*2);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    wasd = game.input.keyboard.addKeys({w: Phaser.KeyCode.W, a: Phaser.KeyCode.A, s: Phaser.KeyCode.S, d: Phaser.KeyCode.D});

    setDifficulty(difficulty);

    remainingTime = DEFAULT_TIME;

    // Set World bounds (same size as the image background in this case)

    // Background
    let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGame');
    // Smooth scrolling of the background in both X and Y axis
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;



    // Camera follows the player inside the world
    game.camera.follow(player);


    // Update elapsed time each second
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
    createHUD();

    player = game.add.sprite(game.world.width/2, game.world.height/2, 'pc');
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);

    game.add.sprite(game.world.width/2,game.world.height/2,"heart");
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;

    animacionEntrada();
}

function updateLevel() {
    characterMovement();
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
    hudTime = game.add.text(game.canvas.width/2, 10, setRemainingTime(remainingTime), {
        font: 'bold 25pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudTime);

    score = 0;

    hudScore = game.add.text(game.canvas.width-100, 13, score, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudScore);
    hudDifficulty = game.add.text(hudTime.x+hudTime.width+10, 13, difficulty, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudDifficulty);
    hudGroup.fixedToCamera = true;
    healthValue = MAX_HEALTH;

}


function characterMovement() {

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    player.rotation = game.physics.arcade.angleToPointer(player);
    if(cursors.up.isDown || wasd.w.isDown){
        player.body.velocity.y = -PLAYER_VELOCITY;
    }
    if(cursors.down.isDown || wasd.s.isDown){
        player.body.velocity.y = PLAYER_VELOCITY;
    }
    if(cursors.left.isDown || wasd.a.isDown) {
        player.body.velocity.x = -PLAYER_VELOCITY;
    }
    if(cursors.right.isDown || wasd.d.isDown) {
        player.body.velocity.x = PLAYER_VELOCITY;
    }

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
        game.time.events.add(25,() => {animacionSalidaToFinal(() => {endGame();});} , this);
    }
}

function updateScore() {
    hudScore.setText((score +'').padStart(4,'0'))
}

function animacionSalidaToFinal(a){
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(5);
    img5.alpha = 0;

    mainTween = game.add.tween(img5).to({
        alpha: 1
    }, 900, Phaser.Easing.Cubic.Out);
    mainTween.onComplete.add(a);
    mainTween.start();
}



function endGame() {
    // añadir if conforme a al vida para decidir si es true o false la variable winOrLose
    game.state.start('screenFinal');
}
