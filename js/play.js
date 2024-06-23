//Player consts
const PLAYER_VELOCITY = 150;
const MAX_HEALTH = 100;
const SAFEZONECOOLDOWN = 5000;
const DEFAULT_TIME = 60;
const INVULNERABILITY_TIME = 800;
const COIN_GROUP_SIZE = 2000;
const GEM_GROUP_SIZE = 2000;
const WIN_CONDITION = 45;
const SHOOT_COOLDOWN = 150;
const BULLET_SPEED = 600;
const BULLET_GROUP_SIZE = 50;
const FIRST_STAGE = 2500;

//Enemy consts
const ENEMY_BASE_HEALTH = 15;
const ENEMY_BASE_SPEED = 100;
const ZOMBIE_GROUP_SIZE = 100;
const ROBOT_GROUP_SIZE = 30;
const ENEMY_SPAWN_TIMER = 100;
const ENEMY_TURN_TIMER_MIN = 2000;
const ENEMY_TURN_TIMER_MAX = 3000;
const ENEMY_TURN_PROBABILITY = 0.9;
const ENEMY_STOP_TIME = 1500;
const ENEMY_BASE_HURT = 15;
const ROBOT_BASE_SPEED = 120;
const ROBOT_BULLETS_GROUP_SIZE = 300;
const EXTRA_TIME_PER_KILL = 3;
const PLAYER_SAFE_RADIUS = 200;

//Safe zone consts
const SAFE_ZONE_OFFSET = 50;
const SAFE_ZONE_COUNTDOWN = 10;
const INITIAL_HEALTH_COST = 40;
const INITIAL_SPEED_COST = 50;
const ITEMCOST = [30, 100, 200];

let initPosX;
let initPosY;

let playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel,
    //render: render
};

//Helper render function for collision areas
function render() {
    areaGroup.forEach(area => {
        game.debug.bodyInfo(area, 32, 32);
        game.debug.body(area);
    });
}

//Group variables
/** @type {Phaser.Group} */
let zombieGroup;
/** @type {Phaser.Group} */
let robotGroup;
/** @type {Phaser.Group} */
let robotBullets;
/** @type {Phaser.Group} */
let areaGroup;
/** @type {Phaser.Group} */
let hudGroup;
/** @type {Phaser.Group} */
let bulletGroup;
/** @type {Phaser.Group} */
let gemGroup;

//HUD variables
let healthBar, healthValue, healthTween, hudTime, hudScore, hudDifficulty, hudAmmo, hudCoins, hudInteractText, hudGems;

//Timer variables
let remainingTime;
let remainingSZTime;
let safeZoneTimeIn;
let timerClock;
let timerClock2;

//Player variables
let coins;
let gems;
let score;
/** @type {Phaser.Sprite} */
let player;
let playerSpeed;
let ammo;
let maxAmmo;
let weaponsBuy = [
    { image: 'weapon0', bought: true, ammo: 50, maxAmmo: 50, cooldown: 500, damage: 5 },//predeterminada
    { image: 'weapon1', bought: false, ammo: 30, maxAmmo: 30, cooldown: 500, damage: 12 },
    { image: 'weapon2', bought: false, ammo: 10, maxAmmo: 10, cooldown: 1500, damage: 5 },
    { image: 'weapon3', bought: false, ammo: 70, maxAmmo: 100, cooldown: 99, damage: 5 }
];
let currentWeaponSprite;

//Control variables
/** @type {Phaser.CursorKeys} */
let cursors;
let keys;
let nextShoot;
let nextHurt;
let cameraPosX;
let cameraPosY;
let currentWeapon = 0;



//Safe zone variables
/** @type {Phaser.Sprite} */
let safeZone;
let safeZonePillars = [];
let overlapSafeZone;
let nextEntryIntoSafeZone;
let weapon1Bought;
let weapon2Bought;
let weapon3Bought;
let costRun;
let costLife;
let itemCostArray;

//Sound Variables
/** @type {Phaser.Sound} */
let dangerSound;
let hitSound;
let coinSound;
let shootSound;
let gemSound;
let soundSZ;
let soundPlayBG;

//Enemy variables
let enemyHealth;
let enemyResetPosX;
let enemyResetPosY;
let zombieSpeed;
let enemyDamage;
let enemySpawnRate;
let enemyTween;

//Modifier variables
let costModifier;
let lifeModifier;
let enemyLifeModifier;
let enemyDamageModifier;
let enemySpawnRateModifier;
let speedPlayerModifier;
let speedEnemyModifier;
let timeModifier;
let winConditionModifier;
let firstStageModifier;

//General variables
let bg;
let wall;
let levelData;
let winCondition;
let firstStage;

function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
    game.load.json('jsonData', 'assets/levelData.json');
}

function loadSprites() {
    game.load.spritesheet('pc', 'assets/sprites/psj.png', 55, 43);
    game.load.spritesheet('zombie', 'assets/sprites/zomb.png', 36, 43);
    game.load.spritesheet('robot', 'assets/sprites/robot1_gun.png');
    game.load.image('bullet', 'assets/sprites/purple_ball.png');
    game.load.image('robotBullet', 'assets/sprites/red_ball.png');
    game.load.image('reloadArea', 'assets/sprites/blue_circle.png');
}

