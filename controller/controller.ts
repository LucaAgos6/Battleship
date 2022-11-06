import {Users, Game, Leaderboard} from '../model/models';
import { ErrorEnum, getError, Success } from '../factory/factory';
import * as Utils from '../utils/utils';
import path from 'path';
import * as SequelizeQueries from './sequelizeQueries'

/**
 * Returns true if the user exist in database, false otherwise
 * @param email -> player email
 * @param res -> response
 * @returns -> true if user exist, false otherwise
 */
export async function checkUser(email: string, res: any): Promise<boolean> {
    let result: any;
    try {
        result = await Users.findByPk(email, { raw: true });
    } catch (error) {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }
    return result;
}


/**
 * Returns user role
 * @param email -> user email
 * @param res -> response
 * @returns -> user role (admin/user)
 */
export async function getRole(email: string, res: any): Promise<string> {
    let result: any;
    try {
        result = await Users.findByPk(email, { raw: true });
    } catch (error) {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }
    return result.role;
}


/**
 * Returns user remaining token
 * @param email -> user email
 * @param res -> response
 * @returns -> user token
 */
export async function getToken(email: string, res: any): Promise<number> {
    let result: any;
    try {
        result = await Users.findByPk(email, { raw: true });
    } catch (error) {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    };
    return result.token;
}


/**
 * Returns the appropriate error
 * @param enum_error -> error type
 * @param err -> catched error
 * @param res -> server response
 */
 function controllerErrors(enum_error: ErrorEnum, err: any, res: any): void {
    const new_err = getError(enum_error).getMsg();
    console.log(err);
    res.status(new_err.status).json({ error: new_err.status, message: new_err.msg });
}


/**
 * Refill user's token
 * @param email -> user email
 * @param token -> token amount to refill
 * @param res -> response
 */
export function refill(email: string, token: number, res: any): void {
    Users.update({ token: token }, { where: { email: email } })
        .then(() => {
            const new_res = new Success().getMsg();
            res.status(new_res.status).json({ status: new_res.status, message: new_res.msg });
        })
        .catch((error) => {
            controllerErrors(ErrorEnum.ErrServer, error, res);
        })
}


/**
 * Returns user's token
 * @param email -> user email
 * @param res -> response
 */
export function showToken(email: string, res: any): void {
    Users.findByPk(email, { raw: true }).then((item: any) => {
        res.send("Remaining token: " + item.token)
    }).catch((error) => {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    })
}


/**
 * Update user's remaining tokens
 * @param email -> user email
 * @param cost -> amount of tokens to substract
 * @param res -> response
 */
export function updateToken(email: string, cost: number, res: any): void {
    getToken(email, res).then((token) => { 
        token = token - cost;
        token = Math.round((token + Number.EPSILON) * 100) / 100;
        Users.update({ token: token }, { where: { email: email } });
        console.log("Remaining token: " + (token));
     }).catch((error) => {
            controllerErrors(ErrorEnum.ErrServer, error, res);
        })
}


/**
 * Create a new game on db
 * @param player1 -> player1 email
 * @param player2 -> player2 email
 * @param gridDim -> grid dimension
 * @param shipsConfig -> json containing the number and type of each ship
 * @param shipDims -> ships' parameters (i.e. names and dimensions)
 * @param res -> response
 */
export async function createGame(player1: string, player2: string, gridDim: number, shipsConfig: JSON, shipDims: JSON, res: any): Promise<void> {
    
    // grid initializazion with random ships placement
    var grids: Object = Utils.gridInitialize(gridDim);
    grids = Utils.arrangeShips(grids, shipsConfig, shipDims);

    let logMoves: any = {
        "moves": []
    };

    let gameStatus: string = 'in progress';
    const now: Date = new Date();

    try{
        await Game.create({
            player1: player1, 
            player2: player2, 
            game_status: gameStatus, 
            player_turn: player1, 
            grid_dim: gridDim, 
            grids: grids, 
            log_moves: logMoves, 
            game_date: now.toLocaleDateString()
        });

        res.status(200).json({
            status: 200,
            player1: player1, 
            player2: player2, 
            game_status: gameStatus, 
            player_turn: player1, 
            grid_dim: gridDim, 
            game_date: now.toLocaleDateString()
        });
    }
    catch(error){
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }
}


/**
 * Check if a user has an ongoing game
 * @param email -> user email
 * @param player -> user email
 * @returns 
 */
export async function checkGameInProgress(email: string, player: string): Promise<boolean> {
    let result: any;
    let status: string = 'in progress';
    result = await Game.findOne({where: {[player]: email, game_status: status}});
    return result;
}


