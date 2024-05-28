const PLAYER_VELOCITY = 150;
const MAX_HEALTH = 100;
const DEFAULT_TIME = 30;
const SZCOOLDOWN = 5000;

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

const TIEMPO_DENTRO_ZONA_SEGURA = 10;

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
let remainingSZTime;
let score;
/** @type {Phaser.Sprite} */
let player;
/** @type {Phaser.CursorKeys} */
let cursors;
let wasd;
let nextShoot;
let cameraPosX;
let cameraPosY;

let safeZone;
let safeZone1;
let safeZone2;
let safeZone3;
let safeZone4;

let safeZoneTimeIn;

let timerClock;
let timerClock2;

let overlapSZ;

let soundSZ;

let nextEntry;

let weapon1Bought;
let weapon2Bought;
let weapon3Bought;

let velocidadJugador;




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
    game.load.image('negro', '../assets/UI/ImagenNegraParaTransicion.jpg');
    game.load.spritesheet('safeZone','../assets/UI/Zona_segura.png');
    game.load.spritesheet('safeZone1','../assets/UI/Zona_segura_abajo_derecha.png');
    game.load.spritesheet('safeZone2','../assets/UI/Zona_segura_abajo_izq.png');
    game.load.spritesheet('safeZone3','../assets/UI/Zona_segura_arriba_derecha.png');
    game.load.spritesheet('safeZone4','../assets/UI/Zona_segura_arriba_izq.png');


    game.load.spritesheet('buyWeapon1Button', '../assets/UI/heart.png');
    game.load.spritesheet('buyWeapon2Button', '../assets/UI/heart.png');
    game.load.spritesheet('buyWeapon3Button', '../assets/UI/heart.png');
    game.load.spritesheet('upgradeSpeedButton', '../assets/UI/heart.png');
    game.load.spritesheet('upgradeHealthButton', '../assets/UI/heart.png');
    game.load.spritesheet('exitButton', '../assets/UI/heart.png');

    //escopeta,pistola,machinegun

    game.load.spritesheet('weapon1','../assets/UI/Zona_segura_abajo_izq.png');
    game.load.spritesheet('weapon2','../assets/UI/Zona_segura_arriba_derecha.png');
    game.load.spritesheet('weapon3','../assets/UI/Zona_segura_arriba_izq.png');
}

function loadSounds() {
    game.load.audio('danger', '../assets/sounds/danger.wav');
}

function loadLevel(level) {
}


function createSounds(){
    soundSZ = game.add.audio('danger');
}




function createLevel() {
    createSounds();
    weapon1Bought = false;
    weapon2Bought = false;
    weapon3Bought = false;

    velocidadJugador = PLAYER_VELOCITY;
    overlapSZ = false;
    nextShoot = 0;
    nextEntry = 0;
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
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, () => {remainingTime = updateTime(hudTime,remainingTime, timerClock, setRemainingTime);}, this);

    player = game.add.sprite(game.world.width/2, game.world.height/2, 'pc');
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);

    player.body.collideWorldBounds = true;

    //game.add.sprite(game.world.width/2,game.world.height/2,"heart");

    createEnemies();

    zonaSegura();

    createHUD();

    createMenu();

    hideMenu();

    animacionEntrada();
}

function updateLevel() {
    choquesZonaSegura();

    //Cuando la vida valga cero llamara la  funcion salidafinal y pone winorlose en false
    if(healthValue == 0){

        winOrLose = false;
        animacionSalidaToFinal(() => {endGame();});
    }

    if((game.input.activePointer.isDown && !game.physics.arcade.overlap(player, safeZone)) || (game.input.activePointer.isDown && !menuGroup.visible)) {
        shoot();
    }


    characterMovement();
}

function zonaSegura(){
    safeZone = game.add.sprite(game.world.width/2, game.world.height/2, 'safeZone');
    safeZone1 = game.add.sprite(game.world.width/2+111, game.world.height/2+111, 'safeZone1');
    safeZone2 = game.add.sprite(game.world.width/2-112, game.world.height/2+106, 'safeZone2');
    safeZone3 = game.add.sprite(game.world.width/2+112, game.world.height/2-101, 'safeZone3');
    safeZone4 = game.add.sprite(game.world.width/2-107, game.world.height/2-104, 'safeZone4');
    safeZone.anchor.setTo(0.5,0.5);
    safeZone1.anchor.setTo(0.5,0.5);
    safeZone2.anchor.setTo(0.5,0.5);
    safeZone3.anchor.setTo(0.5,0.5);
    safeZone4.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(safeZone);
    game.physics.arcade.enable(safeZone1);
    game.physics.arcade.enable(safeZone2);
    game.physics.arcade.enable(safeZone3);
    game.physics.arcade.enable(safeZone4);
    safeZone.body.immovable = true;
    safeZone1.body.immovable = true;
    safeZone2.body.immovable = true;
    safeZone3.body.immovable = true;
    safeZone4.body.immovable = true;
}