function loadImages() {
    game.load.image('heart', 'assets/UI/heart.png');
    game.load.image('boots', 'assets/sprites/botasConAlas.png');
    game.load.image('healthBar', 'assets/UI/health_bar.png');
    game.load.image('healthHolder', 'assets/UI/health_holder.png');
    game.load.image('coin', 'assets/UI/coin.png');
    game.load.image('gem', 'assets/sprites/gem.png');
    game.load.image('bgGame', 'assets/UI/Fondodejuego.png');
    game.load.image('bgZona2', 'assets/UI/Fondodejuego_Zona2.png');
    game.load.image('wall', "assets/sprites/tile_273.png");
    game.load.image('negro', 'assets/UI/ImagenNegraParaTransicion.jpg');
    game.load.spritesheet('safeZone', 'assets/UI/Zona_segura.png');
    game.load.spritesheet('safeZone0', 'assets/UI/Zona_segura_abajo_derecha.png');
    game.load.spritesheet('safeZone1', 'assets/UI/Zona_segura_abajo_izq.png');
    game.load.spritesheet('safeZone2', 'assets/UI/Zona_segura_arriba_derecha.png');
    game.load.spritesheet('safeZone3', 'assets/UI/Zona_segura_arriba_izq.png');


    game.load.spritesheet('buyWeapon1Button', 'assets/UI/MenuSZ/ConBuy/BuyVerde.png');
    game.load.spritesheet('buyWeapon2Button', 'assets/UI/MenuSZ/ConBuy/BuyNaranja.png');
    game.load.spritesheet('buyWeapon3Button', 'assets/UI/MenuSZ/ConBuy/BuyRojo.png');
    game.load.spritesheet('upgradeSpeedButton', 'assets/UI/MenuSZ/ConBuy/BuyBlanco.png');
    game.load.spritesheet('upgradeHealthButton', 'assets/UI/MenuSZ/ConBuy/BuyAzul.png');
    game.load.spritesheet('exitButton', 'assets/UI/MenuSZ/ConBuy/CloseNegro.png');

    //escopeta,pistola,machinegun

    game.load.spritesheet('weapon0', 'assets/sprites/pistolaConSilenciador.png');
    game.load.spritesheet('weapon1', 'assets/sprites/pistola.png');
    game.load.spritesheet('weapon2', 'assets/sprites/escopeta.png');
    game.load.spritesheet('weapon3', 'assets/sprites/AK.png');
}

function loadSounds() {
    game.load.audio('danger', 'assets/sounds/danger.wav');
    game.load.audio('hitSound', 'assets/sounds/hitHurt.wav');
    game.load.audio('coinSound', 'assets/sounds/pickupCoin.wav');
    game.load.audio('shootSound', 'assets/sounds/laserShoot.wav');
    game.load.audio('gemSound', 'assets/sounds/pickupGem.wav');
    game.load.audio('playSoundBG', 'assets/sounds/musicaFondoJuego.mp3');
}

function loadLevel(level) {
}


function createSounds() {
    soundSZ = game.add.audio('danger');
    hitSound = game.add.audio('hitSound');
    coinSound = game.add.audio('coinSound');
    shootSound = game.add.audio('shootSound');
    gemSound = game.add.audio('gemSound');
    soundPlayBG = game.add.audio('playSoundBG', 0.5, true);
    soundPlayBG.play();
}




function createLevel() {
    levelData = game.cache.getJSON('jsonData');
    createSounds();
    setDifficulty(difficulty);
    setWeapons();
    setWorld();
    zonaSegura();
    console.log(initPosX, initPosY);
    setAreas();
    game.camera.focusOnXY(initPosX, initPosY);
    setPlayer();
    // maxAmmo = 50;
    // ammo = maxAmmo;
    //reload areas
    //generateAreaPositions(areaGroup.length-1);
    setControls();
    setGroups();
    // Update elapsed time each second
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, () => { remainingTime = updateTime(hudTime, remainingTime, timerClock, setRemainingTime); }, this);
    //game.add.sprite(game.world.width/2,game.world.height/2,"heart");
    createEnemies();
    createHUD();
    createMenu();
    hideMenu();
    enterAnimation();
}

function setGroups() {
    coinGroup = game.add.group();
    coinGroup.enableBody = true;
    coinGroup.physicsBodyType = Phaser.Physics.ARCADE;
    coinGroup.createMultiple(COIN_GROUP_SIZE, 'coin');
    coinGroup.forEach(coin => {
        coin.anchor.setTo(0.5, 0.5);
    });

    gemGroup = game.add.group();
    gemGroup.enableBody = true;
    gemGroup.physicsBodyType = Phaser.Physics.ARCADE;
    gemGroup.createMultiple(GEM_GROUP_SIZE, 'gem');
    gemGroup.forEach(gem => {
        gem.anchor.setTo(0.5, 0.5);
        gem.scale.setTo(2, 2);
    });

    bulletGroup = game.add.group();
    bulletGroup.enableBody = true;
    bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    bulletGroup.createMultiple(BULLET_GROUP_SIZE, 'bullet');
    bulletGroup.forEach((bullet) => {
        bullet.scale.set(0.5, 0.5);
        bullet.body.bounce.set(1);
    });

    bulletGroup.setAll('checkWorldBounds', true);
    bulletGroup.setAll('outOfBoundsKill', true);
}

function setControls() {
    keys= {
        movement:game.input.keyboard.addKeys({ w: Phaser.KeyCode.W, a: Phaser.KeyCode.A, s: Phaser.KeyCode.S, d: Phaser.KeyCode.D }),
        reload:game.input.keyboard.addKeys({e: Phaser.KeyCode.E, underscore: Phaser.KeyCode.UNDERSCORE}),
        switchWeapon:game.input.keyboard.addKeys({q: Phaser.KeyCode.Q, ctrl: Phaser.KeyCode.CONTROL})
    };
    cursors = game.input.keyboard.createCursorKeys();
}

