import { Physics, Math } from "phaser";

export class Enemy extends Physics.Arcade.Sprite {
    speed = 1;
    constructor({ scene, x, y, player }) {
        super(scene, x, y, 'enemy-big', 0);
        const randomeScale = Math.Between(1, 3);
        this.scale = randomeScale;
        this.setScale(randomeScale);
        scene.add.existing(this);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.texture = 'enemy';
        this.player = player;
        
        
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDrag(100);
        this.health = 100;

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy-big', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.play('idle');
        
        this.scene.anims.create({
            key: 'enemyDeath',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        })
    }

    die() {
        this.visible = false;
        var explosion = this.scene.add.sprite(this.x, this.y, 'explosion');
        explosion.setScale(this.scaleX, this.scaleY);
        explosion.play('enemyDeath')
        explosion.once('animationcomplete', () => {
            this.destroy();
            explosion.destroy();
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();  // Remove enemy from the scene when health is 0
        }
    }

    update(time, delta) {
        // Move towards the player
        this.end_direction = new Math.Vector2(this.player.x - this.x, this.player.y - this.y ).normalize();
        this.x += 2 * this.end_direction.x;
        this.y += 2 * this.end_direction.y;
    }

}