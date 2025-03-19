import { GameObjects, Physics } from "phaser";
import { Bullet } from "./Bullet.js";
import { EventBus } from '../EventBus.js';

const velocity = 300;
const health = 100;

export class Player extends Physics.Arcade.Sprite {
    bullets = null;
    
    constructor({ scene, x, y}) {
        super(scene, x, y, 'spaceship');
        scene.add.existing(this);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.texture = 'player';
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.health = health;
        this.setDrag(100);
        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });
        this.setScale(2);
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 6 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.play('idle');
        this.rotation = Math.PI / 2;
    }

    takeDamage(damage) {
        this.health -= damage;
        this.shake();
        EventBus.emit('PlayerTookDamage', damage);

        if (this.health <= 0) {
            EventBus.emit('PlayerDied');
        }
    }

    shake() {
        this.scene.tweens.add({
            targets: this,
            repeat: 2,
            duration: 50,
            x: this.x + Math.random() ,  // Shake effect
            yoyo: true,
            onRepeat: () => {
                if (this.tintTopLeft === 0xffffff) {
                    this.setTint(0xff0000);
                } else {
                    this.clearTint();
                }
            },
            onComplete: () => {
                this.clearTint();
            }   
        });
    }


    move(direction) {
        switch (direction) {
            case 'up':
                this.angle -= 10;
                break;
            case 'down':
                this.angle += 10;
                break;
            case 'left':
                this.angle -= 10;
                break;
            case 'right':
                this.angle += 10;
                break;
            default:
                break;
        }
    }

    fire(x, y, pointerX, pointerY) {
        const bullet = this.bullets.get();
        if (bullet) {
            bullet.fire(this.x, this.y, pointerX, pointerY);
        }
    }

    lookAt(x, y) {
        this.rotation = Math.atan2(y - this.y, x - this.x);
    }

    accelerate() {
        this.scene.physics.velocityFromRotation(this.rotation, velocity, this.body.acceleration);
    }

    decelerate() {
        this.setAcceleration(0);
    }
}