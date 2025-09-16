//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

"use strict";

let backRect = null;
let gridArray = [];
let currentPlacement = 1;

let lastPaint = 0;
let cooldown = 50;

let lastMove = 0;
let moveCooldown = 35;

let gridSlider = document.querySelector("#slider1");
let gridSliderText = document.querySelector("#p1");
let lastGridSlider = gridSlider.value;

let paintSlider = document.querySelector("#slider2");
let paintSliderText = document.querySelector("#p2");

let moveSlider = document.querySelector("#slider3");
let moveSliderText = document.querySelector("#p3");

let lineOpacity = 255;
let lineSlider = document.querySelector("#slider4");
let lineSliderText = document.querySelector("#p4");

let button1 = document.querySelector("#button1");
let button2 = document.querySelector("#button2");
let button3 = document.querySelector("#button3");
let button4 = document.querySelector("#button4");
let pauseButton = document.querySelector("#pause");
let clearButton = document.querySelector("#clear");

let placeShape = 1;
let placeShapeFinal = null;

let pause = false;

let shuffledColumns = [];

const grid = {
    columns: 24,
    rows: 24,
    squareW: null,
    squareH: null,
    offsetX: 0,
    offsetY: 0,
    fillAir: {
        r: 255,
        g: 255,
        b: 255
    },
    fillSolid: {
        r: 0,
        g: 0,
        b: 0
    },
    fillLiquid: {
        r: 25,
        g: 25,
        b: 255
    }
};

const backgroundColor = {
    fill: {
        r: 255,
        g: 255,
        b: 255
    }
};

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

function preload() {

};

// Setup runs code on start-up
function setup() {
    let c = createCanvas(800, 800);
    c.parent('canvas-container');
    calculateGridSize();
    gridSlider.value = grid.columns;
    gridReset();
    canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); }
    buttonListeners();
};

// Draw runs code every frame
function draw() {
    background(backgroundColor.fill.r, backgroundColor.fill.g, backgroundColor.fill.b);
    movementCooldown();
    createGrid();
    clickCooldown();
    sliderChecks();

};

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

function calculateGridSize() {
    grid.squareW = width / grid.columns;
    grid.squareH = height / grid.rows;
};

function createGrid() {
    for (let i = 0; i < grid.columns; i++) {
        for (let j = 0; j < grid.rows; j++) {

            const x = i * grid.squareW;
            const y = j * grid.squareH;

            if (gridArray[i][j] === 0) {
                fill(grid.fillAir.r, grid.fillAir.g, grid.fillAir.b);
            }
            else if (gridArray[i][j] === 1) {
                fill(grid.fillSolid.r, grid.fillSolid.g, grid.fillSolid.b);
            }
            else if (gridArray[i][j] === 2) {
                fill(grid.fillLiquid.r, grid.fillLiquid.g, grid.fillLiquid.b);
            }
            push();
            noStroke();
            rect(x, y, grid.squareW, grid.squareH);
            pop();

            push();
            noFill();
            let isHovered = mouseX > x && mouseX < x + grid.squareW &&
                mouseY > y && mouseY < y + grid.squareH;

            if (isHovered) {
                stroke(0, 0, 0, lineOpacity);
                fill(255, 0, 0, 50);
            } else {
                stroke(0, 0, 0, lineOpacity);
            }

            rect(x, y, grid.squareW, grid.squareH);
            pop();

        }
    }
};

function gridReset() {
    for (let i = 0; i < grid.columns; i++) {
        gridArray[i] = [];
        shuffledColumns.push(i);
        for (let j = 0; j < grid.rows; j++) {
            gridArray[i][j] = 0;
        }
    }
};

function columnShuffle() {
    for (let m = shuffledColumns.length - 1; m > 0; m--) {
        let n = Math.floor(Math.random() * (m + 1));
        let o = shuffledColumns[m];
        shuffledColumns[m] = shuffledColumns[n];
        shuffledColumns[n] = o;
    }
}

function keyPressed() {
    if (key === '1') {
        currentPlacement = 1;
    }

    if (key === '2') {
        currentPlacement = 2;
    }
    console.log(currentPlacement);
};

function buttonListeners() {
    button1.onclick = function () { placeShape = 1; };
    button2.onclick = function () { placeShape = 2; };
    button3.onclick = function () { placeShape = 3; };
    button4.onclick = function () { placeShape = 4; };
    pauseButton.onclick = function () {
        if (pause === true) {
            pause = false;
            pauseButton.innerText = "⏸️"
        }
        else {
            pause = true;
            pauseButton.innerText = "▶️"
        }
    };
    clearButton.onclick = function () {
        gridReset();
    };
};

function whatShape(columnMouse, rowMouse) {
    placeShapeFinal = [];

    const tryPush = (x, y) => {
        if (x >= 0 && x < grid.columns && y >= 0 && y < grid.rows) {
            placeShapeFinal.push({ x, y });
        }
    }

    if (placeShape === 1) {
        // if (gridArray[columnMouse] > -1 && gridArray[rowMouse] > -1) { }
        tryPush(columnMouse, rowMouse);

    }
    else if (placeShape === 2) {
        tryPush(columnMouse, rowMouse);
        tryPush(columnMouse - 1, rowMouse);
        tryPush(columnMouse, rowMouse - 1);
        tryPush(columnMouse - 1, rowMouse - 1);
    }
    else if (placeShape === 3) {
        tryPush(columnMouse, rowMouse);
        tryPush(columnMouse - 1, rowMouse);
        tryPush(columnMouse + 1, rowMouse);
        tryPush(columnMouse, rowMouse - 1);
        tryPush(columnMouse, rowMouse + 1);
    }
    else if (placeShape === 4) {
        tryPush(columnMouse, rowMouse);
        tryPush(columnMouse - 1, rowMouse);
        tryPush(columnMouse + 1, rowMouse);
        tryPush(columnMouse, rowMouse - 1);
        tryPush(columnMouse, rowMouse + 1);
        tryPush(columnMouse + 1, rowMouse + 1);
        tryPush(columnMouse - 1, rowMouse - 1);
        tryPush(columnMouse - 1, rowMouse + 1);
        tryPush(columnMouse + 1, rowMouse - 1);
    }
};

