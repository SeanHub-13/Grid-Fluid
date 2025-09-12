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
            stroke(0, 0, 0, lineOpacity);
            rect(x, y, grid.squareW, grid.squareH);
            pop();

        }
    }
};

function gridReset() {
    for (let i = 0; i < grid.columns; i++) {
        gridArray[i] = [];
        for (let j = 0; j < grid.rows; j++) {
            gridArray[i][j] = 0;
        }
    }
};

function keyPressed() {
    if (key === '1') {
        currentPlacement = 1;
    }

    if (key === '2') {
        currentPlacement = 2;
    }
    console.log(currentPlacement);
};

function gridClickCheck() {
    if (mouseIsPressed) {
        let columnMouse = Math.floor((mouseX - grid.offsetX) / grid.squareW);
        let rowMouse = Math.floor((mouseY - grid.offsetY) / grid.squareH);
        if (columnMouse >= 0 && columnMouse < grid.columns && rowMouse >= 0 && rowMouse < grid.rows && mouseX >= grid.offsetX && mouseX <= grid.offsetX + grid.columns * grid.squareW && mouseY >= grid.offsetY && mouseY <= grid.offsetY + grid.rows * grid.squareH) {
            if (mouseButton === LEFT) {
                if (currentPlacement === 1) {
                    gridArray[columnMouse][rowMouse] = 1;
                }
                else if (currentPlacement === 2) {
                    gridArray[columnMouse][rowMouse] = 2;
                }
            }
            else if (mouseButton === RIGHT) {
                gridArray[columnMouse][rowMouse] = 0;
            }
        }
    }
};

function updateLiquids() {
    for (let j = grid.rows - 1; j >= 0; j--) {
        for (let i = 0; i < grid.columns; i++) {
            if (gridArray[i][j] === 2) {
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