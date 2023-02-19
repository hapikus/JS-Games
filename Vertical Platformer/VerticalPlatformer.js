function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
};

let maxItems = 5;
let canvas;

canvas = document.getElementById('board');
canvas.width = 1024;
canvas.height = 576;

let scaledCanvas = {
    width : canvas.width / 4,
    height : canvas.height / 4,
}

let gravity = 0.5;

let keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

// our map floor's blocks
let itemSwawnSlots = []
let floorCollisions2D = [];

for (let i = 0; i < floorCollisions.length; i+=36) {
    floorCollisions2D.push(floorCollisions.slice(i, i+36));
}

let collisionBLocks = [];

floorCollisions2D.forEach((row, rowIndex) => {
    row.forEach((symbol, columnIndex )=> {
        if (symbol === 202) {
            collisionBLocks.push(
                new CollisionBlock({
                    position : {
                        x: columnIndex * 16, 
                        y: rowIndex * 16
                    },
                })
            );

            if (rowIndex >= 25 || rowIndex <= 22) {
                itemSwawnSlots.push({
                    position : {
                        x: columnIndex * 16, 
                        y: (rowIndex - 1) * 16,
                    },
                });
            }
        }
    })
})

// platforms
let platformCollisions2D = [];

for (let i = 0; i < platformCollisions.length; i+=36) {
    platformCollisions2D.push(platformCollisions.slice(i, i+36));
}

let platformCollisionBLocks = [];
platformCollisions2D.forEach((row, rowIndex) => {
    row.forEach((symbol, columnIndex )=> {
        if (symbol === 202) {
            platformCollisionBLocks.push(
                new CollisionBlock({
                    position : {
                        x: columnIndex * 16, 
                        y: rowIndex * 16
                    },
                    height: 7,
                })
            );

            itemSwawnSlots.push({
                position : {
                    x: columnIndex * 16, 
                    y: (rowIndex - 1) * 16,
                },
            });

        }
    })
})

board = canvas.getContext('2d');

let backgroundImageHeight = 432 

let camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

let itemArray = [];
let currentCoordinates = [];

let takenArray = [];
let takenArrayAnimation = [];

itemGeneration();

let hero = new Player(
    {position: {
        x: 100, 
        y: 300,
    }, 
    collisionBLocks: collisionBLocks,
    platformCollisionBLocks: platformCollisionBLocks,
    frameBuffer: 4,
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 6,
        },
        RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 6,
        },
        Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
    }
});

let background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
})



function animate() {
    window.requestAnimationFrame(animate);
    // our main board 
    board.fillStyle = 'white';
    board.fillRect(0, 0, canvas.width, canvas.height);
    
    // background 
    // save...restore will use scale for code into this block
    board.save();
    board.scale(4, 4) //scale background *4
    board.translate(camera.position.x, camera.position.y); 
    background.update();

    // map
    // collisionBLocks.forEach((floorBlock) =>{
    //     floorBlock.update();
    // })

    // platformCollisionBLocks.forEach((platformBlock) =>{
    //     platformBlock.update();
    // })

    // hero
    hero.checkForHorizontalCanvasCollisions();
    hero.update();

    // items
    itemGeneration();
    itemRemover();

    for (let item of itemArray) {
        item.update();
    };

    for (let item of takenArray) {
        item.update();
    };

    hero.velocity.x = 0;
    if (keys.a.pressed) {
        hero.switchSprite('RunLeft');
        hero.velocity.x = -1.5;
        hero.lastDirection = 'left';
        hero.shouldPanCameraToTheRight({canvas, camera});
    } else if (keys.d.pressed) {
        hero.switchSprite('Run');
        hero.velocity.x = 1.5;
        hero.lastDirection = 'right';
        hero.shouldPanCameraToTheLeft({canvas, camera});
    } else if (hero.velocity.y === 0) {
        if (hero.lastDirection === 'right') {
            hero.switchSprite('Idle');
        } else {
            hero.switchSprite('IdleLeft');
        }
    }

    if (hero.velocity.y < 0) {
        hero.shouldPanCameraToTheDown({canvas, camera});
        if (hero.lastDirection === 'right') {
            hero.switchSprite('Jump');
        } else {
            hero.switchSprite('JumpLeft');
        }
    } else if (hero.velocity.y > 0) {
        hero.shouldPanCameraToTheUp({canvas, camera});
        if (hero.lastDirection === 'right') {
            hero.switchSprite('Fall');
        } else {
            hero.switchSprite('FallLeft');
        }
        
    }

    board.restore()

}

function keyDownEvent(e) {
    switch (e.code) {
        case 'KeyA': 
            keys.a.pressed = true;
        break;
        case 'ArrowLeft': 
            keys.a.pressed = true;
        break;
        case 'KeyD': 
            keys.d.pressed = true;
        break;
        case 'ArrowRight': 
            keys.d.pressed = true;
        break;
        case 'KeyW':
            hero.velocity.y = -6;
        break;
        case 'Space':
            hero.velocity.y = -6;
        break;
    }
}

function keyUpEvent(e) {
    switch (e.code) {
        case 'KeyA': 
            keys.a.pressed = false;
        break;
        case 'ArrowLeft': 
            keys.a.pressed = false;
        break;
        case 'KeyD': 
            keys.d.pressed = false;
        break;
        case 'ArrowRight': 
            keys.d.pressed = false;
        break;
    }
}

animate();
window.addEventListener("keydown", keyDownEvent);
window.addEventListener("keyup", keyUpEvent)

function itemGeneration() {
    while (itemArray.length < maxItems) {
        diamondOrHear = randomIntFromInterval(1, 2);
        itemSlot = randomIntFromInterval(0, itemSwawnSlots.length - 1);
        itemCoordinates = itemSwawnSlots[itemSlot];
    
        if (!currentCoordinates.includes(itemSlot)) {
            currentCoordinates.push(itemSlot);
            if ( diamondOrHear === 1 ) {
                itemArray.push(new Item(
                    { position: {
                        x: itemCoordinates.position.x,
                        y: itemCoordinates.position.y,
                    },
                    frameBuffer: 8,
                    imageSrc: './img/Coins/Big Diamond Idle (18x14).png',
                    frameRate: 10,
                    animations: {
                        Idle: {
                            imageSrc: './img/Coins/Big Diamond Idle (18x14).png',
                            frameRate: 8,
                            frameBuffer: 3,
                        },
                        Hit: {
                            imageSrc: './img/Coins/Big Diamond Hit (18x14).png',
                            frameRate: 2,
                            frameBuffer: 8,
                        },
                    },
                    spawnSlot: itemSlot,
                    score: 200,
                })
            )} else {
                itemArray.push(new Item(
                    { position: {
                        x: itemCoordinates.position.x,
                        y: itemCoordinates.position.y,
                    },
                    frameBuffer: 8,
                    imageSrc: './img/Coins/Big Heart Idle (18x14).png',
                    frameRate: 8,
                    animations: {
                        Idle: {
                            imageSrc: './img/Coins/Big Heart Idle (18x14).png',
                            frameRate: 8,
                            frameBuffer: 6,
                        },
                        Hit: {
                            imageSrc: './img/Coins/Big Heart Hit (18x14).png',
                            frameRate: 2,
                            frameBuffer: 8,
                        },
                    },
                    spawnSlot: itemSlot,
                    score: 100,
                })
            )}
        }
    };
};

function itemRemover() {
    for (let i = 0; i < takenArray.length; i++) {
        if (takenArray[i].readyToDelete) {
            takenArray.splice(i, 1)
            return
        }
    }
}
