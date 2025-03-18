import { Scene, Math } from 'phaser';
import { Player } from '../gameobjects/Player.js';
import { Enemy } from '../gameobjects/Enemy.js';
import { SmallEnemy } from '../gameobjects/SmallEnemy.js';
import { Bullet } from '../gameobjects/Bullet.js';

const enemySpawnRate = 500;
export class Game extends Scene {
    cursors = null;
    pointer = null;
    tile = null;
    player = null;

    constructor ()
    {
        super('Game');
    }

    init() {
        this.score = 0;
        this.tile = null;
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
        

    create (){
        this.tile = this.add.tileSprite(0, 0 , 0 , 0, 'bg-hearth');
        this.scaleTileX = this.scale.displaySize.width / this.tile.width ;
        this.scaleTileY = this.scale.displaySize.height/ this.tile.height;
        
        // this.tileClouds = this.add.tileSprite(0, 0 , this.scale.displaySize.width , this.scale.displaySize.height, 'clouds');
        this.tileCloudsTransparent = this.add.tileSprite(0, 0 , this.scale.displaySize.width , this.scale.displaySize.height, 'clouds-transparent');

        // this.tileClouds.setOrigin(0, 0);

        this.tileCloudsTransparent.setOrigin(0, 0);

        this.tile.scaleX = this.scaleTileX;
        this.tile.scaleY = this.scaleTileY;
        this.tile.setOrigin(0, 0);
        var actualWidth = this.scale.width;
        var actualHeight = this.scale.height;
    
        // Get the scale factors (scaling ratio)
        var scaleX = this.scale.displayScaleX;
        var scaleY = this.scale.displayScaleY;
    
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
        });

        this.healthText = this.add.text(16, 48, 'Health: 100', {
            fontSize: '32px',
            fill: '#fff'
        });
        
        this.player = new Player({scene: this, x: 512, y: 384});
        this.cursors = this.input.keyboard.createCursorKeys();
        // drag the player
        
        this.pointer = this.input.activePointer;
        this.enemies = this.physics.add.group({
            maxSize: 100,
            runChildUpdate: true
        });

        this.time.addEvent({
            delay: enemySpawnRate,            // Time in milliseconds (5000 ms = 5 seconds)
            callback: () => {
                // Generate random x and y coordinates within the game bounds   
                const x = Math.Between(50, this.scale.width - 50);  // Random x within game width
                const y = 0; // Random y within game height

                // Add the new enemy to the enemies group
                this.enemies.add(new Enemy(this, x,y)); 
                
            },
            loop: true               // Keep repeating the event
        });

        this.physics.add.collider(this.player, this.enemies, (player, enemy) => { 
            player.takeDamage(10);
            enemy.die();
            this.healthText.setText('Health: ' + this.player.health);
        });

        this.physics.add.overlap(this.player.bullets, this.enemies, (bullet, enemy) => {
            enemy.takeDamage(bullet.damage);
            
            bullet.destroy();
        });

        this.explosion = this.add.sprite(this.x, this.y, 'explosion')
        this.explosion.setScale(this.scaleX, this.scaleY);
        this.explosion.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: 0
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

    enemyExploded(enemy) {
        this.explosion.x = enemy.x;
        this.explosion.y = enemy.y;
        this.explosion.visible = true;
        this.explosion.scaleX = enemy.scaleX;
        this.explosion.scaleY = enemy.scaleY;
        this.explosion.anims.play('explode').once('animationcomplete', () => {
            this.explosion.visible = false;
        }
        );
    }


    update() {
        this.tile.tilePositionY -= 0.5;
        // this.tileClouds.tilePositionY -= 1;
        this.tileCloudsTransparent.tilePositionY -= 4;
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
