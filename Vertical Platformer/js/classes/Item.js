class Item {
    constructor({
        position,
        imageSrc, 
        frameRate, 
        frameBuffer, 
        scale = 1,
        animations,
        spawnSlot,
        score,
    }) {
        this.position = position;

        this.scale = scale;

        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale;
            this.height = this.image.height * this.scale;
            this.loaded = true;
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0;

        this.hitbox = {
            position: {
                x: this.position.x + 6,
                y: this.position.y + 2,
            },
            width: 11,
            height: 10,
        }

        this.animations = animations;

        for (let key in this.animations) {
            let image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }

        this.spawnSlot = spawnSlot;
        this.score = score;
    }

    draw() {
        if (!this.image) return

        let cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }
        board.drawImage(
            this.image, 
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.draw();
        this.updateFrames();

        // hitbox 
        // board.fillStyle = 'rgba(0, 0, 255, 0.5)';
        // board.fillRect(
        //     this.hitbox.position.x, 
        //     this.hitbox.position.y, 
        //     this.hitbox.width, 
        //     this.hitbox.height
        // );
    }

    updateFrames() {
        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
}