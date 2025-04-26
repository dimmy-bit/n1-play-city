const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let rocket;

function preload() {
    this.load.image('rocket', 'assets/rocket.png');
    this.load.image('asteroid', 'assets/asteroid.png');
    this.load.image('bg', 'assets/city-bg.jpg');
}

function create() {
    // Add background
    const bg = this.add.image(0, 0, 'bg');
    bg.setOrigin(0, 0);
    bg.setDisplaySize(window.innerWidth, window.innerHeight);
    
    // Add rocket with physics
    rocket = this.physics.add.sprite(100, this.cameras.main.centerY, 'rocket');
    rocket.setScale(0.1);
    rocket.setCollideWorldBounds(true);
    
    // Enable input
    this.input.on('pointermove', function (pointer) {
        if (pointer.isDown || pointer.active) {
            rocket.y = Phaser.Math.Clamp(pointer.y, 50, window.innerHeight - 50);
        }
    });

    // Touch input for mobile
    this.input.on('pointerdown', function (pointer) {
        rocket.y = Phaser.Math.Clamp(pointer.y, 50, window.innerHeight - 50);
    });

    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create asteroids group with physics
    let asteroids = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        let x = window.innerWidth + i * 200;
        let y = Phaser.Math.Between(50, window.innerHeight - 50);
        let asteroid = asteroids.create(x, y, 'asteroid');
        asteroid.setScale(0.05);
        asteroid.setAngle(Phaser.Math.Between(0, 360));
    }

    // Add collision detection
    this.physics.add.overlap(rocket, asteroids, gameOver, null, this);

    // Asteroid movement
    this.tweens.add({
        targets: asteroids.getChildren(),
        x: -50,
        duration: 3000,
        repeat: -1,
        onRepeat: (tween, target) => {
            target.x = window.innerWidth;
            target.y = Phaser.Math.Between(50, window.innerHeight - 50);
            target.setAngle(Phaser.Math.Between(0, 360));
        }
    });

    // Timer for level completion
    this.time.addEvent({
        delay: 10000,
        callback: levelComplete,
        callbackScope: this
    });
}

function update() {
    // Keyboard controls
    if (this.cursors.up.isDown) {
        rocket.y -= 5;
    } else if (this.cursors.down.isDown) {
        rocket.y += 5;
    }
    
    // Keep rocket within bounds
    rocket.y = Phaser.Math.Clamp(rocket.y, 50, window.innerHeight - 50);
}

function gameOver() {
    this.scene.restart();
}

function levelComplete() {
    this.add.text(window.innerWidth/2, window.innerHeight/2, 'N1Chain is Blazing Fast!', {
        fontSize: '32px',
        color: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.time.addEvent({
        delay: 2000,
        callback: () => {
            window.location.href = 'quiz1.html';
        }
    });
} 