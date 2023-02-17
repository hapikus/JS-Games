class Player extends Sprite {
    constructor({
        position, 
        collisionBLocks, 
        platformCollisionBLocks, 
        imageSrc, 
        frameRate, 
        frameBuffer, 
        scale = 0.5, 
        animations,
    }) {
        super({imageSrc, frameRate, frameBuffer, scale});
        this.position = position;

        this.velocity = {
            x: 0,
            y: 1,
        }

        this.collisionBLocks = collisionBLocks;
        this.platformCollisionBLocks = platformCollisionBLocks;

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 12,
            height: 26,
        }

        this.animations = animations;
        this.lastDirection = 'right';


        for (let key in this.animations) {
            let image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }

        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }

        this.score = 0;
    };

    switchSprite(key) {
        if (this.loaded === false || this.image === this.animations[key].image) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;      
        this.frameRate = this.animations[key].frameRate;
        this.frameBuffer = this.animations[key].frameBuffer;
    }

    shouldPanCameraToTheLeft({ canvas, camera }) {
        let cameraBoxRightSide = this.camerabox.position.x + this.camerabox.width;
        let scaleDownCanvasWidth = canvas.width / 4;

        if (cameraBoxRightSide >= 576 - 1) return;

        if (cameraBoxRightSide >= scaleDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= hero.velocity.x;
        }
    }

    shouldPanCameraToTheRight({ canvas, camera }) {
        if (this.camerabox.position.x <= 1) return;

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= hero.velocity.x;
        }
    }

    shouldPanCameraToTheDown({ canvas, camera }) {
        if (this.camerabox.position.y + this.velocity.y <= 0) return;

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= hero.velocity.y;
        }
    }

    shouldPanCameraToTheUp({ canvas, camera }) {
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432 ) return;

        let scaledCanvasHeight = canvas.height / 4;

        if (
            this.camerabox.position.y + this.camerabox.height >= 
            Math.abs(camera.position.y) + scaledCanvasHeight
        ) {
            camera.position.y -= hero.velocity.y;
        }
    }

    update() {
        this.updateFrames();
        this.updateHitbox();
        this.updateCameraBox();

        // // green box
        // board.fillStyle = 'rgba(0, 255, 0, 0.2)';
        // board.fillRect(this.position.x, this.position.y, this.width, this.height);

        // // camerabox
        // board.fillStyle = 'rgba(255, 0, 0, 0.2)';
        // board.fillRect(
        //     this.camerabox.position.x, 
        //     this.camerabox.position.y, 
        //     this.camerabox.width, 
        //     this.camerabox.height,
        // );

        // hitbox 
        // board.fillStyle = 'rgba(0, 0, 255, 0.5)';
        // board.fillRect(
        //     this.hitbox.position.x, 
        //     this.hitbox.position.y, 
        //     this.hitbox.width, 
        //     this.hitbox.height
        // );

        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkItemCollision();

        this.checkHorizontalCollisions();
        this.applayGravity();

        this.updateHitbox();
        this.checkItemCollision();
        this.checkVerticalCollisions();


    }

    updateHitbox() {
        this.hitbox.position.x  = this.position.x + 35;
        this.hitbox.position.y  = this.position.y + 27;
    }

    updateCameraBox() {
        this.camerabox.position.x  = this.position.x - 50;
        this.camerabox.position.y  = this.position.y;
    }

    applayGravity() {
        if (this.velocity.y <= 9 ) this.velocity.y += gravity; 
        this.position.y += this.velocity.y;
    }

    checkForHorizontalCanvasCollisions() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
            this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0;
        }
    }

    checkVerticalCollisions() {
        // ground
        for (let i = 0; i < this.collisionBLocks.length; i++) {
            let currentBlock = this.collisionBLocks[i];

            if (
                collision({
                    object1: this.hitbox, 
                    object2: currentBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    let offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = currentBlock.position.y - offset - 0.01;
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;

                    let offset = this.hitbox.position.y - this.position.y;

                    this.position.y = currentBlock.position.y + currentBlock.height - offset + 0.01;
                    break
                }
            }
        }

        // platforms
        for (let i = 0; i < this.platformCollisionBLocks.length; i++) {
            let currentBlock = this.platformCollisionBLocks[i];

            if (
                platforCollision({
                    object1: this.hitbox, 
                    object2: currentBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    let offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = currentBlock.position.y - offset - 0.01;
                    break
                }
            }
        }
    }

    checkHorizontalCollisions() {
        for (let i = 0; i < this.collisionBLocks.length; i++) {
            let currentBlock = this.collisionBLocks[i];

            if (
                collision({
                    object1: this.hitbox, 
                    object2: currentBlock,
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;

                    let offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

                    this.position.x = currentBlock.position.x - offset - 0.01;
                    break
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;

                    let offset = this.hitbox.position.x - this.position.x;

                    this.position.x = currentBlock.position.x + currentBlock.width - offset + 0.01;
                    break
                }
            }
        }
    }

    checkItemCollision() {
        for (let i = 0; i < itemArray.length; i++) {
            if (
                collision({
                    object1: this.hitbox, 
                    object2: itemArray[i].hitbox,
                })
            ) {

                let ind = currentCoordinates.indexOf(itemArray[i].spawnSlot);
                currentCoordinates.splice(ind, 1);
                
                this.score += itemArray[i].score;
                document.getElementById('score').innerText = this.score;
                
                itemArray.splice(i, 1);
                return
            }
        }
    }
}
