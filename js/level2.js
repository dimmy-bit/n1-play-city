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

const game = new Phaser.Game(config);
let score = 0;
let currentType = 'TypeScript';
let blockCount = 0;
let assetsLoaded = false;

function preload() {
    // Add loading text
    const loadingText = this.add.text(400, 300, 'Loading...', {
        fontSize: '32px',
        fill: '#ffffff'
    }).setOrigin(0.5);

    // Load images
    try {
        this.load.image('bg', 'assets/city-bg.jpg');
        this.load.image('code-block', 'assets/code-block.png');
    } catch (error) {
        console.error('Error in preload:', error);
        loadingText.setText('Error loading assets!\nPlease check console and refresh.');
        return;
    }

    // Show loading progress
    this.load.on('progress', (value) => {
        loadingText.setText(`Loading... ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
        assetsLoaded = true;
        loadingText.destroy();
    });

    this.load.on('loaderror', (fileObj) => {
        console.error('Error loading:', fileObj.src);
        loadingText.setText('Error: Could not load ' + fileObj.key + '\nPlease refresh');
    });
}

function create() {
    // Check if assets are loaded
    if (!this.textures.exists('bg') || !this.textures.exists('code-block')) {
        console.error('Required assets not loaded');
        this.add.text(400, 300, 'Error: Missing assets\nPlease refresh the page', {
            fontSize: '24px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5);
        return;
    }

    try {
        // Add background
        const bg = this.add.image(400, 300, 'bg');
        bg.setDisplaySize(800, 600);

        // Score display
        const scoreText = this.add.text(700, 30, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0.5);

        // Create code blocks sections
        const blockTypes = [
            { name: 'TypeScript', color: 0x007ACC, y: 150 },
            { name: 'Solidity', color: 0x5B5B5B, y: 280 },
            { name: 'Rust', color: 0xF74C00, y: 410 }
        ];

        blockTypes.forEach(type => {
            // Section label
            this.add.text(150, type.y - 45, type.name, {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);

            // Create blocks
            for (let i = 0; i < 4; i++) {
                const block = this.add.image(
                    80 + (i % 2) * 120,
                    type.y - 10 + Math.floor(i / 2) * 50,
                    'code-block'
                ).setInteractive({ draggable: true });
                
                block.setScale(0.08);
                block.setTint(type.color);
                block.type = type.name;
            }
        });

        // Create drop zone
        const dropZone = this.add.zone(600, 300, 200, 400).setRectangleDropZone(200, 400);
        
        // Add visible drop zone outline
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0x00ff00);
        graphics.strokeRect(
            dropZone.x - dropZone.input.hitArea.width / 2,
            dropZone.y - dropZone.input.hitArea.height / 2,
            dropZone.input.hitArea.width,
            dropZone.input.hitArea.height
        );

        // Drop zone text
        const dropText = this.add.text(600, 130, 'Drop TypeScript\nBlocks Here', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5);

        // Progress text
        const progressText = this.add.text(400, 550, 'Progress: TypeScript → Solidity → Rust', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setScale(0.1);
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setScale(0.08);
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (gameObject.type === currentType) {
                score += 10;
                scoreText.setText('Score: ' + score);
                gameObject.destroy();
                blockCount++;
                
                if (blockCount >= 4) {
                    blockCount = 0;
                    if (currentType === 'TypeScript') {
                        currentType = 'Solidity';
                        dropText.setText('Drop Solidity\nBlocks Here');
                        progressText.setText('Progress: ✓ TypeScript → Solidity → Rust');
                        
                        // Transition message
                        const message = this.add.text(400, 300, 'TypeScript Complete!\nNow collect Solidity blocks', {
                            fontSize: '32px',
                            fill: '#00ff00',
                            backgroundColor: '#000000',
                            padding: { x: 20, y: 10 },
                            align: 'center'
                        }).setOrigin(0.5);
                        
                        // Fade out message
                        this.tweens.add({
                            targets: message,
                            alpha: 0,
                            duration: 2000,
                            ease: 'Power2',
                            onComplete: () => message.destroy()
                        });
                    } else if (currentType === 'Solidity') {
                        currentType = 'Rust';
                        dropText.setText('Drop Rust\nBlocks Here');
                        progressText.setText('Progress: ✓ TypeScript → ✓ Solidity → Rust');
                        
                        // Transition message
                        const message = this.add.text(400, 300, 'Solidity Complete!\nNow collect Rust blocks', {
                            fontSize: '32px',
                            fill: '#00ff00',
                            backgroundColor: '#000000',
                            padding: { x: 20, y: 10 },
                            align: 'center'
                        }).setOrigin(0.5);
                        
                        // Fade out message
                        this.tweens.add({
                            targets: message,
                            alpha: 0,
                            duration: 2000,
                            ease: 'Power2',
                            onComplete: () => message.destroy()
                        });
                    } else {
                        // Game complete
                        progressText.setText('Progress: ✓ TypeScript → ✓ Solidity → ✓ Rust');
                        dropText.destroy(); // Remove drop zone text
                        
                        // Show completion message
                        const completionText = this.add.text(400, 300, 'Level Complete!\nScore: ' + score, {
                            fontSize: '48px',
                            fill: '#ffffff',
                            backgroundColor: '#000000',
                            padding: { x: 20, y: 10 },
                            align: 'center'
                        }).setOrigin(0.5);

                        // Show preparing quiz message after a delay
                        this.time.delayedCall(2000, () => {
                            const quizText = this.add.text(400, 400, 'Preparing Quiz...', {
                                fontSize: '32px',
                                fill: '#00ff00',
                                backgroundColor: '#000000',
                                padding: { x: 20, y: 10 },
                                align: 'center'
                            }).setOrigin(0.5);

                            // Redirect to quiz after showing the message
                            this.time.delayedCall(1500, () => {
                                window.location.href = 'quiz2.html';
                            });
                        });
                    }
                }
            } else {
                // Wrong block type
                const errorMessage = this.add.text(400, 200, 
                    'Wrong Block Type!\nNeed ' + currentType + ' blocks', {
                    fontSize: '24px',
                    fill: '#ff0000',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 5 },
                    align: 'center'
                }).setOrigin(0.5);

                // Fade out error message
                this.tweens.add({
                    targets: errorMessage,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2',
                    onComplete: () => errorMessage.destroy()
                });
            }
        });

    } catch (error) {
        console.error('Error in create:', error);
        this.add.text(400, 300, 'Error: Game initialization failed\nPlease refresh the page', {
            fontSize: '24px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5);
    }
} 