function choquesZonaSegura(){
    //Cuando Entra a la zona segura

    if(game.time.now > nextEntry && !overlapSZ && game.physics.arcade.overlap(player, safeZone)) {

        overlapSZ = true;
        onSafeZoneOverlap();
        showMenu();

    } else if (!overlapSZ){
        game.physics.arcade.collide(player, safeZone);
    }

    if(remainingSZTime == 3){
        soundSZ.play();
        console.log("carapinga");

    }

    if(overlapSZ && !game.physics.arcade.overlap(player, safeZone)){
        nextEntry = game.time.now + SZCOOLDOWN;
    }

    if(!game.physics.arcade.overlap(player, safeZone)){
        overlapSZ = false;
        game.time.events.remove(timerClock2);
        safeZoneTimeIn.setText("");
        soundSZ.stop();
        hideMenu();
    }



    //game.physics.arcade.collide(enemy, safeZone);

    game.physics.arcade.collide(player, safeZone1);
    game.physics.arcade.collide(player, safeZone2);
    game.physics.arcade.collide(player, safeZone3);
    game.physics.arcade.collide(player, safeZone4);

    enemies.forEach(enemy =>{
        game.physics.arcade.collide(enemy, safeZone);
    });

}

function onSafeZoneOverlap() {
    safeZone.body.velocity.x = 0;
    safeZone.body.velocity.y = 0;

    remainingSZTime = TIEMPO_DENTRO_ZONA_SEGURA;

    timerClock2 = game.time.events.loop(Phaser.Timer.SECOND, () => {remainingSZTime = updateTime(safeZoneTimeIn, remainingSZTime, timerClock2, setRemainingTime2);}, this);


    safeZoneTimeIn = game.add.text(game.canvas.width/2, 100, setRemainingTime2(remainingSZTime), {
        font: 'bold 35pt',
        fill: '#ffffff'
    });


    safeZoneTimeIn.fixedToCamera = true;

    console.log("Player entered the safe zone!");

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
    maxHealth = MAX_HEALTH;
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
    healthValue = maxHealth;

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
        player.body.velocity.y = -velocidadJugador;
    }
    if(cursors.down.isDown || wasd.s.isDown){
        player.body.velocity.y = velocidadJugador;
    }
    if(cursors.left.isDown || wasd.a.isDown) {
        player.body.velocity.x = -velocidadJugador;
    }
    if(cursors.right.isDown || wasd.d.isDown) {
        player.body.velocity.x = velocidadJugador;
    }

}

function createEnemies() {
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.createMultiple(ENEMY_GROUP_SIZE, 'zombie');
    enemies.forEach((enemy)=>{
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.collideWorldBounds = true;
        enemyHealth = ENEMY_BASE_HEALTH;
    });
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
    healthTween = game.add.tween(healthBar.scale).to({x: healthValue/maxHealth, y: 1}, 300, Phaser.Easing.Cubic.Out);
    healthTween.start();

}