/**
 * Check if a game exist in db given its id
 * @param id -> game id
 * @returns -> true if the game exist, false otherwise
 */
export async function checkGameExistById(id: string): Promise<boolean> {
    let result: any;
    result = await Game.findByPk(id, { raw: true });
    return result;
}


/**
 * Check if a user is present in the leaderboard (i.e. he finished at least one match)
 * @param email -> player email
 * @returns -> true if the player is present in leaderboard, false otherwise
 */
export async function checkLeaderboardExistByEmail(email: string): Promise<boolean> {
    let result: any;
    result = await Leaderboard.findByPk(email, { raw: true });
    return result;
}


/**
 * Given a game id, check if the move is allowed
 * @param email -> player email
 * @param id -> game id
 * @param row -> row coordinate
 * @param col -> col coordinate
 * @returns -> true if the move is allowed, false otherwise
 */
export async function checkGameMoveById(email: string, id: string, row: number, col: number): Promise<boolean> {
    let game: any;
    let status: string = 'in progress';

    game = await Game.findOne({where: {id: id, game_status: status, player_turn: email}});
    
    // if the game does not exist there's no need to check further
    if(!game) {
        return false;
    };

    // check if the move's coordinate are withing the game grid
    if(row < 0 || col < 0 || row >= game.grid_dim || col >= game.grid_dim) {
        return false;
    };

    // check if the move has already been made
    if(game.player1 === email && game.grids.grid1[row][col] !== 'X' && game.grids.grid1[row][col] !== 'O') {
        return true;
    }
    else if(game.player2 === email && game.grids.grid2[row][col] !== 'X' && game.grids.grid2[row][col] !== 'O') {
        return true;
    }
    else return false;
}


/**
 * Executes a player's move and save it to database, also checks if the game is over
 * @param email -> player email
 * @param id -> game id
 * @param move -> move to be made (row, col)
 * @param res -> response
 */
export async function createMove(email: string, id: string, move: any, res: any): Promise<void> {
    let game: any;
    let playerTurn: string;
    let email2: string;
    let grid: any;
    let isGameClosed: boolean = true;
    let isShipSunk: boolean = true;
    let shipHit: string = 'O';
    let msg: string = 'Hai sparato in acqua';
    let moveAllow: boolean = false;

    game = await Game.findByPk(id, { raw: true });

    // append the current move to the moves log
    game.log_moves.moves.push(move);

    // check if the player is making a move during his turn or not
    if(game.player1 === email) {
        grid = game.grids.grid1;
        email2 = game.player2;
        playerTurn = game.player2;
    }
    else {
        grid = game.grids.grid2;
        email2 = game.player1;
        playerTurn = game.player1;
    }

    // Set the grid cell value: 'O' means water hit, 'X' means ship hit
    if(grid[move.row][move.col] === 'W') {
        grid[move.row][move.col] = 'O';
    }
    else {
        shipHit = grid[move.row][move.col];
        grid[move.row][move.col] = 'X';
        msg = 'Hai colpito la nave ' + shipHit;
    }

    if(game.player1 === email) game.grids.grid1 = grid;
    else game.grids.grid2 = grid;

    // check if a ship has been sunk and the game is over
    for(let j = 0; j < game.grid_dim; j++) {
        for(let k = 0; k < game.grid_dim; k++) {
            if(grid[j][k] === shipHit) {
                isShipSunk = false;
            }
            if(grid[j][k] !== 'X' && grid[j][k] !== 'O' && grid[j][k] !== 'W') {
                isGameClosed = false;
            }
        }
    }

    if(isShipSunk === true) {
        msg = "Nave " + shipHit + " colpita ed affondata";
    }

    if(isGameClosed === true) {
        game.game_status = 'closed';
        game.winner = email;
        game.loser = email2;
        msg = "Nave " + shipHit + " colpita ed affondata, hai vinto la partita"

        Utils.updateLeaderboardWin(email);
        Utils.updateLeaderboardLose(email2);
    }

    try{
        await Game.update({
            game_status: game.game_status,
            player_turn: playerTurn,
            grids: game.grids,
            winner: game.winner,
            loser: game.loser,
            log_moves: game.log_moves
        },
        { 
            where: {id: id} 
        });
    
        if (1) {//2 res in output
            res.status(200).json({
                status: 200,
                msg: msg,
                game_stats: {
                    player1: email, 
                    player2: email2, 
                    game_status: game.game_status, 
                    player_turn: playerTurn, 
                    grid_dim: game.grid_dim, 
                    game_date: game.game_date
                }
            });
        }
    }
    catch(error){
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }

    if (playerTurn === 'AI' && isGameClosed !== true) {
        while (moveAllow !== true) {
            let row: number = Math.floor(Math.random() * game.grid_dim);
            let col: number = Math.floor(Math.random() * game.grid_dim);

            if (game.grids.grid2[row][col] !== 'X' && game.grids.grid2[row][col] !== 'O') moveAllow = true;
        
            move = {
                "player": "AI",
                "row": row,
                "col": col
            }
        }
        createMove(email2, id, move, res);
    }
}


