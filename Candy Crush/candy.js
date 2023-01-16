function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
};

let candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
let candiesTypes = ['-Striped-Horizontal', '-Striped-Vertical'] 

let board = [];
let rows = 9;
let columns = 9;

let score = 0;

let currTile;
let otherTile;

window.onload = function() {
    startGame();

    setInterval(() => {
        crushCande();
        slideCandy();
        generateCandy();

    }, 100);
}

function randomCandy() {
    return candies[randomIntFromInterval(0, candies.length-1)];
}

function startGame() {

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id = "0-0">
            let tile = document.createElement("img");
            tile.id = `${r}-${c}`;
            tile.src = "./images/" + randomCandy() + ".png";

            // DRAG functionality
            tile.addEventListener("dragstart", dragStart); // click on candy
            tile.addEventListener("dragover", dragOver); // moving mouse with candy
            tile.addEventListener("dragenter", dragEnter); // dragon candy onto another candy
            tile.addEventListener("dragleave", dragLeave); // leave candy over another candy
            tile.addEventListener("drop", dragDrop); // droping candy into another candy
            tile.addEventListener("dragend", dragEnd); // after drog process completed, we swap candy            

            // add tile
            document.getElementById('board').append(tile);

            row.push(tile);
        }
        board.push(row);
    }
}

function dragStart() {
    currTile = this;

}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes('blank') || otherTile.src.includes('blank')) return;

    let currCoords = currTile.id.split('-');
    let otherCoords = otherTile.id.split('-');
    
    if (Math.abs(currCoords[0] - otherCoords[0]) < 2 && Math.abs(currCoords[1] - otherCoords[1]) < 2 &&
        Math.abs(currCoords[0] - otherCoords[0]) + Math.abs(currCoords[1] - otherCoords[1]) < 2) {
        
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        [currTile.src, otherTile.src] = [otherImg, currImg];

        let validMove = checkValid();

        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            [currTile.src, otherTile.src] = [otherImg, currImg];
        }
    }    
}

function crushCande() {
    checkFive();
    crushFour();
    crushThree();


    document.getElementById("score").innerText = score;
}

function checkHorizontal(candy, r) {
    if (candy.src.includes("Horizontal")) {
        for (let c1 = 0; c1 < columns; c1++) {
            let candy1 = board[r][c1];
            candy1.src = "./images/blank.png"
        }
    }
}

function checkVertical(candy, c) {
    if (candy.src.includes("Vertical")) {
        for (let r1 = 0; r1 < rows; r1++) {
            let candy1 = board[r1][c];
            board[r1][c].src = "./images/blank.png"
        }
    }
}

function checkChoco(candy, r, c) {
    if (candy.src.includes("Choco.png")) {

        for (let c1 = 0; c1 < columns; c1++) {
            let candy1 = board[r][c1];
            candy1.src = "./images/blank.png"
        }

        for (let r1 = 0; r1 < rows; r1++) {
            let candy1 = board[r1][c];
            board[r1][c].src = "./images/blank.png"
        }
    }

}

