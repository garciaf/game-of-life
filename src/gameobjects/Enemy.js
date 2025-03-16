import { Physics, Math } from "phaser";

export class Enemy extends Physics.Arcade.Sprite {
    constructor({ scene, x, y}) {
        super(scene, x, y, 'blob', 0);
        const randomeScale = Math.Between(1, 3);
        this.setScale(randomeScale);
        scene.add.existing(this);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.texture = 'enemy';
        
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDrag(100);

        this.health = 100;
        this.setCircle(6, 20, 25);

        this.anims.create({
            key: 'enemyDeath',
            frames: this.anims.generateFrameNumbers('blob', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        
    }
    


    die() {
        this.setCollideWorldBounds(false);
        this.anims.play('enemyDeath');
        this.once('animationcomplete', () => {
            this.destroy();
        });
    }


    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();  // Remove enemy from the scene when health is 0
        }
    }

}