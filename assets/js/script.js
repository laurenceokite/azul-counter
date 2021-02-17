const board = document.querySelector('#tile-board');
const tileSelect = document.querySelector('#tile-select');
const scoreDisplay = document.querySelector('#score-display');
const lastDrag = {};
const dragStartColor = {};
const occupiedTiles = [];

let score = 0;

function dragStartHandler(event) {
    dragStartColor.color = event.target.id;
}

function dragOverHandler(event) {
    event.preventDefault();

    const tile = event.target;

    if (tile.id !== 'tile-board' && tile.id !== lastDrag.id) {
        if (lastDrag.id) {
            document.querySelector(`#${lastDrag.id}`).classList.remove('hover');  
        }
        tile.classList.add('hover'); 
        lastDrag.id = tile.id;
    }
};

function orderOccupiedRow(location, direction) {
    if (direction === 'file') {
        const tiles = occupiedTiles.filter(tile => location === tile.file)
        .sort(function (a, b) {
            return a.rank - b.rank;
        });
        return tiles;
    } else if (direction === 'rank') {
        const tiles = occupiedTiles.filter(tile => location === tile.rank)
        .sort(function (a, b) {
            return a.file - b.file;
        });
        return tiles;
    }
}

function countOccupiedRow(newTileIndex, direction, rank, file, fileTiles) {
    let value = 0
    let rowBonus = 0;
    let row;
    let rowString;

    switch(direction) { 
        case 'file':
            row = rank;
            break;
            console.log(row, 'file');
        case 'rank':
            row = file;
            console.log(row, 'rank');
    }
    switch(direction) {
        case 'file':
            rowString = 'rank';
            break;
        case 'rank':
            rowString = 'file';
    }
    //count up
    if (row < 5) {
        let lastRow = parseInt(row);
        for (let index = newTileIndex + 1; index < 5; index++) {
            if (fileTiles[index] && fileTiles[index][rowString] == lastRow + 1) {
                lastRow++;
                value++;
                rowBonus++;
            } else {
                break
            } 
        }
    }
    //count down
    if (row > 1) {
        let lastRow = parseInt(row);

        for (let index = newTileIndex - 1; index >= 0; index--) {
            if (fileTiles[index] && fileTiles[index][rowString] == lastRow - 1) {
                lastRow--; 
                value++;
                rowBonus++;
            } else {
                break
            } 
        }
    }
    //check for bonus 
    switch(direction) {
        case 'file':
            if (rowBonus === 4) {
                value = value + 7;
            }
            break;
        case 'rank':
            if (rowBonus === 4) {
                value = value + 2;
            }
    }

    return value;
}

function valueCounter(newTile, color) {
    const file = newTile[1];
    const rank = newTile[2];

    let value = 0;
    const fileAdjacent = false;
    const rankAdjacent = true;

    //check file

    //order by rank
    const fileTiles = orderOccupiedRow(file, 'file'); 
    //get index of new tile 
    let newTileIndex = fileTiles.findIndex(tile => tile.rank === rank);
    //count value of file
    value = countOccupiedRow(newTileIndex, 'file', rank, file, fileTiles);
    //check rank

    //order by rank
    const rankTiles = orderOccupiedRow(rank, 'rank'); 
    //get index of new tile 
    newTileIndex = rankTiles.findIndex(tile => tile.file === file);
    value = value + countOccupiedRow(newTileIndex, 'rank', rank, file, rankTiles);
    //check color
    const sameColor = occupiedTiles.filter(tile => tile.color === color)
    if (sameColor.length >= 5) {
        value = value + 10;
    }
    return value;
}

function dropHandler(event) {
    event.preventDefault();

    const tile = event.target;

    document.querySelector(`#${lastDrag.id}`).classList.remove('hover');

    if (tile.id === 'tile-board') {
        return
    }
    
    tile.dataset.color = dragStartColor.color;

    const splitId = tile.id.split('');

    occupiedTiles.push({
        'file': splitId[1],
        'rank': splitId[2],
        'color': tile.dataset.color
    });

    score++

    const newTileValue = valueCounter(splitId, tile.dataset.color);

    score = score + newTileValue;

    //display score
    scoreDisplay.innerHTML = 'Score: ' + score;
}

function boardClickHandler() {

}

tileSelect.addEventListener('dragstart', dragStartHandler);
board.addEventListener('dragover', dragOverHandler);
board.addEventListener('drop', dropHandler);
board.addEventListener('click', boardClickHandler);