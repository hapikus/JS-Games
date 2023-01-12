
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
};

// board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// ship
let shipSize = 2;

let shipWidth = tileSize * shipSize;
let shipHeight = tileSize;

let shipX = tileSize * columns / 2 - tileSize * ((columns + 1) % 2);
let shipY = tileSize * (rows - shipSize);

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight,
}

let shipImg;
let shipVelocityX = tileSize; // ship moving speed

// aliens
let alienArray = [];

let alienSize = 2;

let alienWidth = tileSize * alienSize;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;

let alienImgWhite;
let alienImgCyan;
let alienImgMagenta;
let alienImgYellow;

let alienVelocityX = 1;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // number of aliens to defeat

// aliend bullet
let alienBulletArray = [];
let alienBulletVelocityY = 6; // bullet speed

// bullets
let bulletArray = [];
let bulletVelocityY = -10; // bullet speed

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight
    context = board.getContext("2d") // used for drawing on the board

    // draw initial ship
    // context.fillStyle = "green";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height)

    shipImg = new Image();  
    shipImg.src = "ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    } 

    // "alien.png", "alien-cyan.png", "alien-magenta.png", "alien-yellow.png"
    alienImgWhite = new Image();  
    alienImgWhite.src = "alien.png";

    alienImgCyan = new Image();
    alienImgCyan.src =  "alien-cyan.png";

    alienImgMagenta = new Image();
    alienImgMagenta.src = "alien-magenta.png";

    alienImgYellow = new Image();
    alienImgYellow.src = "alien-yellow.png";

    creatAliens()

    requestAnimationFrame(update);
    // добавляем слушателей на события и что делать при этом
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    setInterval(alienBullet, 2200);

}    

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);

    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // if alien touches the boarders 
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                // когда первый меняет направление - остальные начинают съезжать
                alien.x += alienVelocityX * 2

                // move all aliens down 1 rows
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;
            }
        };
    }

    // bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;

        // draw bullet
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //bullet collision with aliens 
        for (let j = 0; j < alienArray.length; j++) {

            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {   
                bullet.used = true;
                alien.alive = false;
                score += 100;
                alienCount--;
            }   
        }
    }

    // alien bullets
    for (let i = 0; i < alienBulletArray.length; i++) {
        let bullet = alienBulletArray[i];
        bullet.y += alienBulletVelocityY;

        // draw bullet
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // bullet collision with aliens 
        
        if (bullet.x >= ship.x && bullet.x <= ship.x + ship.width
            && bullet.y >= ship.y && bullet.y <= ship.y + ship.height) {   
            gameOver = true;
        }

    }

    // clear alien bullets 

    while (alienBulletArray.length > 0 && alienBulletArray[0].y >= boardHeight) {
        alienBulletArray.shift()
        score += 100;
    }

    // clear ship bullets 
    
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y <= 0)) {
        bulletArray.shift(); // delete first bullet
    }

    // next level 
    if (alienCount == 0) {
        // increased aliens
        alienColumns = Math.min(alienColumns + 1, columns/2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienVelocityX += 0.2;

        alienArray = [];
        bulletArray = [];

        creatAliens();
    }

    // score
    context.fillStyle = "white";
    context.font = "16px courier"
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" &&  ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX // move left 1 tile
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidth <= boardWidth) {
        ship.x += shipVelocityX
    }
} /*  moveShip(e) */

function creatAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let rndInt = randomIntFromInterval(0, 3)
            let alien = {
                img : [alienImgWhite, alienImgCyan, alienImgMagenta, alienImgYellow][rndInt],
                x : alienX + c * alienWidth,
                y : alienY + r * alienHeight, 
                width : alienWidth,
                height : alienHeight,
                column : c,
                alive : true,
            }
            alienArray.push(alien);

        }
    }

    alienCount = alienArray.length;
} /* creatAliens() */

function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "Space") {
        //shoot
        let bullet = {
            x : ship.x + Math.floor(shipWidth/2) - 1 * ((shipWidth + 1) % 2),
            y : ship.y,
            width: tileSize/8,
            height: tileSize/2,
            used : false,
        }
        bulletArray.push(bullet);
    }
} /* shoot(e) */

function detectCollision(a, b) {
    return a.x < b.x + b.width &&    // a's top left corner doesn't reach b's top left corner
           a.x + a.width > b.x &&    // a's top right corner passed b's top left corner
           a.y < b.y + b.height &&
           a.y + a.height > b.y
}

function alienBullet() {
    if (gameOver) {
        return;
    }

    // alien shoot
    let alienAlive = alienArray.filter(x => x.alive === true)
    if (alienAlive.length) {
        let rndInt = randomIntFromInterval(0, alienAlive.length-1)
        let bullet = {
            x : alienAlive[rndInt].x + 15, 
            y : alienAlive[rndInt].y + alienHeight,
            width: tileSize/8,
            height: tileSize/2,
        }
        alienBulletArray.push(bullet);
    }

}
