class Pipe {
    constructor(options) {
        this.width = 64;
        this.height = 512;

        this.topPipeImg = new Image();
        this.topPipeImg.src = "./images/toppipe.png";

        this.buttomPipeImg = new Image();
        this.buttomPipeImg.src = "./images/bottompipe.png";

        this.orientation = options.orientation; 
        this.velocityX = -2;

        this.x = options.x;
        this.y = options.y;

        this.passed = false;
    }

    updateX() {
        this.x = this.x + this.velocityX;
    }
}