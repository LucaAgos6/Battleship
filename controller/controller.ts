import {Users, Game, Leaderboard} from '../model/models';
import { ErrorEnum, getError, Success } from '../factory/factory';
import * as Utils from '../utils/utils'

/**
* Funzione che permette di verificare che l'utente esista data la sua email
*
* @param email -> email dell'utente
* @param res -> risposta da parte del server
* @returns true se esiste, false se non esiste
*
**/
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
* Funzione che restituisce il ruolo dell'utente data la sua email
*
* @param email -> email dell'utente
* @param res -> risposta da parte del server
* @returns ruolo utente (admin/user)
*
**/
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
* Funzione che restituisce i token rimanenti dell'utente data la sua email
*
* @param email -> email utente
* @param res -> risposta da parte del server
* @returns token utente
*
**/
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
 * Funzione che viene richiamata dalle altre funzioni del Controller in caso di errori. 
 * 
 * @param enum_error -> enum che identifica il tipo di errore
 * @param err -> errore che si presenta
 * @param res -> risposta da parte del server
 *
 **/
 function controllerErrors(enum_error: ErrorEnum, err: Error, res: any): void {
    const new_err = getError(enum_error).getMsg();
    console.log(err);
    res.status(new_err.status).json({ error: new_err.status, message: new_err.msg });
}


/** 
* Funzione che permette di ricaricare il credito dell'utente
*
* @param email -> email utente
* @param token -> nuovo credito da inserire
* @param res -> risposta da parte del server
*
**/
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
* Funzione che permette di mostrare i token rimanenti di un utente data la sua email
*
* @param email-> email utente
* @param res -> risposta da parte del server
*
**/
export function showToken(email: string, res: any): void {
    Users.findByPk(email, { raw: true }).then((item: any) => {
        res.send("Remaining token: " + item.token)
    }).catch((error) => {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    })
}


/** 
* Funzione che permette di aggiornare il credito dell'utente a causa dell'inizio della partita
*
* @param email -> email utente
* @param res -> risposta da parte del server
*
**/
export function updateToken(email: string, cost: number, res: any): void {
    getToken(email, res).then((token) => { 
        token = token - cost;
        console.log(token)
        token = Math.round((token + Number.EPSILON) * 100) / 100;
        Users.update({ token: token }, { where: { email: email } });
        console.log("Remaining token: " + (token));
     }).catch((error) => {
            controllerErrors(ErrorEnum.ErrServer, error, res);
        })
}


/**
* Funzione che permette di creare una nuova partita e salvarla nel Database
*
* @param email -> email del primo giocatore
* @param player2 -> email del secondo giocatore
* @param gridDim -> dimensione della griglia di gioco 
* @param shipsConfig -> json contenente il numero di navi per ogni tipologia 
* @param shipDims -> json contenente le caratteristiche delle navi
*
**/
export async function createGame(player1: string, player2: string, gridDim: number, shipsConfig: JSON, shipDims: JSON, res: any): Promise<void> {
    
    // inizializzazione della griglia di gioco con le relative navi
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
* Funzione che vede nel Database se un utente ha già una partita iniziata
* 
* @param email -> email dell'utente da controllare
* @returns true se esiste, false se non esiste
*
*/
export async function checkGameInProgress(email: string, player: string): Promise<boolean> {
    let result: any;
    let status: string = 'in progress';
    result = await Game.findOne({where: {[player]: email, game_status: status}});
    return result;
}


/**
* Funzione che vede nel Database se esiste una partita con l'id specifico
* 
* @param id -> id della partita da controllare
* @returns true se esiste, false se non esiste
*
*/
export async function checkGameExistById(id: string): Promise<boolean> {
    let result: any;
    result = await Game.findByPk(id, { raw: true });
    return result;
}


/**
* Funzione che vede nel Database se il giocatore ha concluso almeno una partita ed ha stats da mostrare
* 
* @param email -> email dell'utente da controllare
* @returns true se esiste, false se non esiste
*
*/
export async function checkLeaderboardExistByEmail(email: string): Promise<boolean> {
    let result: any;
    result = await Leaderboard.findByPk(email, { raw: true });
    return result;
}


/**
* Funzione che vede nel Database se la mossa possa essere effettuata in una data partita
* 
* @param email -> email dell'utente da controllare
* @returns true se esiste, false se non esiste
*
*/
export async function checkGameMoveById(email: string, id: string, row: number, col: number): Promise<boolean> {
    let game: any;
    let status: string = 'in progress';

    game = await Game.findOne({where: {id: id, game_status: status, player_turn: email}});
    
    // se non trova la partita la mossa non si può fare
    if(!game) {
        return false;
    };

    // check che le coordinate della mossa siano all'interno della griglia
    if(row < 0 || col < 0 || row >= game.grid_dim || col >= game.grid_dim) {
        return false;
    };

    // check sul player e sulla mossa che non sia già stata fatta
    if(game.player1 === email && game.grids.grid1[row][col] !== 'X' && game.grids.grid1[row][col] !== 'O') {
        return true;
    }
    else if(game.player2 === email && game.grids.grid2[row][col] !== 'X' && game.grids.grid2[row][col] !== 'O') {
        return true;
    }
    else return false;
}


/**
* Funzione che permette di effettuare una mossa e di salvarla nel Database 
* 
* @param email -> email del player che effettua la mossa
* @param id -> id della partita in corso
* @param move -> coordinate della mossa da eseguire
* @param res -> risposta del server
*
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

    game = await Game.findByPk(id, { raw: true });

    // append della mossa nel log
    game.log_moves.moves.push(move);

    // condizione in cui si vede se il player che fa la mossa è il player1 o il player2
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

    // condizione in cui si associa un valore alla casella a seconda che il player abbia colpito una nave o l'acqua
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

    // check se con la mossa fatta si affonda una nave e se si chiude la partita
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

        Utils.updateLeaderboardWin(email, game.log_moves.moves);
        Utils.updateLeaderboardLose(email2, game.log_moves.moves);
    }

    try{
        Game.update({
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
    catch(error){
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }
}


/**
* Funzione che permette di recuperare informazioni su una data partita
* 
* @param id -> id della partita da valutare
* @param res -> risposta del server
*
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
* Funzione che permette di recuperare il log di una data partita
*
* @param id -> id della partita
* @param res -> risposta del server 
*
*/
export async function getLog(id: string, res: any): Promise<any> {
    let game: any;
    let logMoves: any;

    game = await Game.findByPk(id, { raw: true });

    logMoves = {
        id: game.id,
        log_moves: game.log_moves.moves
    };

    res.send(logMoves);
}

/**
* Funzione che permette di recuperare le statistiche di un dato giocatore
* 
* @param email -> email del giocatore
* @param res -> risposta del server 
*
*/
export async function userStats(email: string, res: any): Promise<any> {
    let leaderboard: any;
    let playerStats: any;

    leaderboard = await Leaderboard.findByPk(email, { raw: true });

    playerStats = {
        player: email,
        total_match: leaderboard.total_matches,
        total_win_match: leaderboard.wins,
        total_lose_match: leaderboard.losses,
        win_ratio: leaderboard.win_ratio,
        average_moves: leaderboard.avg_moves
    };

    res.send(playerStats);
}