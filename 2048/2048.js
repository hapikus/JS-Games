function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
};

let board;
let score = 0;
let rows = 4;
let columns = 4;

let gameOver = false;

window.onload = function() {
    setGame();
}

function restartGame() {
    gameOver = false;
    score = 0;

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c]
            updateTile(tile, num);
        }
    }

    setTwo();
    setTwo();
}

function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    let boardDiv = document.getElementById("board");
    let boardDivWidth = boardDiv.offsetWidth;
    let boardDivHeight = boardDiv.offsetHeight;
    let value = Math.min(400, boardDivWidth-10, boardDivHeight-10);
    boardDiv.style.width = value + 'px';
    boardDiv.style.height = value + 'px';

    // create tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            // create tile
            let tile = document.createElement("div")
            tile.id = `${r}-${c}`;
            console.log('boardDivWidth', boardDivWidth);
            tile.style.width = Math.min(90, (boardDivWidth - 50)/4) + 'px';
            tile.style.height = Math.min(90, (boardDivWidth - 50)/4) + 'px';
            let num = board[r][c]
            updateTile(tile, num);

            // add tile
            document.getElementById('board').append(tile);

        }
    }

    setTwo();
    setTwo();

} /* setGame() */

function gameOverCheck() {

    zeroPosition = []
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) zeroPosition.push([r, c]);
        }
    }

    if (zeroPosition.length === 0) {
        let possibleChanges = false;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (r - 1 >= 0) {
                    if (board[r-1][c] === board[r][c]) possibleChanges = true
                }
                if (r + 1 < rows) {
                    if (board[r+1][c] === board[r][c]) possibleChanges = true
                }

                if (c - 1 >= 0) {
                    if (board[r][c-1] === board[r][c]) possibleChanges = true
                }
                if (c+1 < columns) {
                    if (board[r][c+1] === board[r][c]) possibleChanges = true
                }
            }
        }
        
        if (!possibleChanges) {
            gameOver = true;
            alert(`Game over, score: ${score}`);
        };
    }

    if (gameOver) restartGame();

} /* gameOverCheck() */

function setTwo() {
    if (gameOver) return;

    zeroPosition = []
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) zeroPosition.push([r, c]);
        }
    }

    if (zeroPosition.length) {
        let rndInt = randomIntFromInterval(0, zeroPosition.length - 1)

        r = zeroPosition[rndInt][0]
        c = zeroPosition[rndInt][1]
        rndIntForTwo = randomIntFromInterval(1, 100);
        rndIntForTwo >= 90 ? board[r][c] = 4 : board[r][c] = 2;

        tile = document.getElementById(`${r}-${c}`);
        let num = board[r][c];
        updateTile(tile, num);
    }
}

function updateTile(tile, num) {
    if (gameOver) return;

    // clear tile
    tile.innerText =  "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num;
        num <= 4096 ? tile.classList.add(`x${num}`) : tile.classList.add(`x8192`);
    }

} /* updateTile() */

// keyup - we wanna set up this 1 time per press button
// not like this - kkkkkkkkk
document.addEventListener("keyup",  (e) => {
    console.log(e);
    if (gameOver) return;

    boardBefore = board.toString();

    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        slideLeft();
        boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
    } 
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        slideRight();
        boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
    } 
    else if (e.code == "ArrowUp" || e.code == "KeyW") {
        slideUp();
        boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
    } 
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        slideDown();
        boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
    }

    document.getElementById("score").innerText = score;
})

let touchX = '';
let touchY = '';
let touchMove = false;
let touchTreshhold = 40;
document.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].pageX;
    touchY = e.changedTouches[0].pageY;
})

document.addEventListener('touchmove', e => {
    if (gameOver) return;

    boardBefore = board.toString();

    let sweepDistanceX = e.changedTouches[0].pageX - touchX;
    let sweepDistanceY = e.changedTouches[0].pageY - touchY;

    if (sweepDistanceX < -touchTreshhold) {
        if (!touchMove) {
            slideLeft();
            boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
        }
        touchMove = true;
    } else if (sweepDistanceX > touchTreshhold) {
        if (!touchMove) {
            slideRight();
            boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
            touchMove = true;
        }
    } else if (sweepDistanceY < -touchTreshhold) {
        if (!touchMove) {
            slideUp();
            boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
            touchMove = true;            
        }
    } else if (sweepDistanceY > touchTreshhold) {
        if (!touchMove) {
            slideDown();
            boardBefore !=  board.toString() ? setTwo() : gameOverCheck();
            touchMove = true;
        }
    }
})

document.addEventListener('touchend', e => {
    touchMove = false;
})

function clearZero(arr) {
    while (arr.includes(0)) {
        let zeroIndex = arr.indexOf(0);
        arr.splice(zeroIndex, 1)
    }

    return arr
} /* clearZero */

function slide(arr) {
    if (gameOver) return;
    // [0, 4, 4, 8]
    arr = clearZero(arr);  // [4, 4, 8]

    for (let i = 0; i < arr.length-1; i++) {
        if (arr[i] === arr[i+1]) {
            arr[i] *= 2;
            arr[i+1] = 0;
            score += arr[i]
        }
    } // [8, 0, 8]

    arr = clearZero(arr); // [8, 8, 0]

    while (arr.length < columns) arr.push(0); // [8, 8, 0, 0]

    return arr
} /* slide */


function slideLeft() {
    for (let r = 0; r < rows; r++) {

        let row = board[r]
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
} /* slideLeft() */

function slideRight() {
    for (let r = 0; r < rows; r++) {

        let row = board[r].reverse()
        row = slide(row);
        board[r] = row.reverse();

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                tile = document.getElementById(`${r}-${c}`);
                let num = board[r][c];
                updateTile(tile, num);
            }
        }
    }

} /* slideRight() */

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = []

        for (let r = 0; r < rows; r++) {
            row.push(board[r][c])
        }

        row = slide(row);

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];

            tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
} /* slideUp() */

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = []

        for (let r = 0; r < rows; r++) {
            row.push(board[r][c])
        }

        row.reverse()
        row = slide(row);
        row.reverse()

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];

            tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
} /* slideUp() */
