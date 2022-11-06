import test from "node:test";
import { Leaderboard } from "../model/models";
const path = require('node:path');
const fs = require('fs');

// funzione che inizializza le griglie dei giocatori
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


// funzione che pizza le navi sulle griglie dei giocatori
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


/*
* Funzione che:
*        1) scegle rendomicamente una casella 
*        2) check se la casella è vuota
*        3) check sulle orientazioni possibili
*        4) sceglie un'orientamento casuale
*        5) piazza la nave
*/
function placeShip(shipName: string, shipDim: number, grid: any) {

    let shipPlaced: boolean = false;
    let gridDim: number = grid.length;
    while (shipPlaced !== true) {
        let row: number = Math.floor(Math.random() * gridDim);
        let col: number = Math.floor(Math.random() * gridDim);
        let orientation: string = ''; 
        
        // check se nella cella o nelle celle vicine c'è già un'altra nave (da aggiungere anche ad allowed orentation)
        /*
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if ((row-1+j) >= 0 && (row-1+j) < gridDim && (col-1+k) >= 0 && (col-1+k) < gridDim && grid[row-1+j][col-1+k] !== 'W') {
                    continue loop;
                }
            }
        }
        */

        // check se nella cella c'è già un'altra nave 
        if (grid[row][col] !== 'W') {
            continue;
        }

        // se la dimensione della nave è 1 non serve l'orientamento
        if (shipDim !== 1) {
            var orientations: string[] = allowedOrientations(row, col, shipDim, grid);
            if (orientations.length == 0 ) {
                continue;
            }
            orientation = orientations[Math.floor(Math.random() * orientations.length)];
        }

        // si posiziona la nave a seconda dell'orientamento scelto casualmente
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


// funzione che fa un check sui possibili orientamenti della nave
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

/*
// funzione che riporta nella leaderboard tutti i dati necessari sulla vittoria del giocatore
export async function updateLeaderboardWin(email: string, logMoves: any): Promise<void> {
    let leaderboard: any;
    let avgMoves: number;
    let numMoves: number;
    let numMatch: number;
    let numMatchWin: number;
    let winRatio: number;
    let minMoves: number;
    let maxMoves:number;
    let stdDev: number = 0;

    numMoves = Math.round(logMoves.length / 2);

    leaderboard = await Leaderboard.findByPk(email);

    if(!leaderboard) {
        Leaderboard.create({
            email: email,
            total_matches: 1,
            wins: 1,
            losses: 0,
            win_ratio: 1,
            avg_moves: numMoves,
            max_moves: numMoves,
            min_moves: numMoves,  
            std_dev: stdDev
        });
    }
    else {
        numMatch = leaderboard.total_matches + 1;
        numMatchWin = leaderboard.wins + 1;
        winRatio = Math.round((numMatchWin/numMatch + Number.EPSILON) * 100) / 100;

        if(leaderboard.avg_moves) {
            avgMoves = (leaderboard.avg_moves * leaderboard.wins + numMoves) / numMatchWin;
            // da controllare
            stdDev = Math.sqrt((Math.pow(leaderboard.std_dev, 2) * numMatchWin + Math.pow(avgMoves - numMoves, 2)) / (numMatchWin + 1)); 

            if(numMoves < leaderboard.min_moves) minMoves = numMoves;
            else minMoves = leaderboard.min_moves;
            if(numMoves > leaderboard.max_moves) maxMoves = numMoves;
            else maxMoves = leaderboard.max_moves;
        }
        else {
            avgMoves = numMoves,
            minMoves = numMoves,
            maxMoves = numMoves
        }

        Leaderboard.update({
            total_matches: numMatch,
            wins: numMatchWin,
            win_ratio: winRatio,
            avg_moves: avgMoves,
            min_moves: minMoves,
            max_moves: maxMoves,
            std_dev: stdDev
        },
        {
            where: { email: email }
        });
    }
}


// funzione che riporta nella leaderboard tutti i dati necessari sulla sconfitta del giocatore
export async function updateLeaderboardLose(email: string, logMoves: any): Promise<void> {
    let leaderboard: any;
    let numMoves: number;
    let numMatch: number;
    let numMatchLose: number;
    let winRatio: number;

    numMoves = Math.round((logMoves.length - 1) / 2);

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
            win_ratio: winRatio,
        },
        {
            where: { email: email }
        });
    }
}
*/

export function exportAsJSON(logMoves: any, exportPath: string) {
    let logMovesJSON = JSON.stringify(logMoves);

    fs.writeFile(exportPath, logMovesJSON, 'utf8', (err: any) => {
        if (err) throw err;
        console.log('Game\'s log exported succesfully to: ', exportPath);
    });
}


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
