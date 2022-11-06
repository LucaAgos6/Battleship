import { Console } from 'node:console';
import { Utils } from 'sequelize/types';
import { SmallIntegerDataType } from 'sequelize/types/data-types';
import { sequelize} from '../model/models';


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
    return Number(result[0][0].count);
}


export async function countLose(email: string, startDate: Date, endDate: Date): Promise<number> {
    let result: any;
    result = await sequelize.query("SELECT COUNT(loser) FROM game WHERE game.loser = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return Number(result[0][0].count);
}


export async function getLogMoves(email: string, startDate: Date, endDate: Date): Promise<any> {
    let result: any;
    result = await sequelize.query("SELECT log_moves->'moves' AS moves FROM game WHERE game.winner = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return (result[0]);
}


export async function getLeaderboard(sort: string): Promise<any> {
    let result: any;
    result = await sequelize.query("SELECT * FROM public.leaderboarD ORDER BY wins " + sort,
        {
            raw: true
        });
    return (result[0]);
}

