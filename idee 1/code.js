const rows = 30;
let cols = 30;

let playing = false; 
let grid = new Array(rows);
const nextGrid = new Array(rows);

let timer;
const reproductionTime = 100;

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

function createTable() {
    let gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        console.error("Problem: No div for the grid table!");
    }
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) { 
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    const rowcol = this.id.split("_");
    const row = rowcol[0];
    const col = rowcol[1];

    const classes = this.getAttribute("class");
    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupControlButtons() {
    const startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;

    let clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;

    const randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let isLive = Math.round(Math.random());
            if (isLive == 1) {
                let cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");

    playing = false;
    const startButton = document.getElementById('start');
    startButton.innerHTML = "Start";
    clearTimeout(timer);

    const cellsList = document.getElementsByClassName("live");
    const cells = [];
    for (let i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();  // Corrected to ensure the grid is reset
}

function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

function play() {
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }

    copyAndResetGrid();
    updateView();
}

function applyRules(row, col) {
    const numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3 || numNeighbors == 6) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    let count = 0;
    if (row - 1 >= 0) {
        if (grid[row - 1][col] == 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] == 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < cols) {
        if (grid[row - 1][col + 1] == 1) count++;
    }
    if (col - 1 >= 0) {
        if (grid[row][col - 1] == 1) count++;
    }
    if (col + 1 < cols) {
        if (grid[row][col + 1] == 1) count++;
    }
    if (row + 1 < rows) {
        if (grid[row + 1][col] == 1) count++;
    }
    if (row + 1 < rows && col - 1 >= 0) {
        if (grid[row + 1][col - 1] == 1) count++;
    }
    if (row + 1 < rows && col + 1 < cols) {
        if (grid[row + 1][col + 1] == 1) count++;
    }
    return count;
}

window.onload = initialize;