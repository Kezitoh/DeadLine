const PLAYER_VELOCITY = 150;
const MAX_HEALTH = 100;
const DEFAULT_TIME = 2;

const SHOOT_COOLDOWN = 150;
const BULLET_SPEED = 300;

//Enemy consts
const ENEMY_BASE_HEALTH = 10;
const ENEMY_BASE_SPEED = 50;
const ENEMY_GROUP_SIZE = 100;
const ENEMY_SPAWN_TIMER = 1000;
const ENEMY_TURN_TIMER_MIN = 2000;
const ENEMY_TURN_TIMER_MAX = 3000;
const ENEMY_TURN_PROBABILITY = 0.9;
const ENEMY_STOP_TIME = 1500;
let enemyHealth;
let enemyResetPosX;
let enemyResetPosY;

let playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel
};

/** @type {Phaser.Group} */
let hudGroup;
/** @type {Phaser.Group} */
let bulletGroup;
let healthBar, healthValue, healthTween, hudTime, hudScore, hudDifficulty;
let remainingTime;
let score;
/** @type {Phaser.Sprite} */
let player;
/** @type {Phaser.CursorKeys} */
let cursors;
let wasd;
let nextShoot;
let cameraPosX;
let cameraPosY;




function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
}



function loadSprites() {
    game.load.spritesheet('pc', '../assets/sprites/survivor1_stand.png');
    game.load.spritesheet('zombie', '../assets/sprites/zombie_hold.png');
    game.load.image('bullet', '../assets/sprites/purple_ball.png');
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
    nextShoot = 0;
    game.world.setBounds(0, 0, game.canvas.width*2, game.canvas.height*2);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGame');

    cursors = game.input.keyboard.createCursorKeys();
    wasd = game.input.keyboard.addKeys({w: Phaser.KeyCode.W, a: Phaser.KeyCode.A, s: Phaser.KeyCode.S, d: Phaser.KeyCode.D});
    
    bulletGroup = game.add.group();
    bulletGroup.enableBody = true;
    bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    bulletGroup.createMultiple(50,'bullet');
    bulletGroup.forEach((bullet)=>{bullet.scale.set(0.5,0.5)})

    bulletGroup.setAll('checkWorldBounds', true);
    bulletGroup.setAll('outOfBoundsKill', true);

    setDifficulty(difficulty);

    remainingTime = DEFAULT_TIME;

    // Background
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

    player.body.collideWorldBounds = true;

    game.add.sprite(game.world.width/2,game.world.height/2,"heart");

    createEnemies();
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

function updateLevel() {
    characterMovement();
    //player.rotation = game.physics.arcade.angleToPointer(player);
    //player.body.velocity = game.physics.arcade.velocityFromRotation(player.rotation,PLAYER_VELOCITY);
    if(game.input.activePointer.isDown) {
        shoot();
    }
    // if(healthValue > 50) {
    //     healthValue--;
    //     updateHealthBar();
    // }else if(score <= 105) {
    //     score +=2;
    //     updateScore();
    // }
}

function shoot() {
    if(game.time.now > nextShoot && bulletGroup.countDead() > 0) {
        nextShoot = game.time.now + SHOOT_COOLDOWN;
        let bullet = bulletGroup.getFirstDead();
        bullet.reset(player.x, player.y);
        game.physics.arcade.moveToPointer(bullet, BULLET_SPEED);
    }
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

function createEnemies() {
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.createMultiple(ENEMY_GROUP_SIZE, 'zombie');
    enemies.forEach((enemy)=>{
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.collideWorldBounds = true;
        enemyHealth = ENEMY_BASE_HEALTH;});
    game.time.events.loop(ENEMY_SPAWN_TIMER, spawnEnemy, this);
}

function spawnEnemy() {
    let enemy = enemies.getFirstExists(false);
    if (enemy){
        enemySpawnPositionCheck(Math.random() * game.world.width, Math.random() * game.world.height);
        enemy.reset(Math.random() * game.world.width, Math.random() * game.world.height);
        enemy.rotation = Math.random() * 360;
        enemy.body.velocity = game.physics.arcade.velocityFromRotation(enemy.rotation, ENEMY_BASE_SPEED);
        game.time.events.loop(Math.floor(Math.random() * (ENEMY_TURN_TIMER_MAX - ENEMY_TURN_TIMER_MIN) + ENEMY_TURN_TIMER_MIN), ()=>enemyMovement(enemy));
    }
}

function enemyMovement(enemy){
    enemy.body.velocity = 0;
    enemy.rotation = Math.random() * 360;
    game.time.events.add(ENEMY_STOP_TIME, () => {
        if (Math.random() < ENEMY_TURN_PROBABILITY){
        enemy.body.velocity = game.physics.arcade.velocityFromRotation(enemy.rotation, ENEMY_BASE_SPEED);
        }
    })
}

//function that ensures the enemies appear outside of the camera/safe zone
function enemySpawnPositionCheck(posX, posY){
    if(cameraPosX < posX < (cameraPosX + game.camera.width) || cameraPosY < posY < (cameraPosY + game.camera.height)){
        posX = Math.random() * game.world.width;
        posY = Math.random() * game.world.height;
        enemySpawnPositionCheck(posX,posY);
    }
    enemyResetPosX = posX;
    enemyResetPosY = posY;
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
        game.time.events.add(25, endGame, this);
    }
}

function endGame() {
    game.state.start('play');
}


function updateScore() {
    hudScore.setText((score +'').padStart(4,'0'))
}

function endGame() {
    remainingTime = 100;
    game.state.start('screenFinal');
}