function checkFive() {
            //check rows
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns-4; c++) {
                    let candy1 = board[r][c];
                    let candy2 = board[r][c+1];
                    let candy3 = board[r][c+2];
                    let candy4 = board[r][c+3];
                    let candy5 = board[r][c+4];

                    if (candy1.src.includes('Choco.png')) candy1.src = candy2.src;
                    if (candy2.src.includes('Choco.png')) candy2.src = candy3.src;
                    if (candy3.src.includes('Choco.png')) candy3.src = candy4.src;
                    if (candy4.src.includes('Choco.png')) candy4.src = candy5.src; 
                    if (candy5.src.includes('Choco.png')) candy5.src = candy1.src;    
    
                    scrLength = candy1.src.split('/').length;
    
                    if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                        && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3)
                        && candy3.src.split('/')[scrLength-1].slice(0, 3) === candy4.src.split('/')[scrLength-1].slice(0, 3)
                        && candy4.src.split('/')[scrLength-1].slice(0, 3) === candy5.src.split('/')[scrLength-1].slice(0, 3)
                        && !candy1.src.includes("blank")) {

                        checkHorizontal(candy1, r);
                        checkVertical(candy1, c);
                        checkChoco(candy1, r, c);
                        candy1.src = "./images/blank.png"

                        checkHorizontal(candy2, r);
                        checkVertical(candy2, c+1);
                        checkChoco(candy2, r, c+1);
                        candy2.src = "./images/blank.png"

                        checkHorizontal(candy3, r);
                        checkVertical(candy3, c+2);
                        checkChoco(candy3, r, c+2);
                        candy3.src = "./images/blank.png"

                        checkHorizontal(candy4, r);
                        checkVertical(candy4, c+3);
                        checkChoco(candy4, r, c+3);
                        candy4.src = "./images/blank.png"

                        checkHorizontal(candy5, r);
                        checkVertical(candy5, c+4);
                        checkChoco(candy5, r, c+4);
                        candy5.src = "./images/blank.png"
                        
                        score += 80; 

                        let randIntCandy = randomIntFromInterval(0, 4);
                        let randIntType = randomIntFromInterval(0, candiesTypes.length-1);
                        board[r][c+randIntCandy].src = "./images/" + randomCandy() + candiesTypes[randIntType] + ".png";
    
                        // let randIntCandy = randomIntFromInterval(0, 4);
                        // board[r][c+randIntCandy].src = "./images/Choco.png";
                    }
                }
            }
        
            //check columns
            for (let r = 0; r < rows-4; r++) {
                for (let c = 0; c < columns; c++) {
                    let candy1 = board[r][c];
                    let candy2 = board[r+1][c];
                    let candy3 = board[r+2][c];
                    let candy4 = board[r+3][c];
                    let candy5 = board[r+4][c];

                    scrLength = candy1.src.split('/').length;
    
                    if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                        && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3)
                        && candy3.src.split('/')[scrLength-1].slice(0, 3) === candy4.src.split('/')[scrLength-1].slice(0, 3)
                        && candy4.src.split('/')[scrLength-1].slice(0, 3) === candy5.src.split('/')[scrLength-1].slice(0, 3)
                        && !candy1.src.includes("blank")) {

                        checkHorizontal(candy1, r);
                        checkVertical(candy1, c);
                        checkChoco(candy1, r, c);
                        candy1.src = "./images/blank.png";
        
                        checkHorizontal(candy2, r+1);
                        checkVertical(candy2, c);
                        checkChoco(candy2, r+1, c);
                        candy2.src = "./images/blank.png";
        
                        checkHorizontal(candy3, r+2);
                        checkVertical(candy3, c);
                        checkChoco(candy3, r+2, c);
                        candy3.src = "./images/blank.png";
    
                        checkHorizontal(candy4, r+3);
                        checkVertical(candy4, c);
                        checkChoco(candy4, r+3, c);
                        candy4.src = "./images/blank.png"

                        checkHorizontal(candy5, r+4);
                        checkVertical(candy5, c);
                        checkChoco(candy5, r+4, c);
                        candy5.src = "./images/blank.png"

                        score += 80;  
                        
                        let randIntCandy = randomIntFromInterval(0, 4);
                        let randIntType = randomIntFromInterval(0, candiesTypes.length-1);
                        board[r+randIntCandy][c].src = "./images/" + randomCandy() + candiesTypes[randIntType] + ".png";
    
                        // let randIntCandy = randomIntFromInterval(0, 4);
                        // board[r+randIntCandy][c].src = "./images/Choco.png";
    
                    }
                }
            }
}

