import { Utils } from 'sequelize/types';
import { SmallIntegerDataType } from 'sequelize/types/data-types';
import { sequelize} from '../model/models';

/** 
*query postgres utili in controller.ts, il loro utilizzo è lì esplicato 
*
*
**/

export async function getToken(email: string): Promise<any> {
    let result = await sequelize.query("SELECT token FROM users WHERE email = '" + email + "'",
        {
            raw: true
        });
    return result;
}


export async function countWins(email: string, startDate: Date, endDate: Date): Promise<number> {
    let result: any;
    result = await sequelize.query("SELECT COUNT(winner) FROM game WHERE game.winner = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return result[1].rowCount;
}


export async function countLose(email: string, startDate: Date, endDate: Date): Promise<number> {
    let result: any;
    result = await sequelize.query("SELECT COUNT(loser) FROM game WHERE game.loser = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return result[1].rowCount;
}


export async function getLogMoves(email: string, startDate: Date, endDate: Date): Promise<any> {
    let result: any;
    result = await sequelize.query("SELECT log_moves FROM game WHERE game.winner = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    let prova = result[0]

    console.log(typeof(prova))

    let prova2 = JSON.parse(prova);

    console.log(typeof(prova2))

    return 1;
}