function setRemainingTime(seconds) {
    return String(Math.trunc(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
}

function setRemainingTime2(seconds) {
    return String(seconds % 60);
}


function updateTime(variableAcutalizar, valorActualizar, temporizador,funcionActulizado) {

    valorActualizar = Math.max(-1, valorActualizar -1);
    variableAcutalizar.setText(funcionActulizado(valorActualizar));
    if(valorActualizar < 0) {
        game.time.events.remove(temporizador);
        game.time.events.add(25,() => {animacionSalidaToFinal(() => {endGame();});} , this);
    }
    return valorActualizar;
}


function updateScore() {
    hudScore.setText((score +'').padStart(4,'0'))
}

let menuGroup;
let coins = 1000; // Inicia con algunas monedas para pruebas

function createMenu() {
    menuGroup = game.add.group();

    let buyWeapon1Button = game.add.button(game.canvas.width - 50, game.canvas.height/2 - 200, 'buyWeapon1Button', () => {buyItem('weapon1');});
    buyWeapon1Button.anchor.set(0.5);
    menuGroup.add(buyWeapon1Button);


    let buyWeapon2Button = game.add.button(game.canvas.width - 50, game.canvas.height/2 , 'buyWeapon2Button', () => {buyItem('weapon2');});
    buyWeapon2Button.anchor.set(0.5);
    menuGroup.add(buyWeapon2Button);


    let buyWeapon3Button = game.add.button(game.canvas.width - 50, game.canvas.height/2 + 200, 'buyWeapon3Button', () => {buyItem('weapon3');});
    buyWeapon3Button.anchor.set(0.5);
    menuGroup.add(buyWeapon3Button);


    let upgradeSpeedButton = game.add.button(50, game.canvas.height/2 - 200, 'upgradeSpeedButton', upgradeSpeed);
    upgradeSpeedButton.anchor.set(0.5);
    menuGroup.add(upgradeSpeedButton);

    let upgradeHealthButton = game.add.button(50, game.canvas.height/2, 'upgradeHealthButton', upgradeHealth);
    upgradeHealthButton.anchor.set(0.5);
    menuGroup.add(upgradeHealthButton);

    let exitButton = game.add.button(50, game.canvas.height/2 + 200, 'exitButton', hideMenu);
    exitButton.anchor.set(0.5);
    menuGroup.add(exitButton);

    // Mostrar monedas
    let coinsText = game.add.text(game.canvas.width/2, game.canvas.height/2 - 150, 'Coins: ' + coins, {
        font: 'bold 25pt',
        fill: '#ffffff'
    });
    coinsText.anchor.set(0.5);
    menuGroup.add(coinsText);

    menuGroup.coinsText = coinsText;
    menuGroup.fixedToCamera = true;
}

function updateMenuButtons() {
    //menuGroup.buyWeapon1Button = (weapon1Bought ? () => {game.add.button(game.canvas.width - 50, game.canvas.height/2 - 200, 'buyWeapon1Button');} : () => {game.add.button(game.canvas.width - 50, game.canvas.height/2 - 200, 'buyWeapon1Button', () => {buyItem('weapon1');})});
    menuGroup.getAt(0).inputEnabled = !weapon1Bought;
    menuGroup.getAt(0).alpha = (weapon1Bought ? 0.5 : 1);

    menuGroup.getAt(1).inputEnabled = !weapon2Bought;
    menuGroup.getAt(1).alpha = (weapon2Bought ? 0.5 : 1);

    menuGroup.getAt(2).inputEnabled = !weapon3Bought;
    menuGroup.getAt(2).alpha = (weapon3Bought ? 0.5 : 1);


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
}

function buyItem(item) {
    const itemCosts = {
        'weapon1': 300,
        'weapon2': 500,
        'weapon3': 700
    };

    if (coins >= itemCosts[item]) {
        coins -= itemCosts[item];
        switch(item) {
            case 'weapon1':
                if (!weapon1Bought) {
                    weapon1Bought = true;
                    // Lógica adicional para dar al jugador el arma 1
                }
                hideMenu();
                break;
            case 'weapon2':
                if (!weapon2Bought) {
                    weapon2Bought = true;
                    // Lógica adicional para dar al jugador el arma 2
                }
                hideMenu();
                break;
            case 'weapon3':
                if (!weapon3Bought) {
                    weapon3Bought = true;
                    // Lógica adicional para dar al jugador el arma 3
                }
                hideMenu();
                break;
        }
        console.log(item + ' bought!');
        // Aquí añadir lógica para cambiar armas al jugador
        // Por ejemplo: equipWeapon(item);
    } else {
        console.log('Not enough coins for ' + item);
    }
    updateMenuButtons();
    updateCoinsText();
}

let costRun;

function upgradeSpeed() {
    costRun += 70;
    if (coins >= costRun) {
        coins -= costRun;
        velocidadJugador += 20;
        console.log('Speed upgraded!');
    } else {
        console.log('Not enough coins to upgrade speed');
    }
    hideMenu();

    updateCoinsText();
}

let costLife = 40;

function upgradeHealth() {
    costLife += 50;
    if (coins >= costLife) {
        coins -= costLife;
        maxHealth += 10;
        healthValue = maxHealth;
         // Restaura la salud al máximo
        console.log('Health upgraded!');
        updateHealthBar();
    } else {
        console.log('Not enough coins to upgrade health');
    }
    hideMenu();

    updateCoinsText();
}


function animacionSalidaToFinal(a){
    img5 = game.add.image(game.canvas.width / 2, game.canvas.height / 2, 'negro');
    img5.anchor.setTo(0.5,0.5);
    img5.scale.setTo(20);
    img5.alpha = 0;

    mainTween = game.add.tween(img5).to({
        alpha: 1
    }, 500, Phaser.Easing.Cubic.Out);
    mainTween.onComplete.add(a);
    mainTween.start();
}



function endGame() {
    remainingTime = 100;
    // añadir if conforme a al vida para decidir si es true o false la variable winOrLose
    winOrLose = false;
    game.state.start('screenFinal');
}