function gridClickCheck() {
    if (mouseIsPressed) {
        let columnMouse = Math.floor((mouseX - grid.offsetX) / grid.squareW);
        let rowMouse = Math.floor((mouseY - grid.offsetY) / grid.squareH);
        if (columnMouse > -1 && rowMouse > -1) {
            if (columnMouse >= 0 && columnMouse < grid.columns && rowMouse >= 0 && rowMouse < grid.rows && mouseX >= grid.offsetX && mouseX <= grid.offsetX + grid.columns * grid.squareW && mouseY >= grid.offsetY && mouseY <= grid.offsetY + grid.rows * grid.squareH) {
                whatShape(columnMouse, rowMouse);
                if (mouseButton === LEFT) {

                    if (currentPlacement === 1) {
                        // gridArray[columnMouse][rowMouse] = 1;
                        for (let l of placeShapeFinal) {
                            gridArray[l.x][l.y] = 1;
                        }
                    }
                    else if (currentPlacement === 2) {
                        // gridArray[columnMouse][rowMouse] = 2;
                        for (let l of placeShapeFinal) {
                            gridArray[l.x][l.y] = 2;
                        }
                    }
                }
                else if (mouseButton === RIGHT) {
                    // gridArray[columnMouse][rowMouse] = 0;
                    for (let l of placeShapeFinal) {
                        gridArray[l.x][l.y] = 0;
                    }
                }
            }
        }
    }
};

function updateLiquids() {
    columnShuffle();
    for (let j = grid.rows - 1; j >= 0; j--) {
        for (const i of shuffledColumns) {
            if (gridArray[i][j] === 2) {
                if (pause === false) {
                    let belowIsEmpty = (j + 1 < grid.rows && gridArray[i][j + 1] === 0);
                    if (belowIsEmpty) {
                        gridArray[i][j] = 0;
                        gridArray[i][j + 1] = 2;
                        continue;
                    }

                    let belowIsSolid = (j + 1 >= grid.rows || gridArray[i][j + 1] === 1 || gridArray[i][j + 1] === 2);

                    if (belowIsSolid) {

                        let rightDownEmpty = (i + 1 < grid.columns && j + 1 >= grid.rows && gridArray[i + 1][j + 1] === 0);
                        let leftDownEmpty = (i - 1 >= grid.columns && j + 1 >= grid.rows && gridArray[i - 1][j + 1] === 0);

                        if (rightDownEmpty || leftDownEmpty) {
                            if (rightDownEmpty && leftDownEmpty) {
                                if (Math.random() < 0.5) {
                                    gridArray[i][j] = 0;
                                    gridArray[i + 1][j + 1] = 2;
                                } else {
                                    gridArray[i][j] = 0;
                                    gridArray[i - 1][j + 1] = 2;
                                }
                            }
                            else if (rightDownEmpty) {
                                gridArray[i][j] = 0;
                                gridArray[i + 1][j + 1] = 2;
                            } else if (leftDownEmpty) {
                                gridArray[i][j] = 0;
                                gridArray[i - 1][j + 1] = 2;
                            }
                        }

                        let rightEmpty = (i + 1 < grid.columns && gridArray[i + 1][j] === 0);
                        let leftEmpty = (i - 1 >= 0 && gridArray[i - 1][j] === 0);


                        if (rightEmpty || leftEmpty) {
                            if (rightEmpty && leftEmpty) {
                                if (Math.random() < 0.5) {
                                    gridArray[i][j] = 0;
                                    gridArray[i + 1][j] = 2;
                                } else {
                                    gridArray[i][j] = 0;
                                    gridArray[i - 1][j] = 2;
                                }
                            } else if (rightEmpty) {
                                gridArray[i][j] = 0;
                                gridArray[i + 1][j] = 2;
                            } else if (leftEmpty) {
                                gridArray[i][j] = 0;
                                gridArray[i - 1][j] = 2;
                            }
                        }
                    }
                }
            }
        }
    }
};

function clickCooldown() {
    if (millis() - lastPaint >= cooldown) {
        lastPaint = millis()
        gridClickCheck()
    }
};

function movementCooldown() {
    if (millis() - lastMove >= moveCooldown) {
        lastMove = millis();
        for (let k = 0; k < 3; k++) { // 3 passes per frame
            updateLiquids();
        }
    }
}

function sliderChecks() {
    if (gridSlider.value != lastGridSlider) {
        grid.columns = parseInt(gridSlider.value);
        grid.rows = parseInt(gridSlider.value);
        calculateGridSize();
        gridReset();
        lastGridSlider = gridSlider.value;
        gridSliderText.innerText = "Grid Size (" + grid.columns + ")";
    }
    cooldown = parseInt(paintSlider.value);
    moveCooldown = parseInt(moveSlider.value);
    lineOpacity = parseInt(lineSlider.value);
    paintSliderText.innerText = "Paint Cooldown (" + cooldown + " ms)";
    moveSliderText.innerText = "Update Cooldown (" + moveCooldown + " ms)";
    lineSliderText.innerText = "Line Opacity (" + lineOpacity + ")";
};

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\