function setAreas() {
    areaGroup = game.add.group();
    areaGroup.enableBody = true;
    areaGroup.physicsBodyType = Phaser.Physics.ARCADE;
    areaGroup.createMultiple(5, 'reloadArea');
    areaGroup.forEachDead(area => {
        area.body.setCircle(1, area.width / 2.15, area.height / 2.15);
        area.scale.setTo(4, 4);
        area.anchor.setTo(0.5, 0.5);
        area.reset(Math.random() * (game.world.width - 50) + 50, Math.random() * (game.world.height - 50) + 50);
    });
}

function setWorld() {
    game.world.setBounds(0, 0, game.canvas.width * 2, game.canvas.height * 4);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bg = game.add.tileSprite(0, game.world.height / 2, game.world.width, game.world.height, 'bgGame');
    bgZona2 = game.add.tileSprite(0, 0, game.world.width, game.world.height / 2, 'bgZona2');
    wall = game.add.tileSprite(0, game.world.height / 2, game.world.width, 64, 'wall');
    game.physics.arcade.enable(wall);
    wall.body.immovable = true;
    // Background
    // Smooth scrolling of the background in both X and Y axis
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;
    initPosX = game.world.width / 2; 
    initPosY = game.world.height - game.world.height / 7;
}

function setPlayer() {
    totalItems = 0;
    nextHurt = 0;
    coins = 0;
    gems = 0;
    player = game.add.sprite(levelData.player.x, levelData.player.y, 'pc');
    player.anchor.setTo(0.4, 0.5);
    player.animations.add('holdGun', [5], 0, false);
    player.animations.add('shootRifle', [4], 0, false);
    player.animations.add('shootShotgun', [3], 0, false);
    player.animations.add('walk', [0], 0, false);
    player.animations.add('shootPistol', [2], 0, false);
    //player.animations.play('walk');
    game.physics.arcade.enable(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
    player.body.collideWorldBounds = true;
}

function setWeapons() {
    weaponsBuy.forEach(weapon => { weapon.bought = false; })
    weaponsBuy[0].bought = true;
    weaponsBuy[0].ammo = weaponsBuy[0].maxAmmo;
    currentWeapon = 0;

    weapon1Bought = false;
    weapon2Bought = false;
    weapon3Bought = false;
    nextShoot = 0;
}

function setDifficulty(difficulty) {
    // mas o menos vida--, mas o menos daño de los enemigos y la vida  la velocidad de los enemigos, cantidad de los enemigos precios
    itemCostArray = [];
    
    switch (difficulty) {
        case DIFFICULTY.Normal || 'Normal':
            costModifier = 1;
            lifeModifier = 1;
            enemyLifeModifier = 1;
            enemyDamageModifier = 1;
            enemySpawnRateModifier = 1;
            //speedPlayerModifier = 1;
            speedEnemyModifier = 1;
            timeModifier = 1;
            winConditionModifier = 1;
            firstStageModifier = 1;
            break;
        case DIFFICULTY.Easy || 'Easy':
            costModifier = 0.5;
            lifeModifier = 1.3;
            enemyLifeModifier = 0.6;
            enemyDamageModifier = 0.8;
            enemySpawnRateModifier = 1.5;
            //speedPlayerModifier = 1.3;
            speedEnemyModifier = 0.8;
            timeModifier = 1.2;
            winConditionModifier = 0.35;
            firstStageModifier = 0.1;
            break;
        case DIFFICULTY.Hard || 'Hard':
            costModifier = 1.30;
            lifeModifier = 0.85;
            enemyLifeModifier = 1.5;
            enemyDamageModifier = 1.5;
            enemySpawnRateModifier = 0.5;
            //speedPlayerModifier = 0.8;
            speedEnemyModifier = 1.3;
            timeModifier = 0.5;
            winConditionModifier = 2;
            firstStageModifier = 0.75;
            break;
    }
    speedPlayerModifier = 1;
    remainingTime = DEFAULT_TIME * timeModifier;
    costRun = INITIAL_SPEED_COST * costModifier;
    costLife = INITIAL_HEALTH_COST * costModifier;
    playerSpeed = PLAYER_VELOCITY * speedPlayerModifier;
    enemyHealth = ENEMY_BASE_HEALTH * enemyLifeModifier;
    zombieSpeed = ENEMY_BASE_SPEED * speedEnemyModifier;
    robotSpeed = ENEMY_BASE_SPEED * speedEnemyModifier;
    maxHealth = MAX_HEALTH * lifeModifier;
    enemyDamage = ENEMY_BASE_HURT * enemyDamageModifier;
    enemySpawnRate = ENEMY_SPAWN_TIMER * enemySpawnRateModifier;
    winCondition = Math.floor(WIN_CONDITION * winConditionModifier);
    firstStage = FIRST_STAGE * firstStageModifier;
    ITEMCOST.forEach(item => {
        itemCostArray.push(item * costModifier);
    });
}

function updateLevel() {
    if (currentWeapon < 2) {
        player.animations.play('shootPistol');
    } else {
        player.animations.play('holdGun');
    }
    //player.animations.play('shootPistol');
    collisionsSafeZone();
    generalCollisions();
    enemyChase();

    
    shoot();
    characterMovement();
    areaGroup.forEachAlive(area => {
        game.physics.arcade.overlap(area, player, checkRechargeArea, null, this);
    });
    if (areaGroup.countDead() > 0) {
        
        if (score < firstStage){
            areaGroup.getFirstDead().reset(Math.random() * (game.world.width - 50) + 50, Math.random() * (game.world.height - 50) + 50);
        }
        else{
            areaGroup.getFirstDead().reset(Math.random() * (game.world.width - 50) + 50, Math.random() * ((game.world.height/1.75) - 50) + 50);
        }
    }
    

    //Cuando la vida valga cero llamara la  funcion salidafinal y pone winorlose en false
    if (healthValue <= 0) {
        exitAnimationToFinal(() => { endGame(false); });
    }else if(gems >= winCondition) {
        exitAnimationToFinal(() => {endGame(true);});
    }

    if (keys.switchWeapon.q.justDown || keys.switchWeapon.ctrl.justDown) {
        switchWeapon();
    }

}

function switchWeapon() {
    do {
        currentWeapon = (currentWeapon + 1) % weaponsBuy.length;
    } while (!weaponsBuy[currentWeapon].bought);

    currentWeaponSprite.loadTexture(weaponsBuy[currentWeapon].image);
    hudAmmo.setText(weaponsBuy[currentWeapon].ammo + "/" + weaponsBuy[currentWeapon].maxAmmo);
}



function zonaSegura() {
    overlapSafeZone = false;
    nextEntryIntoSafeZone = 0;
    safeZone = game.add.sprite(levelData.safeZone.position.x, levelData.safeZone.position.y, 'safeZone');
    safeZone.anchor.setTo(0.5);
    game.physics.arcade.enable(safeZone);
    safeZone.body.immovable = true;
    let i = 0;
    levelData.safeZone.pillars.forEach(pillar => {
        let safeZonePillar = game.add.sprite(pillar.x, pillar.y, 'safeZone'+i++);
        safeZonePillar.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(safeZonePillar);
        safeZonePillar.body.immovable = true;
        safeZonePillars.push(safeZonePillar);
    });
    
}

function generalCollisions() {
    game.physics.arcade.collide(zombieGroup, bulletGroup, hurtZombie, null, this);
    game.physics.arcade.collide(zombieGroup, player, hurtPlayer);
    game.physics.arcade.collide(zombieGroup, safeZone);
    game.physics.arcade.collide(coinGroup, player, collectCoin, null, this);
    game.physics.arcade.collide(gemGroup, player, collectGem, null, this);
    game.physics.arcade.collide(robotGroup, bulletGroup, hurtRobot, null, this);
    game.physics.arcade.collide(robotGroup, player, hurtPlayer);
    game.physics.arcade.collide(robotGroup, safeZone);
    game.physics.arcade.collide(robotBullets, player, ()=>hurtPlayer(player, robotBullets, true, true));
    if (score < FIRST_STAGE) {
        game.physics.arcade.collide(wall, player);
        game.physics.arcade.collide(wall, bulletGroup);
        game.physics.arcade.collide(zombieGroup, wall);
    }else {
        wall.kill();
    }
}

function collisionsSafeZone() {
    //Cuando Entra a la zona segura
    console.log(game.physics.arcade.overlap(player, safeZone));
    if (game.time.now > nextEntryIntoSafeZone && !overlapSafeZone && game.physics.arcade.overlap(player, safeZone)) {

        overlapSafeZone = true;
        onSafeZoneOverlap();
        showMenu();

    } else if (!overlapSafeZone) {
        game.physics.arcade.collide(player, safeZone);
    }

    if (remainingSZTime == 3) {
        soundSZ.play();
    }

    if (overlapSafeZone && !game.physics.arcade.overlap(player, safeZone)) {
        nextEntryIntoSafeZone = game.time.now + SAFEZONECOOLDOWN;
    }

    if (!game.physics.arcade.overlap(player, safeZone)) {
        overlapSafeZone = false;
        game.time.events.remove(timerClock2);
        safeZoneTimeIn.setText("");
        soundSZ.stop();
        hideMenu();
    }



    //game.physics.arcade.collide(enemy, safeZone);
    bulletGroup.forEachAlive(bullet => {
        game.physics.arcade.collide(bullet, safeZonePillars[0]);
        game.physics.arcade.collide(bullet, safeZonePillars[1]);
        game.physics.arcade.collide(bullet, safeZonePillars[2]);
        game.physics.arcade.collide(bullet, safeZonePillars[3]);
    });
    game.physics.arcade.collide(player, safeZonePillars[0]);
    game.physics.arcade.collide(player, safeZonePillars[1]);
    game.physics.arcade.collide(player, safeZonePillars[2]);
    game.physics.arcade.collide(player, safeZonePillars[3]);

}



function hurtPlayer(player, source, killsource = false, isBullet = false) {
    if(isBullet) {
      source.kill(); // Eliminar solo la bala que golpeó al jugador
    }
    if (game.time.now > nextHurt) {
      hitSound.play();
      nextHurt = game.time.now + INVULNERABILITY_TIME;
      healthValue -= enemyDamage;
      updateHealthBar();
    }
}

function hurtZombie(enemy, bullet) {
    bullet.kill();
    hitSound.play();
    //if the enemies aren't stopped when hit, the collision will send them flying
    enemy.body.velocity.x = 0;
    enemy.body.velocity.y = 0;
    enemy.health -= weaponsBuy[currentWeapon].damage;
    score += 5;
    if (enemy.health <= 0) {
        remainingTime += EXTRA_TIME_PER_KILL;
        updateTime(hudTime, remainingTime, timerClock, setRemainingTime);
        let coin = coinGroup.getFirstDead();
        coin.reset(enemy.x - 10, enemy.y - 10);
        enemy.kill();
        if (Math.random() > 0.5) {
            gemGroup.getFirstDead().reset(enemy.x + 10, enemy.y + 10);
        }
        score += 100;
    }
    updateScore();

}


function hurtRobot(enemy, bullet) {
    bullet.kill();
    hitSound.play();
    //if the enemies aren't stopped when hit, the collision will send them flying
    enemy.body.velocity.x = 0;
    enemy.body.velocity.y = 0;
    enemy.health -= weaponsBuy[currentWeapon].damage;
    score += 5;
    if (enemy.health <= 0) {
        remainingTime += EXTRA_TIME_PER_KILL;
        updateTime(hudTime, remainingTime, timerClock, setRemainingTime);
        let coin = coinGroup.getFirstDead();
        coin.reset(enemy.x - 10, enemy.y - 10);
        enemy.kill();
        gemGroup.getFirstDead().reset(enemy.x + 10, enemy.y + 10);
        score += 100;
    }
    updateScore();

}

function collectCoin(player, coin) {
    coin.kill();
    coinSound.play();
    coins += 15;
    totalItems++;
    hudCoins.setText(coins);
}

function collectGem(player, gem) {
    gem.kill();
    gemSound.play();
    gems++;
    totalItems++;
    hudGems.setText(gems + "/" + winCondition);

}

function onSafeZoneOverlap() {
    safeZone.body.velocity.x = 0;
    safeZone.body.velocity.y = 0;
    remainingSZTime = SAFE_ZONE_COUNTDOWN;

    timerClock2 = game.time.events.loop(Phaser.Timer.SECOND, () => { remainingSZTime = updateTime(safeZoneTimeIn, remainingSZTime, timerClock2, setRemainingTime2); }, this);

    safeZoneTimeIn = game.add.text(game.canvas.width / 2, 100, setRemainingTime2(remainingSZTime), {
        font: 'bold 35pt',
        fill: '#ffffff'
    });

    safeZoneTimeIn.fixedToCamera = true;
}




function createHUD() {
    hudGroup = game.add.group();
    hudGroup.create(5, 5, 'heart');
    hudGroup.create(50, 5, 'healthHolder');
    healthBar = hudGroup.create(50, 5, 'healthBar');
    hudTime = game.add.text(game.canvas.width / 2, 10, setRemainingTime(remainingTime), {
        font: 'bold 25pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudTime);

    score = 0;

    hudScore = game.add.text(game.canvas.width - 100, 13, score, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudScore);
    hudDifficulty = game.add.text(hudTime.x + hudTime.width + 10, 13, difficulty, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudDifficulty);
    hudAmmo = game.add.text(game.canvas.width - 100, game.canvas.height - 50, weaponsBuy[currentWeapon].ammo + "/" + weaponsBuy[currentWeapon].maxAmmo, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudAmmo);

    hudGroup.create(game.canvas.width - 155, 36, 'coin');
    hudCoins = game.add.text(game.canvas.width - 100, 52, coins, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudCoins);

    let gemIcon = hudGroup.create(game.canvas.width - 135, 95, 'gem');
    gemIcon.scale.setTo(1.5, 1.5);
    hudGems = game.add.text(game.canvas.width - 100, 92, gems + "/" + winCondition, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudGems);

    hudInteractText = game.add.text(game.canvas.width / 2, game.canvas.height - 50, "", {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    hudGroup.add(hudInteractText);

    currentWeaponSprite = hudGroup.create(game.canvas.width - 155, game.canvas.height - 100, 'weapon0');
    currentWeaponSprite.anchor.setTo(0.5, 0.5);
    currentWeaponSprite.scale.setTo(0.25);


    hudGroup.fixedToCamera = true;
    healthValue = maxHealth;
    score = 0;
}

function shoot() {
    if ((game.input.activePointer.isDown && !game.physics.arcade.overlap(player, safeZone) && !game.physics.arcade.isPaused)
        || (game.input.activePointer.isDown && !menuGroup.visible && !game.physics.arcade.isPaused)
        || (game.input.activePointer.isDown && !game.physics.arcade.isPaused && !game.physics.arcade.overlap(player, safeZone))) {
        switch (currentWeapon) {
            case 0:
                player.animations.play('shootPistol');
                break;
            case 2:
                player.animations.play('shootShotgun');
                break;
            case 3:
                player.animations.play('shootRifle');
                break;
        }
        let weapon = weaponsBuy[currentWeapon];
        if (game.time.now > nextShoot && bulletGroup.countDead() > 0 && weapon.ammo > 0) {
            shootSound.play();
            nextShoot = game.time.now + weapon.cooldown;
            if (weapon.image == 'weapon2') {
                //ESCOPETA
                nextShoot = game.time.now + SHOOT_COOLDOWN * 3;

                for (let i = 0; i < 5; i++) {
                    let bullet = bulletGroup.getFirstDead();
                    bullet.reset(player.x, player.y);
                    bullet.rotation = game.physics.arcade.angleToPointer(bullet);

                    bullet.body.velocity = game.physics.arcade.velocityFromAngle(bullet.angle + (i / 4) * 20 - 10, BULLET_SPEED); //Divide las balas en un ángulo de -20 a 20 grados desde el puntero
                }
                weapon.ammo--;

            } else {
                let bullet = bulletGroup.getFirstDead();
                bullet.reset(player.x, player.y);
                game.physics.arcade.moveToPointer(bullet, BULLET_SPEED);
                weapon.ammo--;
            }

            hudAmmo.setText(weapon.ammo + "/" + weapon.maxAmmo);
        }
    }
}

function characterMovement() {

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    player.rotation = game.physics.arcade.angleToPointer(player);
    if (cursors.up.isDown || keys.movement.w.isDown) {
        player.body.velocity.y = -1;
    }
    if (cursors.down.isDown || keys.movement.s.isDown) {
        player.body.velocity.y = 1;
    }
    if (cursors.left.isDown || keys.movement.a.isDown) {
        player.body.velocity.x = -1;
    }
    if (cursors.right.isDown || keys.movement.d.isDown) {
        player.body.velocity.x = 1;
    }
    player.body.velocity.normalize(this, this);
    player.body.velocity.x *= playerSpeed;
    player.body.velocity.y *= playerSpeed;
}

function createEnemies() {
    zombieGroup = game.add.group();
    zombieGroup.enableBody = true;
    zombieGroup.createMultiple(ZOMBIE_GROUP_SIZE, 'zombie');
    zombieGroup.forEach((enemy) => {
        enemy.animations.add('idle', [0]);
        enemy.animations.add('chase', [1]);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.collideWorldBounds = true;
        //game.physics.arcade.enable(enemy);

    });

    robotGroup = game.add.group();
    robotGroup.enableBody = true;
    robotGroup.createMultiple(ROBOT_GROUP_SIZE / 2, 'robot');
    robotGroup.forEach((enemy) => {
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.collideWorldBounds = true;
    });

    robotBullets = game.add.group();
    robotBullets.enableBody = true;
    robotBullets.physicsBodyType = Phaser.Physics.ARCADE;
    robotBullets.createMultiple(ROBOT_BULLETS_GROUP_SIZE, 'robotBullet');
    robotBullets.forEach((bullet) => {
        bullet.scale.set(0.5, 0.5);
    });
    robotBullets.setAll('checkWorldBounds', true);
    robotBullets.setAll('outOfBoundsKill', true);
    game.time.events.loop(enemySpawnRate, spawnZombie, this);
    game.time.events.loop(enemySpawnRate, spawnRobot, this);
}

function spawnZombie() {
    if (zombieGroup.countDead() > 0) {
        let zombie = zombieGroup.getFirstDead();
        let pos = enemySpawnPositionCheck();
        zombie.reset(pos.x, pos.y);
        zombie.health = enemyHealth;
        zombie.rotation = Math.random() * 360;
        zombie.body.velocity = game.physics.arcade.velocityFromRotation(zombie.rotation, zombieSpeed);
        game.time.events.loop(Math.floor(Math.random() * (ENEMY_TURN_TIMER_MAX - ENEMY_TURN_TIMER_MIN) + ENEMY_TURN_TIMER_MIN), () => enemyMovement(zombie));
    }
}

function spawnRobot() {
    if (robotGroup.countDead() > 0 && score >= FIRST_STAGE) {
        let robot = robotGroup.getFirstDead();
        let pos = enemySpawnPositionCheck();
        robot.reset(pos.x, pos.y);
        robot.health = enemyHealth * 2;
        robot.chasing = false;
        robot.rotation = Math.random() * 360;
        robot.body.velocity = game.physics.arcade.velocityFromRotation(robot.rotation, ENEMY_BASE_SPEED);
        game.time.events.loop(Math.floor(Math.random() * (ENEMY_TURN_TIMER_MAX - ENEMY_TURN_TIMER_MIN) + ENEMY_TURN_TIMER_MIN), () => enemyMovement(robot));
    }
}

function enemyMovement(enemy) {
    enemy.body.velocity.x = 0;
    enemy.body.velocity.y = 0;
    if (!enemy.chasing) {
        let giro = (Math.random() * 360) - 180;
        game.add.tween(enemy).to({ angle: giro }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
    game.time.events.add(ENEMY_STOP_TIME, () => {
        if (Math.random() < ENEMY_TURN_PROBABILITY) {
            enemy.body.velocity = game.physics.arcade.velocityFromAngle(enemy.angle, ENEMY_BASE_SPEED);
        }
    })
}


//function that ensures the enemies appear outside of the camera/safe zone
function enemySpawnPositionCheck() {
    let posX = Math.random() * game.world.width;
    let posY = Math.random() * game.world.height;
    if ((player.x- PLAYER_SAFE_RADIUS < posX && posX < player.x+ PLAYER_SAFE_RADIUS && player.y- PLAYER_SAFE_RADIUS < posY && posY < player.y+ PLAYER_SAFE_RADIUS) ||
        (safeZone.left - SAFE_ZONE_OFFSET < posX && posX < safeZone.right + SAFE_ZONE_OFFSET && safeZone.top - SAFE_ZONE_OFFSET < posY && posY < safeZone.bottom + SAFE_ZONE_OFFSET)) {
        return enemySpawnPositionCheck(posX, posY);
    }else {
        return { x: posX, y: posY }
    }

    // enemyResetPosX = posX;
    // enemyResetPosY = posY;
}

function enemyChase() {
    //When player is close, zombieGroup chase the player
    zombieGroup.forEach(enemy => {
        enemy.chasing = false;
        enemy.animations.play('idle');
        if (game.physics.arcade.distanceBetween(enemy, player) < 300) {
            enemy.chasing = true;
            enemy.animations.play('chase');
            //USAMOS ESTO PORQUE LA FUNCIÓN game.physics.arcade.moveToObject() DA ERROR POR COSAS MÁS ALLÁ DE MI ENTENDIMIENTO
            enemy.rotation = game.physics.arcade.angleToXY(enemy, player.x, player.y);
            enemy.body.velocity = game.physics.arcade.velocityFromRotation(enemy.rotation, zombieSpeed);
        }
        game.physics.arcade.collide(enemy, safeZone);
        game.physics.arcade.collide(enemy, bulletGroup, hurtZombie, null, this);
    });

    robotGroup.forEach(robot => {
        //Los robotGroup te siguen para siempre cuando te ven por primera vez
        if (game.physics.arcade.distanceBetween(robot, player) < 400 || robot.chasing) {
            if (!robot.chasing) {
                game.time.events.loop(1500, () => robotShoot(robot));
                robot.chasing = true;
            }

            //robot.animations.play('chase');
            robot.rotation = game.physics.arcade.angleToXY(robot, player.x, player.y);
            robot.body.velocity = game.physics.arcade.velocityFromRotation(robot.rotation, robotSpeed);
        }
        game.physics.arcade.collide(robot, safeZone);
        game.physics.arcade.collide(robot, bulletGroup, hurtRobot, null, this);
    })
}

function robotShoot(robot) {
    if (game.physics.arcade.distanceBetween(robot, player) > 200) {
        let bullet = robotBullets.getFirstDead();
        bullet.reset(robot.x, robot.y);
        game.time.events.add(2000, ()=> {bullet.kill()})
        game.physics.arcade.moveToXY(bullet, player.x, player.y, BULLET_SPEED/2);
    }
}


function updateHealthBar() {
    if (healthTween)
        healthTween.stop();
    healthTween = game.add.tween(healthBar.scale).to({ x: healthValue / maxHealth, y: 1 }, 300, Phaser.Easing.Cubic.Out);
    healthTween.start();

}

function setRemainingTime(seconds) {
    return String(Math.trunc(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
}

function setRemainingTime2(seconds) {
    return String(seconds % 60);
}


function updateTime(variableAcutalizar, valorActualizar, temporizador, funcionActulizado) {

    valorActualizar = Math.max(-1, valorActualizar - 1);
    variableAcutalizar.setText(funcionActulizado(valorActualizar));
    if (valorActualizar <= 0) {
        game.time.events.remove(temporizador);
        game.time.events.add(25, () => { exitAnimationToFinal(() => { endGame(false); }); }, this);
    }
    return valorActualizar;
}


function updateScore() {
    hudScore.setText((score + ''))
}

let menuGroup;

function createMenu() {
    menuGroup = game.add.group();

    let buyWeapon1Button = game.add.button(game.canvas.width - 100, game.canvas.height / 2 + 70 - 200, 'buyWeapon1Button', () => { buyItem(0); });
    buyWeapon1Button.anchor.set(0.5);
    buyWeapon1Button.scale.setTo(0.25);
    menuGroup.add(buyWeapon1Button);


    let buyWeapon2Button = game.add.button(game.canvas.width - 100, game.canvas.height / 2 + 70, 'buyWeapon2Button', () => { buyItem(1); });
    buyWeapon2Button.anchor.set(0.5);
    buyWeapon2Button.scale.setTo(0.25);
    menuGroup.add(buyWeapon2Button);


    let buyWeapon3Button = game.add.button(game.canvas.width - 100, game.canvas.height / 2 + 70 + 200, 'buyWeapon3Button', () => { buyItem(2); });
    buyWeapon3Button.anchor.set(0.5);
    buyWeapon3Button.scale.setTo(0.25);
    menuGroup.add(buyWeapon3Button);


    let upgradeSpeedButton = game.add.button(100, game.canvas.height / 2 + 70 - 200, 'upgradeSpeedButton', upgradeSpeed);
    upgradeSpeedButton.anchor.set(0.5);
    upgradeSpeedButton.scale.setTo(0.25);
    menuGroup.add(upgradeSpeedButton);

    let upgradeHealthButton = game.add.button(100, game.canvas.height / 2 + 70, 'upgradeHealthButton', upgradeHealth);
    upgradeHealthButton.anchor.set(0.5);
    upgradeHealthButton.scale.setTo(0.25);
    menuGroup.add(upgradeHealthButton);

    let exitButton = game.add.button(100, game.canvas.height / 2 + 70 + 200, 'exitButton', hideMenu);
    exitButton.anchor.set(0.5);
    exitButton.scale.setTo(0.25);
    menuGroup.add(exitButton);

    // Mostrar monedas
    let coinsText = game.add.text(game.canvas.width / 2, game.canvas.height / 2 + 70 - 150, 'Coins: ' + coins, {
        font: 'bold 25pt',
        fill: '#ffffff'
    });
    coinsText.anchor.set(0.5);
    menuGroup.add(coinsText);

    //apartir de aqui para abajo es para el texto de lo que cuesta cada boton

    let textValorWeapon1 = "Cost: " + itemCostArray[0] + " coins";
    let costWeapon1 = game.add.text(game.canvas.width - 100, game.canvas.height / 2 + 30 - 200, textValorWeapon1, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    costWeapon1.anchor.setTo(0.5, 0.5);
    menuGroup.add(costWeapon1);

    let textValorWeapon2 = "Cost: " + itemCostArray[1] + " coins";
    let costWeapon2 = game.add.text(game.canvas.width - 100, game.canvas.height / 2 + 30, textValorWeapon2, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    costWeapon2.anchor.setTo(0.5, 0.5);
    menuGroup.add(costWeapon2);

    let textValorWeapon3 = "Cost: " + itemCostArray[2] + " coins";
    let costWeapon3 = game.add.text(game.canvas.width - 100, game.canvas.height / 2 + 30 + 200, textValorWeapon3, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    costWeapon3.anchor.setTo(0.5, 0.5);
    menuGroup.add(costWeapon3);

    let textValorUpgradeSpeed = "Cost: " + costRun + " coins";
    costRunText = game.add.text(100, game.canvas.height / 2 + 30 - 200, textValorUpgradeSpeed, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    costRunText.anchor.setTo(0.5, 0.5);
    menuGroup.add(costRunText);

    let textValorUpgradeLife = "Cost: " + costLife + " coins";
    costLifeText = game.add.text(100, game.canvas.height / 2 + 30, textValorUpgradeLife, {
        font: 'bold 20pt',
        fill: '#ffffff'
    });
    costLifeText.anchor.setTo(0.5, 0.5);
    menuGroup.add(costLifeText);

    //apartir de aqui van las imagenes

    let weapon1Image = game.add.sprite(game.canvas.width - 100, game.canvas.height / 2 - 200 - 25, 'weapon1');
    weapon1Image.anchor.set(0.5);
    weapon1Image.scale.setTo(0.25); // Ajusta el tamaño según sea necesario
    menuGroup.add(weapon1Image);

    let weapon2Image = game.add.sprite(game.canvas.width - 100, game.canvas.height / 2 - 25, 'weapon2');
    weapon2Image.anchor.set(0.5);
    weapon2Image.scale.setTo(0.25); // Ajusta el tamaño según sea necesario
    menuGroup.add(weapon2Image);

    let weapon3Image = game.add.sprite(game.canvas.width - 100, game.canvas.height / 2 + 200 - 25, 'weapon3');
    weapon3Image.anchor.set(0.5);
    weapon3Image.scale.setTo(0.25); // Ajusta el tamaño según sea necesario
    menuGroup.add(weapon3Image);

    let heartImageMenu = game.add.sprite(100, game.canvas.height / 2 - 25, 'heart');
    heartImageMenu.anchor.set(0.5);
    heartImageMenu.scale.setTo(1); // Ajusta el tamaño según sea necesario
    menuGroup.add(heartImageMenu);

    let botasImagenAlas = game.add.sprite(100, game.canvas.height / 2 - 25 - 200, 'boots');
    botasImagenAlas.anchor.set(0.5);
    botasImagenAlas.scale.setTo(0.04); // Ajusta el tamaño según sea necesario
    menuGroup.add(botasImagenAlas);

    menuGroup.coinsText = coinsText;
    menuGroup.fixedToCamera = true;
}

let costLifeText;
let costRunText;

function updateMenuButtons() {
    //menuGroup.buyWeapon1Button = (weapon1Bought ? () => {game.add.button(game.canvas.width - 50, game.canvas.height/2 - 200, 'buyWeapon1Button');} : () => {game.add.button(game.canvas.width - 50, game.canvas.height/2 - 200, 'buyWeapon1Button', () => {buyItem('weapon1');})});
    menuGroup.getAt(0).inputEnabled = !weapon1Bought;
    menuGroup.getAt(0).alpha = (weapon1Bought ? 0.5 : 1);

    menuGroup.getAt(1).inputEnabled = !weapon2Bought;
    menuGroup.getAt(1).alpha = (weapon2Bought ? 0.5 : 1);

    menuGroup.getAt(2).inputEnabled = !weapon3Bought;
    menuGroup.getAt(2).alpha = (weapon3Bought ? 0.5 : 1);


    //para actualizar el texto de lo que cuesta la vida y lo que cuesta mejorar la velocidad

    costLifeText.setText(("Cost: " + costLife + " coins"));
    costRunText.setText(("Cost: " + costRun + " coins"));



}

function showMenu() {
    //game.paused = true;
    menuGroup.visible = true;
    updateCoinsText();
    updateMenuButtons();
}

function hideMenu() {
    //game.paused = false;
    menuGroup.visible = false;
}

function updateCoinsText() {
    menuGroup.coinsText.setText('Coins: ' + coins);
    hudCoins.setText(coins);
}

function buyItem(item) {
    if (coins >= itemCostArray[item]) {
        coins -= itemCostArray[item];
        switch (item) {
            case 0:
                if (!weapon1Bought) {
                    weapon1Bought = true;
                    weaponsBuy[1].bought = true;
                }
                hideMenu();
                break;
            case 1:
                if (!weapon2Bought) {
                    weapon2Bought = true;
                    weaponsBuy[2].bought = true;

                }
                hideMenu();
                break;
            case 2:
                if (!weapon3Bought) {
                    weapon3Bought = true;
                    weaponsBuy[3].bought = true;
                }
                hideMenu();
                break;
        }
        // Aquí añadir lógica para cambiar armas al jugador
        // Por ejemplo: equipWeapon(item);
    } else {
    }
    updateMenuButtons();
    updateCoinsText();
}



function upgradeSpeed() {
    if (coins >= costRun) {
        coins -= costRun;
        playerSpeed += 25;
        costRun += 70;
    } else {
    }
    hideMenu();

    updateCoinsText();
}



function upgradeHealth() {
    if (coins >= costLife) {
        coins -= costLife;
        maxHealth += 30;
        healthValue = maxHealth;
        // Restaura la salud al máximo
        costLife += 50;
        updateHealthBar();
    } else {
    }
    hideMenu();

    updateCoinsText();
}


function exitAnimationToFinal(a) {
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5, 0.5);
    img5.scale.setTo(20);
    img5.alpha = 0;
    soundPlayBG.stop();

    mainTween = game.add.tween(img5).to({
        alpha: 1
    }, 500, Phaser.Easing.Cubic.Out);
    mainTween.onComplete.add(a);
    mainTween.start();
}



function endGame(victory) {
    remainingTime = 100;
    // añadir if conforme a al vida para decidir si es true o false la variable winOrLose
    winOrLose = victory;
    game.state.start('screenFinal');
}




function checkRechargeArea(area) {

    let weapon = weaponsBuy[currentWeapon];
    hudInteractText.setText("Press [E] or [-] to recharge.");
    game.physics.arcade.isPaused = true;
    timerClock.timer.pause();
    if (keys.reload.e.isDown || keys.reload.underscore.isDown) {
        weaponsBuy.forEach(weapon => {
            weapon.ammo = weapon.maxAmmo;
        });

        hudAmmo.setText(weapon.ammo + "/" + weapon.maxAmmo);
        area.kill();
        game.physics.arcade.isPaused = false;
        timerClock.timer.resume();
        hudInteractText.setText("");
    }


}

