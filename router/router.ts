import express from 'express';
import * as Controller from '../controller/controller';
import * as Middleware_CoR from '../middleware/middleware_CoR';
import * as Middleware from '../middleware/middleware';

const app = express();
app.use(express.json());

app.get('/', function (req: any, res: any){
    res.send("Homepage");
});


/*
* Route to refill a user's token
*/
app.post('/refill', Middleware_CoR.authentication, Middleware_CoR.refill, Middleware_CoR.catchError, (req: any, res: any) => {
    Controller.refill(req.body.email, req.body.token, res);
});


/*
* Route to show a user's token
*/
app.post('/show-token', Middleware_CoR.authentication, Middleware_CoR.checkToken, Middleware_CoR.catchError, (req: any, res: any) => {
    Controller.showToken(req.bearer.email, res);
});


/*
* Route to begin a match with another player or AI
*/
app.post('/begin-match', Middleware_CoR.authentication, Middleware_CoR.beginMatch, Middleware_CoR.catchError, (req: any, res: any) => {
    Controller.updateToken(req.bearer.email, +process.env.MATCH_COST!, res);
    Controller.createGame(req.bearer.email, req.body.player2, req.body.gridDim, req.body.shipsConfig, req.body.shipDims, res);
});


/*
* Route to execute a move on the grid
*/
app.post('/make-move', Middleware_CoR.authentication, Middleware_CoR.makeMove, Middleware_CoR.catchError, (req: any, res: any) => {
    Controller.updateToken(req.bearer.email, +process.env.MOVE_COST!, res);
    Controller.createMove(req.bearer.email, req.body.id, req.body.move, res);
});


/*
* Route that return the state of a game given its id
*/
app.get('/game-state', Middleware_CoR.authentication, Middleware_CoR.gameState, Middleware_CoR.catchError, (req: any, res: any) => {
    Controller.getGame(req.body.id, res);
    });


/*
* Route that returns the game log containing all the moves made by players
*/
app.get('/game-log', Middleware_CoR.authentication, Middleware_CoR.gameLog, Middleware_CoR.catchError, (req: any, res:any) => {
    Controller.getLog(req.body.id, req.body.path, req.body.format, res);
});


/*
* Route to show a user's stats
*/
app.get('/user-stats', Middleware_CoR.authentication, Middleware_CoR.userStats, Middleware_CoR.catchError, (req: any, res:any) => {
    Controller.userStats(req.bearer.email, req.body.start_date, req.body.end_date, res);
});


app.get('*', Middleware.routeNotFound, Middleware_CoR.catchError);
app.post('*', Middleware.routeNotFound, Middleware_CoR.catchError);


app.listen(3000, () => {
    console.log('The application is running on localhost:3000!');
});