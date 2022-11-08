import { sequelize} from '../model/models';


/**
 * Query to retrieve a user's token
 * @param email -> user email
 * @returns -> query result
 */
export async function getToken(email: string): Promise<any> {
    let result = await sequelize.query("SELECT token FROM users WHERE email = '" + email + "'",
        {
            raw: true
        });
    return result;
}

/**
 * Query to count a player wins in an interval
 * @param email -> user email
 * @param startDate -> interval starting date
 * @param endDate -> interval ending date
 * @returns -> query result
 */
export async function countWins(email: string, startDate: Date, endDate: Date): Promise<number> {
    let result: any;
    result = await sequelize.query("SELECT COUNT(winner) FROM game WHERE game.winner = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return Number(result[0][0].count);
}

/**
 * Query to count a player losses in an interval
 * @param email -> user email
 * @param startDate -> interval starting date
 * @param endDate -> interval ending date
 * @returns -> query result
 */
export async function countLose(email: string, startDate: Date, endDate: Date): Promise<number> {
    let result: any;
    result = await sequelize.query("SELECT COUNT(loser) FROM game WHERE game.loser = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return Number(result[0][0].count);
}

/**
 * Query to retrieve all moves logs of a player in an interval
 * @param email -> user email
 * @param startDate -> interval starting date
 * @param endDate -> interval ending date
 * @returns -> query result
 */
export async function getLogMoves(email: string, startDate: Date, endDate: Date): Promise<any> {
    let result: any;
    result = await sequelize.query("SELECT log_moves->'moves' AS moves FROM game WHERE game.winner = '" + email + "' AND game.game_date >= '" + startDate + "' AND  game.game_date <= '" + endDate + "'",
        {
            raw: true
        });
    return (result[0]);
}

/**
 * Query to retrieve the leaderboard from DB
 * @param sort -> sorting method for the leaderboard table
 * @returns -> query result
 */
export async function getLeaderboard(sort: string): Promise<any> {
    let result: any;
    result = await sequelize.query("SELECT * FROM public.leaderboard ORDER BY wins " + sort + ", win_ratio " + sort,
        {
            raw: true
        });
    return (result[0]);
}

