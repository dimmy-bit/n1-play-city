const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Add loading text
    const loadingText = this.add.text(400, 300, 'Loading...', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

    this.load.image('coin', 'assets/coin.png');
    this.load.image('rocket', 'assets/rocket.png');
    this.load.image('bg', 'assets/city-bg.jpg');

    this.load.on('loaderror', (file) => {
        loadingText.setText('Error loading: ' + file.key);
    });
    this.load.on('complete', () => {
        loadingText.destroy();
    });
}

function create() {
    this.add.image(400, 300, 'bg');
    this.player = this.physics.add.sprite(100, 300, 'rocket').setScale(0.1);
    this.player.setCollideWorldBounds(true);
    this.coins = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        let coin = this.coins.create(x, y, 'coin').setScale(0.05);
        this.tweens.add({
            targets: coin,
            scale: 0.06,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    this.physics.add.overlap(this.player, this.coins, collectCoin, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();
}

function collectCoin(player, coin) {
    coin.destroy();
    if (this.coins.countActive() === 0) {
        this.add.text(400, 300, 'N1 Makes It Simple!', {
            fontSize: '32px',
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                window.location.href = 'quiz4.html';
            }
        });
    }
}

function update() {
    if (!this.player || !this.cursors) return;
    const player = this.player;
    player.setVelocity(0);
    if (this.cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        player.setVelocityX(160);
    }
    if (this.cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
        player.setVelocityY(160);
    }
}