/**
 * Return the state of a game given the id
 * @param id -> game id
 * @param res -> response
 */
export async function getGame(id: string, res: any): Promise<any> {
    let game: any;
    let gameState: any;

    game = await Game.findByPk(id, { raw: true });

    gameState = {
        id: game.id,
        palyer1: game.player1,
        player2: game.player2,
        game_status: game.game_status,
        player_turn: game.player_turn,
        winner: game.winner,
        loser: game.loser,
        grid_dim: game.grid_dim,
        game_date: game.game_date
    };

    res.send(gameState);
}


/**
 * Return the moves log of a game
 * @param id -> game id
 * @param exportPath -> path to export to
 * @param format -> desired export format
 * @param res -> response
 */
export async function getLog(id: string, exportPath: string, format: string, res: any): Promise<any> {
    let game: any;
    let logMoves: any;
    let filename: string;

    game = await Game.findByPk(id, { raw: true });

    if (path) {
        if (format === 'json' || format === 'JSON') {
            filename = 'Game-' + id + '_log.json';
            exportPath = path.join(exportPath, filename)
            Utils.exportAsJSON(game.log_moves, exportPath);
        }
        else if (format === 'csv' || format === 'CSV') {
            filename = 'Game-' + id + '_log.csv';
            exportPath = path.join(exportPath, filename)
            Utils.exportAsCSV(game.log_moves, exportPath);
        }
    }

    logMoves = {
        status: 200,
        msg: "File exported at :" + exportPath,
        id: game.id,
        log_moves: game.log_moves.moves
    };

    res.send(logMoves);
}

/**
 * Return the stats of a player
 * @param email -> player email
 * @param res -> response
 */
export async function userStats(email: string, startDate: Date, endDate: Date, res: any): Promise<any> {
    let playerStats: any;
    let totWins: number;
    let totlose: number;
    let logMoves: any;
    let totMatch: number;
    let winRatio: number;
    let avgMoves: number;
    let summation: number = 0;
    let stdDev: number;
    let totMoves: number;
    let allMoves: number[] = [];
    let countMoves: number;

    totWins = await SequelizeQueries.countWins(email, startDate, endDate);
    totlose = await SequelizeQueries.countLose(email, startDate, endDate);
    logMoves = await SequelizeQueries.getLogMoves(email, startDate, endDate);

    totMatch = totWins + totlose;
    winRatio = Math.round((totWins / totMatch + Number.EPSILON) * 100) / 100;

    for(let j = 0; j < logMoves.length; j++) {
        countMoves = 0;

        for(let k = 0; k < logMoves[j].moves.length; k++) {
            if (logMoves[j].moves[k].player === email) countMoves = countMoves + 1;
        }

        allMoves.push(countMoves);
    }

    totMoves = allMoves.reduce((a, b) => a + b, 0);
    avgMoves = Math.round((totMoves / totWins + Number.EPSILON) * 100) / 100;

    for(let i = 0; i < allMoves.length; i++) {
        summation = summation + Math.pow(avgMoves - allMoves[i], 2); 
    }

    stdDev = Math.round(Math.sqrt(summation / allMoves.length + Number.EPSILON) * 100) / 100;

    playerStats = {
        email: email,
        total_match: totMatch,
        total_wins: totWins,
        total_loses: totlose,
        win_ratio: winRatio,
        avg_moves: avgMoves,
        min_moves: Math.min.apply(Math, allMoves),
        max_moves: Math.max.apply(Math, allMoves),
        standard_devation: stdDev
    };

    res.send(playerStats);
}


/**
 * Return the leaderboard sort as request
 * @param id -> game id
 * @param res -> response
 */
 export async function showLeaderboard(sort: string, res: any): Promise<any> {
    let leaderboard: any;

    leaderboard = await SequelizeQueries.getLeaderboard(sort);

    leaderboard = {
        leaderboard: leaderboard
    };

    res.send(leaderboard);
}
