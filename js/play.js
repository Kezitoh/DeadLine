const MAX_HEALTH = 100;
const DEFAULT_TIME = 60;
const PLAYER_VELOCITY = 150;
const SHOOT_COOLDOWN = 150;

let playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel
};
/** @type {Phaser.Group} */
let hudGroup;
/** @type {Phaser.Group} */
let bulletGroup;
let healthBar, healthValue, healthTween, hudTime, hudScore, hudDifficulty, hudInteractText;
let remainingTime;
let score;
/** @type {Phaser.Sprite} */
let player;
/** @type {Phaser.CursorKeys} */
let cursors;
let wasd;
let nextShoot;

let areaPositions = [];

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
    game.load.image('bullet', '../assets/sprites/purple_ball.png');
}

function loadSounds() {

}

function loadLevel(level) {

}

function createLevel() {
    generateAreaPositions(5);
    nextShoot = 0;
    game.world.setBounds(0, 0, game.canvas.width*2, game.canvas.height*2);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //reload areas
    let graphics = game.add.graphics();
    graphics.beginFill("0x61aaea");
    areaPositions.forEach(element => {
        graphics.drawCircle(element.x, element.y,100);
    });
    graphics.endFill();

    graphics.beginFill("0xaaaaaa");
    graphics.drawRoundedRect()//TODO: AREA BEEG
    graphics.drawCircle(game.world.width/2, 300, 300);
    graphics.endFill();
    
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
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
    
    

    player = game.add.sprite(game.world.width/2, game.world.height-100, 'pc');
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
    player.body.collideWorldBounds = true;
    
    game.add.sprite(game.world.width/4,game.world.height/4,"heart");
    createHUD();
}

function generateAreaPositions(quantity) {
    for(let i = 0; i<quantity; i++) {
        areaPositions.push({x:Math.random()*(game.world.width-50)+50, y: Math.random()*(game.world.height-50)+50});
    }
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
    hudScore = game.add.text(game.canvas.width-100, 13, '0000', {
        font: 'bold 20pt',
        fill: '#ffffff'
    });   
    hudGroup.add(hudScore);
    hudDifficulty = game.add.text(hudTime.x+hudTime.width+10, 13, difficulty, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudDifficulty);

    hudInteractText = game.add.text(game.canvas.width/2, game.canvas.height - 50 , "", {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudInteractText);

    hudGroup.fixedToCamera = true;
    healthValue = MAX_HEALTH;
    score = 0;
}

function updateLevel() {
    characterMovement();
    //player.rotation = game.physics.arcade.angleToPointer(player);
    //player.body.velocity = game.physics.arcade.velocityFromRotation(player.rotation,PLAYER_VELOCITY);
    if(game.input.activePointer.isDown) {
        shoot();
    }
    checkRechargeArea();
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
        game.physics.arcade.moveToPointer(bullet, 300);
    }
}

function characterMovement() {

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
    
    else if(cursors.down.isUp && 
            cursors.up.isUp && 
            cursors.left.isUp &&
            cursors.right.isUp && 
            wasd.w.isUp && 
            wasd.s.isUp && 
            wasd.a.isUp && 
            wasd.d.isUp) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
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
        game.time.events.add(2500, endGame, this);
    }
}

function updateScore() {
    hudScore.setText((score+'').padStart(4,'0'))
}

function checkRechargeArea() {
    let i = 0;
    let found = false;
    while(!found && i < areaPositions.length) {
        if(Math.abs(areaPositions[i].x - player.x) < 50 && Math.abs(areaPositions[i].y - player.y) < 50) {
            found = true;
            hudInteractText.setText("Press [E] or [-] to recharge.");
        }
        i++;
    }
    if(!found) {
        hudInteractText.setText("");
    }
}

