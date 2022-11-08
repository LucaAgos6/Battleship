import {Game, Leaderboard} from '../model/models';
import fs from 'fs';

/**
* Initializes player's grids, creating an empty grid for each player
* @param gridDim -> desired grid dimension
* @returns -> object containing empty grids of gridDim x gridDim dimension
*/
export function gridInitialize(gridDim: number) {
    type stringArray = {
        grid1: any[],
        grid2: any[],
        init_grid1: any[],
        init_grid2: any[]
      };

    let obj: stringArray = {
        grid1: [],
        grid2: [],
        init_grid1: [],
        init_grid2: []
    }

    Object.values(obj).forEach(val => {
        for (let i = 0; i < gridDim; i++) {
            let temp_row: Array<string> = new Array<string>(gridDim).fill('W');
            val.push(temp_row);
        }
    })
    return obj;
}


/**
* Randomly place the ships on the grid of both players
* @param obj -> object containing the grids
* @param shipsConfig -> object containing ships configuration
* @param shipDims -> object containing ship's dimension for each type
* @returns -> return an object containing grids with ships
*/
export function arrangeShips(obj: any, shipsConfig: any, shipDims: any) {
    let grid1: any = obj.grid1;
    let grid2: any = obj.grid2;

    for (let ship in shipsConfig) {
        if (shipsConfig[ship] <= 0) {
            continue;
        }

        let shipCount: any = shipsConfig[ship]
        let shipDim: any = shipDims[ship]

        for (let i = 1; i < shipCount + 1; i++) {
            let shipName: string= ship + String(i)
            grid1 = placeShip(shipName, shipDim, grid1);
            grid2 = placeShip(shipName, shipDim, grid2);
        }
    }

    obj.init_grid1 = grid1;
    obj.init_grid2 = grid2;
    return obj;
}


/**
* Place a ship on the grid
* @param shipName -> ship name (i.e. A1, B2, B3 etc.)
* @param shipDim -> ship dimension in cell (i.e. 2 cells long, 3 cells, etc.)
* @param grid -> a (griDim x gridDim) matrix where the ship needs to be placed
* @returns -> grid with a ship fully placed
*/
function placeShip(shipName: string, shipDim: number, grid: any) {

    let shipPlaced: boolean = false;
    let gridDim: number = grid.length;
    while (shipPlaced !== true) {
        let row: number = Math.floor(Math.random() * gridDim);
        let col: number = Math.floor(Math.random() * gridDim);
        let orientation: string = ''; 
        
        // check if the chosen cell is water (i.e. is free)
        if (grid[row][col] !== 'W') {
            continue;
        }

        // if the ship dimension is 1 there's no need to choose an orientation
        if (shipDim !== 1) {
            var orientations: string[] = allowedOrientations(row, col, shipDim, grid);
            if (orientations.length == 0 ) {
                continue;
            }
            orientation = orientations[Math.floor(Math.random() * orientations.length)];
        }

        // after picking a random orientation between the available ones,
        // the ship get placed on the grid
        switch(orientation) {
            case 'up':
                for (let i = 0; i < shipDim; i++) {
                    grid[row - i][col] = shipName;
                }
                break;
            case 'down':
                for (let i = 0; i < shipDim; i++) {
                    grid[row + i][col] = shipName;
                }
                break;
            case 'left':
                for (let i = 0; i < shipDim; i++) {
                    grid[row][col - i] = shipName;
                }
                break;
            case 'right':
                for (let i = 0; i < shipDim; i++) {
                    grid[row][col + i] = shipName;
                }
                break;
            default:
                grid[row][col] = shipName;
        }
        shipPlaced = true;
    }
    return grid;
}


// check which orientations are available for the current ship
function allowedOrientations(row: number, col: number, shipDim: number, grid: string) {
    let orientations: string[] = [];
    let isAllowed: boolean = false;

    // check up
    for (let i = 1; i < shipDim; i++) {
        isAllowed = true;
        if (row - i < 0 || grid[row - i][col] !== 'W' ) {
            isAllowed = false;
            break;
        }
    }
    if (isAllowed === true) orientations.push('up');

    // check down
    for (let i = 1; i < shipDim; i++) {
        isAllowed = true;
        if (row + i > shipDim || grid[row + i][col] !== 'W' ) {
            isAllowed = false;
            break;
        }
    }
    if (isAllowed === true) orientations.push('down');

    // check left
    for (let i = 1; i < shipDim; i++) {
        isAllowed = true;
        if (col - i < 0 || grid[row][col - i] !== 'W' ) {
            isAllowed = false;
            break;
        }
    }
    if (isAllowed === true) orientations.push('left');

    // check right
    for (let i = 1; i < shipDim; i++) {
        isAllowed = true;
        if (col + i > shipDim || grid[row][col + i] !== 'W' ) {
            isAllowed = false;
            break;
        }
    }
    if (isAllowed === true) orientations.push('right');

    return orientations;
}


