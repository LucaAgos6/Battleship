import * as jwt from 'jsonwebtoken';
import {ErrorEnum, getError} from '../factory/factory';
import * as Controller from '../controller/controller';
import moment from 'moment';


/**
* Funzione che controlla la presenza dell'header nella richiesta
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkHeader (req:any, res:any, next:any): void {
  const authHeader = req.headers.authorization;
  if (authHeader) {
      next();
  }
  else {
      console.log(ErrorEnum.ErrTokenHeader)
      next();
  }
}
  

/**
* Funzione che controlla la presenza del JWT nella richiesta
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkToken(req: any, res: any, next: any): void {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]; 
    req.token = bearerToken;
    next();
  } 
  else {
    next(console.log(ErrorEnum.MissingToken));
  }
}


/**
* Funzione che controlla se nel JWT è stata utilizzata una chiave che corrisponda a quella presente nel file dove sono contenute le variabili di ambiente
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function verifyAndAuthenticate(req: any, res: any, next: any): void {
  let decoded = jwt.verify(req.token, process.env.SECRET_KEY!); 
  if (decoded !== null)
    req.bearer = decoded;
  next();
}


/**
* Funzione che si occupa di controllare se l'utente nella richiesta sia effettivamente admin
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkAdmin(req: any, res: any, next: any): void {
  Controller.checkUser(req.bearer.email, res).then((user) => {
    if (user) {
      Controller.getRole(req.bearer.email, res).then((role: string) => {
        if (role == 'admin') {
          next();
        }
        else next(ErrorEnum.ErrNotAdmin);
      });
    } 
    else next(ErrorEnum.ErrCheckAdmin);
  });
}


/**
* Funzione utilizzata solamente dalla rotta refill che necessita il controllo sull'email dell'utente da ricaricare
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkUserExistRefill(req: any, res: any, next: any): void {
  Controller.checkUser(req.body.email, res).then((email) => {
    if (email) {
      next();
    }
    else next(ErrorEnum.ErrUser);
  })
}
  
  
/**
* Funzione che controlla se nella richiesta è presente un payload JSON ben formato
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkJSONPayload(req: any, res: any, next: any): void {
  try {
    req.body = JSON.parse(JSON.stringify(req.body));
    next();
  } 
  catch (error) {
    next(ErrorEnum.MalformedPayload);
  }
}

  
/**
* Funzione utilizzata per loggare gli errori
* 
* @param err -> errore
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function logErrors(err: any, req: any, res: any, next: any, msgParameter?: string): void {
  const new_err = getError(err).getMsg();
  console.log(new_err);
  next(new_err);  
}


/**
* Funzione che si occupa di ritornare lo stato e il messaggio di errore
* 
* @param err -> errore
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function errorHandler(err: any, req: any, res: any, next: any): void {
  res.status(err.status).json({error: err.status, message: err.msg});
}

 
/**
* Funzione utilizzata per verificare il content-type 
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkPayloadHeader(req: any, res: any, next: any): void {
  if (req.headers["content-type"] == "application/json") { 
    console.log("This is req " + req.content); next(); 
  }
  else next(ErrorEnum.ErrPayloadHeader);
}
  
  
/**
* Funzione che si occupa di controllare se l'utente nella richiesta esista o meno
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkUserExist(req: any, res: any, next: any): void {
  Controller.checkUser(req.bearer.email, res).then((email) => {
    if (email) next();
    else next(ErrorEnum.ErrUser);
  })
}


/**
* Funzione che si occupa di controllare se il secondo player esista o meno
*
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkOpponentExist(req: any, res: any, next: any): void {
  Controller.checkUser(req.body.player2, res).then((player2) => {
    if (player2) next();
    else next(ErrorEnum.ErrUser);
  })
}
  

/**
* Funzione utilizzata per le rotte inesistenti
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function routeNotFound(req: any, res: any, next: any): void{
  next(ErrorEnum.ErrRouteNotFound);
}


/**
* Funzione che si occupa di controllare se l'utente che effettua una richiesta abbia token sufficienti
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkRemainingToken(req: any, res: any, next: any): void {
  Controller.getToken(req.bearer.email, res).then((token) => {
      if (token >= 0.4) next();
      else next(ErrorEnum.ErrInsufficientToken);
  })
}


/**
* Funzione che si occupa di controllare se l'utente non abbia già una partita in corso 
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
* 
**/
export function checkUserGame(req: any, res: any, next: any,): void {
  let player: string = "player1";
  Controller.checkGameInProgress(req.bearer.email, player).then((game) => {
    if (!game) next();
    else next(ErrorEnum.ErrorGameInProgress, res);
  })
}


