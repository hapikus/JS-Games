function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
};

// board
let board;
let boardWidth = 350;
let boardHeight = 640;
let context;

let gravity = 0.4;

// bird

let bird = {
    img: new Image(),
    x: boardWidth/8,
    y: boardHeight/2,
    width: 34,
    height: 24,
    velocityY: 0,
}

// pipes 
let pipesArray = [];

let gameOver = false;
let score = 0;
let additionalSpace = 40;

window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext('2d');

    // draw bird
    bird.img.src = "./images/flappybird.png";
    bird.img.onload = function() {
        context.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);
    } 

    requestAnimationFrame(update);

    setInterval(placePipes, 1500);

    document.addEventListener("keyup", birdJump);
    document.addEventListener("click", clickJump);
} 

function update() {
    requestAnimationFrame(update);
    
    if (gameOver) return    

    context.clearRect(0, 0, boardWidth, boardHeight);

    bird.velocityY += gravity;
    bird.y = Math.max(bird.y + bird.velocityY, 0);

    context.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // pipes 
    for (let i = 0; i < pipesArray.length; i++) {
        let pipe = pipesArray[i];
        pipe.updateX();        
        context.drawImage(pipe.orientation === 'top' ? pipe.topPipeImg : pipe.buttomPipeImg, 
                            pipe.x, 
                            pipe.y, 
                            pipe.width, 
                            pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }
        
        if (detectCollision(pipe, bird)) {
            gameOver = true;
        }
    }

    // cleare pipes
    for (let i = 0; i < pipesArray.length; i++) {
        let pipe = pipesArray[i]

        if (!pipe.passed && pipe.x + pipe.width < 0) {
            continue
        } else {
            pipesArray.splice(0, i);
            break;
        }
    }

    // score
    context.fillStyle = "white";
    context.font = "32px courier"
    context.fillText(score, 5, 25);

    if (gameOver) {
        context.font = "45px courier"
        context.fillText('GAME OVER', 60, 90);
    }
}

function placePipes() {
    if (gameOver) return

    let openSpace = board.height/4 + randomIntFromInterval(0, Math.max(0, additionalSpace-score));

    let topPipe = new Pipe({x: boardWidth, 
                            y: 0,
                            orientation: 'top'});
    topPipe.y = -topPipe.y - topPipe.height/4 - Math.random()*(topPipe.height/2);

    let bottomPipe = new Pipe({x: boardWidth, 
                            y: 0,
                            orientation: 'bottom'});
    bottomPipe.y = topPipe.y + topPipe.height + openSpace;

    pipesArray.push(topPipe);
    pipesArray.push(bottomPipe);
}

function birdJump(e) {
    if (e.code == 'Space' || e.code == 'KeyUp' || e.code == 'KeyW') {
        bird.velocityY = -7;

        if (gameOver) {
            gameOver = false;
            pipesArray = [];
            score = 0;

            bird.x = boardWidth/8;
            bird.y = boardHeight/2;
            bird.velocityY = 0;
        }
    }
} 

function clickJump(e) {
    bird.velocityY = -7;

    if (gameOver) {
        gameOver = false;
        pipesArray = [];
        score = 0;

        bird.x = boardWidth/8;
        bird.y = boardHeight/2;
        bird.velocityY = 0;
    }
}


function detectCollision(a, b) {
    return a.x < b.x + b.width &&    // a's top left corner doesn't reach b's top left corner
           a.x + a.width > b.x &&    // a's top right corner passed b's top left corner
           a.y < b.y + b.height &&
           a.y + a.height > b.y
}
