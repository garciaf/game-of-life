import { Scene, Math } from 'phaser';
import { Player } from '../gameobjects/Player.js';
import { Enemy } from '../gameobjects/Enemy.js';
import { Bullet } from '../gameobjects/Bullet.js';

const enemySpawnRate = 500;
export class Game extends Scene {
    cursors = null;
    pointer = null;

    constructor ()
    {
        super('Game');
    }

    init() {
        this.score = 0;
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create (){
        const background = this.add.image(0, 0, 'bg-hearth');
        background.setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;
        // Create a score text object at the top of the screen
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
        });
        
        this.player = new Player({scene: this, x: 512, y: 384});
        this.cursors = this.input.keyboard.createCursorKeys();
        // drag the player
        
        this.pointer = this.input.activePointer;
        this.enemies = this.physics.add.group();
        this.time.addEvent({
            delay: enemySpawnRate,            // Time in milliseconds (5000 ms = 5 seconds)
            callback: () => {
                // Generate random x and y coordinates within the game bounds   
                const x = Math.Between(50, this.scale.width - 50);  // Random x within game width
                const y = Math.Between(50, this.scale.height - 50); // Random y within game height

                // Add the new enemy to the enemies group
                this.enemies.add(new Enemy({scene: this, x: x, y: y})); 
                
            },
            loop: true               // Keep repeating the event
        });

        this.physics.add.collider(this.player, this.enemies, (player, enemy) => { 
            this.enemyDestroyed(enemy);
        });

        this.physics.add.overlap(this.player.bullets, this.enemies, (bullet, enemy) => {
            this.enemyDestroyed(enemy);
            bullet.destroy();
        });

    }

    enemyDestroyed(enemy) {
        // Increment score
        this.enemies.remove(enemy);
        this.score += 10;

        // Update the score text
        this.scoreText.setText('Score: ' + this.score);

        // Destroy the enemy
        enemy.die();
    }


    update() {
        // I want an anemy to spawn every 5 seconds

        // This is called every frame
        if (this.cursors.up.isDown) {
            this.player.move('up');
        }
        if (this.cursors.down.isDown) {
            this.player.move('down');
        }
        if (this.cursors.left.isDown) {
            this.player.move('left');
        }
        if (this.cursors.right.isDown) {
            this.player.move('right');
        }

        if (this.pointer.isDown) {
            this.player.lookAt(this.pointer.x, this.pointer.y);
        }

        if (this.cursors.space.isDown) {
            this.player.accelerate();
        } else {
            this.player.decelerate();
        }

        if (this.pointer.isDown) {
            this.player.fire(this.pointer.x, this.pointer.y, this.pointer.x, this.pointer.y);
        }
    }

}
