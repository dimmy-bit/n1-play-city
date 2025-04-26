const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game;
let score = 0;
let buildingsPlaced = 0;
let scoreText;
let guideText;

// Wait for the DOM to be ready
window.onload = function() {
    game = new Phaser.Game(config);
};

function preload() {
    try {
        // Add loading text
        const loadingText = this.add.text(400, 300, 'Loading...', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Load assets
        this.load.image('building', 'assets/building.png');
        this.load.image('bg', 'assets/city-bg.jpg');

        // Show loading progress
        this.load.on('progress', (value) => {
            loadingText.setText(`Loading... ${Math.floor(value * 100)}%`);
        });

        this.load.on('complete', () => {
            loadingText.destroy();
        });

        // Error handling
        this.load.on('loaderror', (file) => {
            console.error('Error loading file:', file.src);
            loadingText.setText('Error loading game assets!\nPlease refresh the page');
        });
    } catch (error) {
        console.error('Error in preload:', error);
    }
}

function create() {
    try {
        // Check if assets are loaded
        if (!this.textures.exists('bg') || !this.textures.exists('building')) {
            console.error('Required assets not loaded');
            this.add.text(400, 300, 'Error: Missing assets\nPlease refresh the page', {
                fontSize: '24px',
                fill: '#ff0000',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
            return;
        }

        // Add background
        const bg = this.add.image(400, 300, 'bg');
        bg.setDisplaySize(800, 600);

        // Add title
        this.add.text(400, 30, 'Scale City Builder', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Score display
        scoreText = this.add.text(700, 30, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0.5);

        // Building placement positions
        const positions = [
            { x: 200, y: 450 },
            { x: 300, y: 400 },
            { x: 400, y: 350 },
            { x: 500, y: 400 },
            { x: 600, y: 450 }
        ];

        // Add building placement markers
        positions.forEach(pos => {
            const marker = this.add.rectangle(pos.x, pos.y, 60, 60, 0x00ff00, 0.3);
            marker.setStrokeStyle(2, 0x00ff00);
        });

        // Guide text
        guideText = this.add.text(400, 550, 'Click to place buildings\nBuild your city skyline!', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5);

        // Handle clicks
        this.input.on('pointerdown', (pointer) => {
            if (buildingsPlaced < positions.length) {
                const pos = positions[buildingsPlaced];
                
                // Create building with animation
                const building = this.add.sprite(pos.x, pos.y - 100, 'building');
                building.setScale(0.1);
                
                // Animate building placement
                this.tweens.add({
                    targets: building,
                    y: pos.y,
                    scale: 0.15,
                    duration: 800,
                    ease: 'Bounce.easeOut',
                    onComplete: () => {
                        // Add sparkle effect
                        const sparkle = this.add.rectangle(pos.x, pos.y, 70, 70, 0xffff00, 0.5);
                        this.tweens.add({
                            targets: sparkle,
                            alpha: 0,
                            scale: 1.5,
                            duration: 500,
                            onComplete: () => sparkle.destroy()
                        });
                        
                        score += 20;
                        scoreText.setText('Score: ' + score);
                    }
                });

                buildingsPlaced++;
                
                // Update guide text
                if (buildingsPlaced < positions.length) {
                    guideText.setText(`${positions.length - buildingsPlaced} buildings remaining\nKeep building!`);
                } else {
                    // Level complete
                    guideText.setText('City Complete!');
                    
                    // Show completion message
                    this.add.text(400, 300, 'Level Complete!\nYour City is Built!', {
                        fontSize: '48px',
                        fill: '#ffffff',
                        backgroundColor: '#000000',
                        padding: { x: 20, y: 10 },
                        align: 'center'
                    }).setOrigin(0.5);

                    // Show quiz preparation message and transition
                    this.time.delayedCall(2000, () => {
                        this.add.text(400, 400, 'Preparing Quiz...', {
                            fontSize: '32px',
                            fill: '#00ff00',
                            backgroundColor: '#000000',
                            padding: { x: 20, y: 10 },
                            align: 'center'
                        }).setOrigin(0.5);

                        // Transition to quiz
                        this.time.delayedCall(1500, () => {
                            window.location.href = 'quiz3.html';
                        });
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error in create:', error);
        this.add.text(400, 300, 'Error: Game initialization failed\nPlease refresh the page', {
            fontSize: '24px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
    }
} 