/**
* Funzione che si occupa di controllare se l'avversario non abbia già una partita in corso 
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
* 
**/
export function checkOpponentGame(req: any, res: any, next: any): void {
  let player: string = "player2";
  if (req.body.player2 == 'AI') next();
  else {
    Controller.checkGameInProgress(req.body.player2, player).then((game) => {
      if (!game) next();
      else next(ErrorEnum.ErrorGameInProgress, res);
    });
  }
}


/**
* Funzione che si occupa di controllare se l'utente voglia iniziare una partita con se stesso 
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
*/
export function checkSameUser(req: any, res: any, next: any): void {
  if(req.bearer.email !== req.body.player2) next();
  else next(ErrorEnum.ErrorSamePlayer, res);
}


/**
* Funzione che si occupa di controllare se la mossa possa essere effettuata
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
**/
export function checkGameMove(req: any, res: any, next: any): void {
  Controller.checkGameMoveById(req.bearer.email, req.body.id, req.body.move.row, req.body.move.col).then((id) => {
    if (id) next();
    else next(ErrorEnum.ErrorMakeMove, res);
  })
}


/**
* Funzione che si occupa di controllare se la data partita esisti o meno
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
*/
export function checkGameExist(req: any, res: any, next: any): void {
  Controller.checkGameExistById(req.body.id).then((id) => {
    if (id) next();
    else next(ErrorEnum.ErrorIdGame, res);
  })
}

/**
 * Check if the player doing the turn can do it
 * @param req -> client request
 * @param res -> server response
 * @param next -> next middleware
 */
export function checkPlayerTurn(req: any, res: any, next: any): void {
  Controller.checkPlayerTurnById(req.body.id, req.bearer.email).then((id) => {
    if (id) next();
    else next(ErrorEnum.ErrorPlayerTrun, res);
  })
}

/**
* Funzione che si occupa di controllare se la data sia accettabile
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
*/
export function checkDate(req: any, res: any, next: any): void {
  var dateFormats = ["AAAA-MM-DD", "MM-DD-AAAA", "AAAA/MM/DD", "MM/DD/AAAA"];
  let startDate: string = req.body.start_date;
  let endDate: string = req.body.end_date;

  let isStarValid: boolean = moment(startDate, dateFormats, true).isValid();
  let isEndValid: boolean = moment(endDate, dateFormats, true).isValid();

  console.log(isStarValid, isEndValid)

  if (isStarValid && isEndValid && moment(endDate).isSameOrAfter(startDate)) {
    console.log("Valid dates", startDate, endDate)
    next();
  }
  else {
  console.log("Invalid dates", startDate, endDate)
  next(ErrorEnum.ErrorDateFormat, res);
  }
}


/**
* Funzione che si occupa di controllare il sort sia corretto
* 
* @param req -> richiesta del client
* @param res -> risposta da parte del server
* @param next -> riferimento al middleware successivo
*
*/
export function checkSortMethod(req: any, res: any, next: any): void {
  if (req.body.sort === 'asc' || req.body.sort === 'desc') next();
  else next(ErrorEnum.ErrorSortMethod, res);
}