/**
* Update leaderboard data for the winning player
* @param email 
*/
export async function updateLeaderboardWin(email: string): Promise<void> {
    let leaderboard: any;
    let numMatch: number;
    let numMatchWin: number;
    let winRatio: number;

    leaderboard = await Leaderboard.findByPk(email);

    if(!leaderboard) {
        Leaderboard.create({
            email: email,
            total_matches: 1,
            wins: 1,
            losses: 0,
            win_ratio: 1,
        });
    }
    else {
        numMatch = leaderboard.total_matches + 1;
        numMatchWin = leaderboard.wins + 1;
        winRatio = Math.round((numMatchWin/numMatch + Number.EPSILON) * 100) / 100;

        Leaderboard.update({
            total_matches: numMatch,
            wins: numMatchWin,
            win_ratio: winRatio
        },
        {
            where: { email: email }
        });
    }
}


/**
* Update leaderboard data for the losing player
* @param email -> loser email
*/
export async function updateLeaderboardLose(email: string): Promise<void> {
    let leaderboard: any;
    let numMatch: number;
    let numMatchLose: number;
    let winRatio: number;

    leaderboard = await Leaderboard.findByPk(email);

    if(!leaderboard) {
        Leaderboard.create({
            email: email,
            total_matches: 1,
            wins: 0,
            losses: 1,
            win_ratio: 0
        });
    }
    else {
        numMatch = leaderboard.total_matches + 1;
        numMatchLose = leaderboard.losses + 1;
        winRatio = Math.round((1 - numMatchLose/numMatch + Number.EPSILON) * 100) / 100;

        Leaderboard.update({
            total_matches: numMatch,
            losses: numMatchLose,
            win_ratio: winRatio
        },
        {
            where: { email: email }
        });
    }
}


/**
* Export the game log as a json file
* @param logMoves -> object containing the moves log
* @param exportPath -> exported file path
*/
export function exportAsJSON(logMoves: any, exportPath: string) {
    let logMovesJSON = JSON.stringify(logMoves);

    fs.writeFile(exportPath, logMovesJSON, 'utf8', (err: any) => {
        if (err) throw err;
        console.log('Game\'s log exported succesfully to: ', exportPath);
    });
}


/**
* Export the game log as a json file
* @param logMoves -> object containing the moves log
* @param exportPath -> exported file path
*/
export function exportAsCSV(logMoves: any, exportPath: string) {
    let headerLine: string = 'Player, Row, Col';
    let moves = logMoves.moves;
    moves.unshift(headerLine);

    var logMovesCSV = moves.map(function(element: any){
        if (element == moves[0]) return element;
        return JSON.stringify(Object.values(element));
    })
    .join('\n')
    .replace(/(^\[)|(\]$)/mg, '');
    
    fs.writeFile(exportPath, logMovesCSV, 'utf8', (err: any) => {
        if (err) throw err;
        console.log('Game\'s log exported succesfully to: ', exportPath);
    });
}


/**
* Check if a ship has been sunk and check if the game is over
* @param shipHit 
* @param grid 
* @param gridDim 
* @returns 
*/
export function returnGridState(shipName: string, grid: any, gridDim: number) {
    let isGameClosed: boolean = true;
    let isShipSunk: boolean = true;
    let gridState: any = {
        isShipSunk,
        isGameClosed
    };

    for(let j = 0; j < gridDim; j++) {
        for(let k = 0; k < gridDim; k++) {
            if(grid[j][k] === shipName) {
                gridState.isShipSunk = false;
            }
            if(grid[j][k] !== 'X' && grid[j][k] !== 'O' && grid[j][k] !== 'W') {
                gridState.isGameClosed = false;
            }
        }
    }
    return gridState
}


/**
* Execute a random allowed move for the AI
* @param game 
*/
export function executeAIMove(game: any) {
    let gridState: any;
    let isGameClosed: boolean = true;
    let shipName: string = 'O';
    let allowedMove: boolean = false;
    let row: number = 0;
    let col: number = 0;

    while (allowedMove === false) {
        row = Math.floor(Math.random() * game.grid_dim);
        col = Math.floor(Math.random() * game.grid_dim);

        if (game.grids.grid1[row][col] !== 'X' && game.grids.grid1[row][col] !== 'O') {
            allowedMove = true;
        }
    }

    let move = {
        "player": "AI",
        "row": row,
        "col": col
    }

    game.log_moves.moves.push(move);

    // Set the grid cell value: 'O' means water hit, 'X' means ship hit
    if(game.grids.grid1[row][col] === 'W') {
        game.grids.grid1[row][col] = 'O';
    }
    else {
        shipName = game.grids.grid1[row][col];
        game.grids.grid1[row][col] = 'X';
    }

    // check if a ship has been sunk and the game is over
    gridState = returnGridState(shipName, game.grids.grid1, game.grid_dim);

    isGameClosed = gridState.isGameClosed;

    if(isGameClosed === true) {
        game.game_status = 'closed';
        game.winner = game.player2;
        game.loser = game.player1;

        updateLeaderboardWin(game.player2);
        updateLeaderboardLose(game.player1);
    }

    Game.update({
        game_status: game.game_status,
        player_turn: game.player1,
        grids: game.grids,
        winner: game.winner,
        loser: game.loser,
        log_moves: game.log_moves
    },
    {
        where: {id: game.id}
    });
}
