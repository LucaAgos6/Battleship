import { Utils } from 'sequelize/types';
import { SmallIntegerDataType } from 'sequelize/types/data-types';
import { sequelize} from '../model/models';

/** 
*query postgres utili in controller.ts, il loro utilizzo è lì esplicato 
*
*
**/

export async function getToken(email: string): Promise<any> {
    let result = sequelize.query("SELECT token FROM users WHERE email = '" + email + "'",
        {
            raw: true
        });
    return result;
}


export async function insertGame(player1: string, player2: string, gridDim: number, grid: string): Promise<any> {
    const now: Date = new Date();
    let result = sequelize.query("INSERT INTO game (player1, player2, game_status, player_turn, winner, loser, grid_dim, grids, log_moves, game_date) " +
    "VALUES('" + player1 + "', '" + player2 + "', 'in progress', '" + player1 + "', '', '','" + gridDim + "', '" + grid + "', '" + grid + "', '" + now.toLocaleDateString() + "')",
        {
            raw: true
        });
    return result;
}
