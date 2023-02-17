const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

board = {
    width: 360,
    heigh: 600,
    cellW: 12,
    cellH: 20,
}

cell = {
    width: 30,
    heigh: 30,
}

function arenaSweep() {
    let rowCounter = 1;
    outer:
    for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0)
        arena.unshift(row);
        player.score += rowCounter * 12;
        rowCounter *= 2;
        dropInterval -= (0.05 * player.score);  
        console.log(dropInterval);
        ++y

    }
}

function collide(arena, matrix) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && 
                (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if ( type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function createMatrix(w, h) {
    let matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix
}

function draw(){
    context.fillStyle = '#000';
    context.fillRect(0, 0, board.width, board.heigh);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect((x + offset.x) * cell.width + 1, 
                                 (y + offset.y) * cell.heigh + 1, 
                                 cell.width - 1, cell.heigh - 1)
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        }) 
    })
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    let pieces = 'ILJOSZT';
    let newLetter = pieces[pieces.length * Math.random() | 0];
    player.matrix = createPiece(newLetter);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        dropInterval = 1000;
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    let pos = player.pos.x;
    rotate(player.matrix, dir);
    let offset = 1;
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1: -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y], 
                matrix[y][x],
            ] = [
                matrix[y][x], 
                matrix[x][y]
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    let deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;

}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = createMatrix(board.cellW, board.cellH);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', event => {
    console.log(event);
    if (event.key === 'ArrowLeft' || event.code === 'KeyA') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight' || event.code === 'KeyD' ) {
        playerMove(1); 
    } else if (event.key === 'ArrowDown' || event.code === 'KeyS') {
        playerDrop();
    }
})

document.addEventListener("keyup", event => {
    if (event.code === 'KeyQ') {
        playerRotate(1);
    } else if (event.code === 'KeyE') {
        playerRotate(-1);
    }
})

playerReset();
updateScore();
update();
