//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let backRect = null;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let gridArray = [];
let square = null;

const grid = {
    columns: 24,
    rows: 24,
    squareW: null,
    squareH: null,
    offsetX: 0,
    offsetY: 0,
    fillFalse: {
        r: 255,
        g: 255,
        b: 255
    },
    fillTrue: {
        r: 50,
        g: 225,
        b: 50
    }
}

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

ctx.fillStyle = "white"
backRect = ctx.fillRect(0, 0, 800, 800);



function createGrid() {

    grid.squareW = canvasWidth / grid.columns;
    grid.squareH = canvasHeight / grid.rows;

    ctx.fillStyle = "black"

    for (let i = 0; i < grid.columns; i++) {
        for (let j = 0; j < grid.rows; j++) {

            const x = i * grid.squareW;
            const y = j * grid.squareH;

            gridArray.push({
                x,
                y,
                w: grid.squareW,
                h: grid.squareH,
                i,
                j
            });

            ctx.strokeRect(x, y, grid.squareW, grid.squareH);

        }
    }

}

function gridCheck() {
    canvas.addEventListener("mousedown", function (e) {
        let bounds = canvas.getBoundingClientRect();
        let mouseX = e.clientX - bounds.left;
        let mouseY = e.clientY - bounds.top;
        console.log(mouseX, mouseY);
        for (let k = 0; k < gridArray.length; k++) {
            square = gridArray[k];
            if (
                mouseX >= square.x &&
                mouseX < square.x + square.w &&
                mouseY >= square.y &&
                mouseY < square.y + square.h
            ) {
                console.log(`Mouse is in square: (${square.i}, ${square.j})`);

                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
                ctx.fillRect(square.x, square.y, square.w, square.h);
            }
        }
    });
};

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

createGrid();
gridCheck();

console.log("Loaded!");
console.log("Width: " + canvasWidth);
console.log("Height: " + canvasHeight);