function crushFour() {
        //check rows
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns-3; c++) {
                let candy1 = board[r][c];
                let candy2 = board[r][c+1];
                let candy3 = board[r][c+2];
                let candy4 = board[r][c+3];

                scrLength = candy1.src.split('/').length;

                if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                    && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3)
                    && candy3.src.split('/')[scrLength-1].slice(0, 3) === candy4.src.split('/')[scrLength-1].slice(0, 3)
                    && !candy1.src.includes("blank")) {

                    checkHorizontal(candy1, r);
                    checkVertical(candy1, c);
                    checkChoco(candy1, r, c);
                    candy1.src = "./images/blank.png";
    
                    checkHorizontal(candy2, r);
                    checkVertical(candy2, c+1);
                    checkChoco(candy2, r, c+1);
                    candy2.src = "./images/blank.png";
    
                    checkHorizontal(candy3, r);
                    checkVertical(candy3, c+2);
                    checkChoco(candy3, r, c+2);
                    candy3.src = "./images/blank.png";

                    checkHorizontal(candy4, r);
                    checkVertical(candy4, c+3);
                    checkChoco(candy4, r, c+3);
                    candy4.src = "./images/blank.png"

                    score += 50;

                    let randIntCandy = randomIntFromInterval(0, 3);
                    let randIntType = randomIntFromInterval(0, candiesTypes.length-1);
                    board[r][c+randIntCandy].src = "./images/" + randomCandy() + candiesTypes[randIntType] + ".png";
                }
            }
        }
    
        //check columns
        for (let r = 0; r < rows-3; r++) {
            for (let c = 0; c < columns; c++) {
                let candy1 = board[r][c];
                let candy2 = board[r+1][c];
                let candy3 = board[r+2][c];
                let candy4 = board[r+3][c];

                scrLength = candy1.src.split('/').length;

                if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                    && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3)
                    && candy3.src.split('/')[scrLength-1].slice(0, 3) === candy4.src.split('/')[scrLength-1].slice(0, 3)
                    && !candy1.src.includes("blank")) {

                    checkHorizontal(candy1, r);
                    checkVertical(candy1, c);
                    checkChoco(candy1, r, c);
                    candy1.src = "./images/blank.png";
    
                    checkHorizontal(candy2, r+1);
                    checkVertical(candy2, c);
                    checkChoco(candy2, r+1, c);
                    candy2.src = "./images/blank.png";
    
                    checkHorizontal(candy3, r+2);
                    checkVertical(candy3, c);
                    checkChoco(candy3, r+2, c);
                    candy3.src = "./images/blank.png";

                    checkHorizontal(candy4, r+3);
                    checkVertical(candy4, c);
                    checkChoco(candy4, r+3, c);
                    candy4.src = "./images/blank.png";
                    score += 50;    

                    let randIntCandy = randomIntFromInterval(0, 3);
                    let randIntType = randomIntFromInterval(0, candiesTypes.length-1);
                    board[r+randIntCandy][c].src = "./images/" + randomCandy() + candiesTypes[randIntType] + ".png";

                }
            }
        }
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            scrLength = candy1.src.split('/').length;

            if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3) 
                && !candy1.src.includes("blank")) {
                
                checkHorizontal(candy1, r);
                checkVertical(candy1, c);
                checkChoco(candy1, r, c);
                candy1.src = "./images/blank.png";

                checkHorizontal(candy2, r);
                checkVertical(candy2, c+1);
                checkChoco(candy2, r, c+1);
                candy2.src = "./images/blank.png";

                checkHorizontal(candy3, r);
                checkVertical(candy3, c+2);
                checkChoco(candy3, r, c+2);
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let r = 0; r < rows-2; r++) {
        for (let c = 0; c < columns; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            scrLength = candy1.src.split('/').length;

            if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3) 
                && !candy1.src.includes("blank")) {

                checkHorizontal(candy1, r);
                checkVertical(candy1, c);
                checkChoco(candy1, r, c);
                candy1.src = "./images/blank.png";

                checkHorizontal(candy2, r+1);
                checkVertical(candy2, c);
                checkChoco(candy2, r+1, c);
                candy2.src = "./images/blank.png";

                checkHorizontal(candy3, r+2);
                checkVertical(candy3, c);
                checkChoco(candy3, r+2, c);
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            scrLength = candy1.src.split('/').length;

            if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3) 
                && !candy1.src.includes("blank")) {
                return true
            }
        }
    }

    //check columns
    for (let r = 0; r < rows-2; r++) {
        for (let c = 0; c < columns; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            scrLength = candy1.src.split('/').length;

            if (candy1.src.split('/')[scrLength-1].slice(0, 3) === candy2.src.split('/')[scrLength-1].slice(0, 3)
                && candy2.src.split('/')[scrLength-1].slice(0, 3) === candy3.src.split('/')[scrLength-1].slice(0, 3) 
                && !candy1.src.includes("blank")) {
                return true
            }
        }
    }

    return false
}


function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;   
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png"; 
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}