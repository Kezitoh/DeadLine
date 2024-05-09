const MAX_HEALTH = 100;
const DEFAULT_TIME = 60;

let playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel
};

let hudGroup, healthBar, healthValue, healthTween, hudTime, hudScore, hudDifficulty;
let remainingTime;
let score;
let difficulty = "Normal"; //esto no irá aquí en el futuro, irá en pantalla de inicio
const DIFFICULTY = {Normal : 0, Easy: 1, Hard: 2};
function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
}

function loadSprites() {
    game.load.spritesheet('pc', '../assets/sprites/spritesheet_characters.png')
    game.add.sprite();
}

function loadImages() {
    game.load.image('heart', '../assets/UI/heart.png');
    game.load.image('healthBar', '../assets/UI/health_bar.png');
    game.load.image('healthHolder', '../assets/UI/health_holder.png');
}

function loadSounds() {

}

function loadLevel(level) {

}

function createLevel() {
    setDifficulty(difficulty);
    remainingTime = DEFAULT_TIME;
    createHUD();
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
    player = game.add.sprite(game.world.width/2, game.world.height/2, soldier);
    game.camera.follow(player);
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

function updateLevel() {
    // if(healthValue > 50) {
    //     healthValue--;
    //     updateHealthBar();
    // }else if(score <= 105) {
    //     score +=2;
    //     updateScore();
    // }
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
