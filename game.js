<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game Title</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <script src="game.js"></script>
</head>
<body>
    <div id="game"></div>
    <script>
        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false // Set to true for debugging physics
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        var game = new Phaser.Game(config);

        function preload() {
            // Load your assets here  (Replace with your asset paths)
            this.load.image('background', 'assets/background.jpg');
            this.load.image('character', 'assets/character.png');
            this.load.image('enemy', 'assets/enemy.png');
            this.load.image('ball', 'assets/ball.png');
            this.load.image('collision', 'assets/collision.png');
            // Optional: Add a collision sound
        }

        function create() {
            this.add.image(400, 300, 'background');

            // Create the character
            this.character = this.physics.add.sprite(600, 300, 'character');
            this.character.setCollideWorldBounds(true); // Prevent character from going off screen

            // Create groups for balls and enemies
            this.balls = this.physics.add.group();
            this.enemies = this.physics.add.group();

            // Create a collider between balls and enemies
            this.physics.add.collider(this.balls, this.enemies, this.handleCollision, null, this);

            // Add a text for the score
            this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });

            // Add a text for the message
            this.messageText = this.add.text(700, 10, 'Felicidades, Raymond', { fontSize: '32px', fill: '#fff' });
            this.messageText.setVisible(false); // Hide the message initially

            // Load the collision sound (if added)
            this.collisionSound = this.sound.add('collisionSound');
        }

        function update() {
            // Handle character movement
            const speed = 3;
            if (this.cursors.left.isDown) {
                this.character.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.character.setVelocityX(speed);
            } else {
                this.character.setVelocityX(0);
            }

            if (this.cursors.up.isDown) {
                this.character.setVelocityY(-speed);
            } else if (this.cursors.down.isDown) {
                this.character.setVelocityY(speed);
            } else {
                this.character.setVelocityY(0);
            }

            // Create balls
            if (this.cursors.space.isDown && this.ballTimer <= 0) {
                this.createBall();
                this.ballTimer = 10; // Adjust the ball creation rate
            }
            this.ballTimer--;

            // Create enemies
            if (Phaser.Math.Between(1, 20) === 1) {
                this.createEnemy();
            }

            // Update balls and enemies
            this.balls.children.iterate(ball => {
                ball.x -= ball