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
  // Load your assets here
  this.load.image('background', 'assets/background.jpg');
  this.load.image('character', 'assets/character.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('collision', 'assets/collision.png');
  this.load.audio('collisionSound', 'assets/collision_sound.mp3'); // Optional: Add a collision sound
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
      ball.x -= ball.speed;
      if (ball.x < 0) {
          ball.destroy();
      }
  });

  this.enemies.children.iterate(enemy => {
      enemy.x += enemy.speed;
      if (enemy.x > 800) {
          enemy.destroy();
      }
  });

  // Check for collision
  this.physics.overlap(this.character, this.enemies, this.handleCollision, null, this);

  // Update score text
  this.scoreText.setText('Score: ' + this.score);

  // Show message when the game ends
  if (this.enemies.isEmpty) {
      this.messageText.setVisible(true);
  }
}

function createBall() {
  const ball = this.physics.add.sprite(this.character.x, this.character.y, 'ball');
  ball.setVelocityX(-200); // Adjust the ball speed
  this.balls.add(ball);
}

function createEnemy() {
  const enemy = this.physics.add.sprite(0, Phaser.Math.Between(0, 550), 'enemy');
  enemy.setVelocityX(100); // Adjust the enemy speed
  this.enemies.add(enemy);
}

function handleCollision(ball, enemy) {
  ball.destroy();
  enemy.destroy();
  this.score++;
  this.collisionSound.play(); // Play the collision sound (if added)
}