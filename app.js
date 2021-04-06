document.addEventListener('DOMContentLoaded', () => {
    const colorCells = ['background-0', 'background-2', 'background-4', 'background-8', 'background-16', 
        'background-32', 'background-64', 'background-128', 'background-256', 'background-512', 'background-1024', 
        'background-2048', 'background-4096', 'background-8192', 'background-16384', 'background-32768', 'background-65536', 
        'background-131072'];
    let numberToWin = 2048;
    let width = 4;

    //SELECT DIFFICULT OF GAME
    selectDifficult = () => {
        const selectedSize = parseInt(document.getElementById('selectSize').value);
        const selectedPoitingWin = parseInt(document.getElementById('selectPoitingWin').value);

        document.getElementById('size').innerHTML = `${selectedSize}x${selectedSize}`;
        document.getElementById('poitingWin').innerHTML = selectedPoitingWin;

        width = selectedSize;
        numberToWin = selectedPoitingWin;

        document.getElementById('controls').classList.add('displayNone');
        document.getElementById('board').classList.remove('displayNone');

        startBoard();
    }

    //START BOARD
    startBoard = () => {
        
        const numberCells = Math.pow(width, 2);
        const gridDisplay = document.getElementById('grid');
        const scoreDisplay = document.getElementById('score');
        const resultDisplay = document.getElementById('result');
    
        let score = 0;
        let cells = new Array(...Array(numberCells).keys());
        
        //CREATE THE BOARD
        createBoard = () => {
            cells = cells.map(() => {
                const cell = document.createElement('div');
                cell.innerHTML = 0;
                gridDisplay.appendChild(cell);
                return cell;
            });
    
            gridDisplay.querySelectorAll('div').forEach((element, index) => {
                element.classList.add(`w-${width}`);
            });
    
            generate();
            generate();
        }
    
        //GENERATE NUMBER RANDOM
        generate = () => {
            let randomNumber = Math.floor(Math.random() * cells.length);
            const numberGenerated = Math.floor(Math.random()/0.96);

            if (cells[randomNumber].innerHTML == 0) {
                cells[randomNumber].innerHTML = numberGenerated ? 4 : 2;

                checkColors();
                checkForGameOver();
            } else generate()
        }
    
        //SWIPE RIGHT
        moveRight = () => {
            for (let i = 0; i < numberCells; i++) {
                if (i % width === 0) {
                    const row = [];
    
                    for (let j = 0; j < width; j++) {
                        row.push(parseInt(cells[i + j].innerHTML));
                    }
    
                    const filteredRow = row.filter(num => num);
                    const missing = width - filteredRow.length;
                    const zeros = Array(missing).fill(0);
    
                    const newRow = zeros.concat(filteredRow);
    
                    for (let j = 0; j < width; j++) {
                        cells[i + j].innerHTML = newRow[j];
                    }
                }
            }
        }
    
        //SWIPE LEFT
        moveLeft = () => {
            for (let i = 0; i < numberCells; i++) {
                if (i % width === 0) {
                    const row = [];
    
                    for (let j = 0; j < width; j++) {
                        row.push(parseInt(cells[i + j].innerHTML));
                    }
    
                    const filteredRow = row.filter(num => num);
                    const missing = width - filteredRow.length;
                    const zeros = Array(missing).fill(0);
    
                    const newRow = filteredRow.concat(zeros);
    
                    for (let j = 0; j < width; j++) {
                        cells[i + j].innerHTML = newRow[j];
                    }
                }
            }
        }
    
        //SWIPE UP
        moveUp = () => {
            for (let i = 0; i < Math.sqrt(numberCells); i++) {
                const column = [];
    
                for (let j = 0; j < width; j++) {
                    column.push(parseInt(cells[i + width * j].innerHTML));
                }
    
                const filteredColumn = column.filter(num => num);
                const missing = width - filteredColumn.length;
                const zeros = Array(missing).fill(0);
    
                const newColumn = filteredColumn.concat(zeros);
    
                for (let j = 0; j < width; j++) {
                    cells[i + width * j].innerHTML = newColumn[j];
                }
            }
        }
    
        //SWIPE DOWN
        moveDown = () => {
            for (let i = 0; i < Math.sqrt(numberCells); i++) {
                const column = [];
    
                for (let j = 0; j < width; j++) {
                    column.push(parseInt(cells[i + width * j].innerHTML));
                }
    
                const filteredColumn = column.filter(num => num);
                const missing = width - filteredColumn.length;
                const zeros = Array(missing).fill(0);
    
                const newColumn = zeros.concat(filteredColumn);
    
                for (let j = 0; j < width; j++) {
                    cells[i + width * j].innerHTML = newColumn[j];
                }
            }
        }

        //CHECK COLORS CELLS
        checkColors = () => {
            for (let i = 0; i < numberCells; i++) {
                const valueCell = parseInt(cells[i].innerHTML);
                cells[i].className = `w-${width}`;
                cells[i].classList.add(colorCells[valueCell ? Math.log2(valueCell) : 0]);
            }
        }
    
        //COMBINE
        combine = (param) => {
            for (let i = 0; i < numberCells - param; i++) {
                if (cells[i].innerHTML === cells[i + param].innerHTML) {
                    const combinedTotal = parseInt(cells[i].innerHTML) + parseInt(cells[i + param].innerHTML);
    
                    cells[i].innerHTML = combinedTotal;
                    cells[i + param].innerHTML = 0;

                    score += combinedTotal;
                    scoreDisplay.innerHTML = score;
                }
            }

            checkForWin();
        }
    
        //COMBINE ROW
        combineRow = () => {
            combine(1);
        }
    
        //COMBINE COLUMN
        combineColumn = () => {
            combine(width);
        }
    
        //ASSIGN KEYCODES
        controlKeys = (e) => {
            if (e.keyCode === 39) {
                keyRight();
            } else if (e.keyCode === 37) {
                keyLeft();
            } else if (e.keyCode === 38) {
                keyUp();
            } else if (e.keyCode === 40) {
                keyDown();
            }
        }
    
        keyRight = () => {
            moveRight();
            combineRow();
            moveRight();
            generate();
        }
    
        keyLeft = () => {
            moveLeft();
            combineRow();
            moveLeft();
            generate();
        }
    
        keyUp = () => {
            moveUp();
            combineColumn();
            moveUp();
            generate();
        }
    
        keyDown = () => {
            moveDown();
            combineColumn();
            moveDown();
            generate();
        }
    
        //CHECK IF USER'S WIN
        checkForWin = () => {
            for (let i = 0; i < numberCells; i++) {
                if (cells[i].innerHTML == numberToWin || cells[i].innerHTML == 131072) {
                    resultDisplay.innerHTML = 'U Win!!!';
                    document.removeEventListener('keyup', controlKeys);
                }
            }
        }
    
        // CHECK IF USER'S LOSE
        checkForGameOver = () => {
            let zeros = 0;
            
            for (let i = 0; i < numberCells; i++) {
                if (cells[i].innerHTML == 0) {
                    zeros++;
                }
            }
    
            if (zeros === 0) {
                resultDisplay.innerHTML = 'U Lose!!!';
                document.removeEventListener('keyup', controlKeys);
            }
        }
    
        createBoard();
    
        document.addEventListener('keyup', controlKeys);
    }
});