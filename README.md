# Battleship backend
## Descrizione del progetto
Il progetto consiste in sistema di backend che consenta di gestire il gioco della battaglia navale. Il sistema prevede la possibilità di far interagire due utenti (autenticati mediante JWT) o un utente contro l’elaboratore. 

Sia la creazione di una partita e sia la mossa hanno un costo in termini di token.

## Funzioni del sistema

| Funzioni | Ruolo |
| -------- | ----- |
| Ricarica il credito di un utente | Admin |
| Mostra il credito rimasto di un utente | User |
| Crea una nuova partita | User |
| Esegui una mossa | User |
| Mostra lo stato di una partita | User |
| Mostra il log delle mosse di una data partita | User |
| Mostra le statistiche di un dato utente | User |
| Mostra la classifica dei giocatori ordinata | General |

Ogni funzione è associata ad una diversa richiesta HTTP (POST o GET), per alcune delle quali è prevista un'autenticazione tramite token JWT.

## Rotte

| Tipo | Rotte |
| ---- | ----- |
| POST | /refill |
| POST | /show-token |
| POST | /begin-match |
| POST | /make-move |
| GET | /game-state |
| GET | /game-log |
| GET | /user-stats |
| GET | /leaderboard |
 
## Ricarica il credito di un utente (/refill)
Mediante l'utilizzo di questa rotta si può settare il credito di un utente. Questa rotta può essere richiamata solamente dagli utenti autenticati, con ruolo admin.

Da effettuare tramite token JWT che deve contenere un payload JSON con la seguente struttura:

~~~
{
    "email": "user2@mail.it",
    "token": 50
}
~~~

### Sequence Diagram

```mermaid
sequenceDiagram
autonumber
Client->>Router: /refill
Router->>Middleware CoR: app.post()
Middleware CoR->>Middleware: autentication()
Middleware->>Middleware: checkHeader()
Middleware->>Middleware: checkToken()
Middleware->>Middleware: verifyAndAuthenticate()
Middleware->>Middleware CoR: next()
Middleware CoR->>Middleware: refill()
Middleware->>Middleware: checkAdmin()
Middleware->>Controller: checkUser()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: object
Middleware->>Controller: getRole()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: string
Middleware->>Middleware: checkUserExistRefill()
Middleware->>Controller: checkUser()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware CoR: next()
Middleware CoR->>Router: next()
Router->>Controller: refill()
Controller->>Model: Users.update()
Controller->>Factory: Success().getMsg()
Factory->>Controller: json
Controller->>Client: res.status().json
```

## Mostra credito di un utente (/show-token)
Mediante l'utilizzo di questa rotta si può visualizzare il credito di un utente. Questa rotta può essere richiamata dagli utenti autenticati.

Da effettuare tramite token JWT

### Sequence Diagram

```mermaid
sequenceDiagram
autonumber
Client->>Router: /show-token
Router->>Middleware CoR: app.post()
Middleware CoR->>Middleware: autentication()
Middleware->>Middleware: checkHeader()
Middleware->>Middleware: checkToken()
Middleware->>Middleware: verifyAndAuthenticate()
Middleware->>Middleware CoR: next()
Middleware CoR->>Middleware: checkToken()
Middleware->>Middleware: checkUserExist()
Middleware->>Controller: checkUser()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkRemainingToken()
Middleware->>Controller: getToken()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: number
Middleware->>Middleware CoR: next()
Middleware CoR->>Router: next()
Router->>Controller: showToken()
Controller->>Model: Users.findByPk()
Model->>Controller: number
Controller->>Client: res.send()
```

## Crea una nuova partita (/begin-match)
Mediante l'utilizzo di questa rotta si può creare una nuova partita. Questa rotta può essere richiamata solamente dagli utenti autenticati.

//possibilità di scelta

Da effettuare tramite token JWT che deve contenere un payload JSON con la seguente struttura:

~~~
{
    "player2": "user2@mail.it",
    "gridDim": 5,
    "shipsConfig": {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 1
    },
    "shipDims": {
        "A": 4,
        "B": 3,
        "C": 2,
        "D": 1
    }
}
~~~

### Sequence Diagram

```mermaid
sequenceDiagram
autonumber
Client->>Router: /begin-match
Router->>Middleware CoR: app.post()
Middleware CoR->>Middleware: autentication()
Middleware->>Middleware: checkHeader()
Middleware->>Middleware: checkToken()
Middleware->>Middleware: verifyAndAuthenticate()
Middleware->>Middleware CoR: next()
Middleware CoR->>Middleware: beginMatch()
Middleware->>Middleware: checkUserExist()
Middleware->>Controller: checkUser()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkOpponentExist()
Middleware->>Controller: checkUser()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkRemainingToken()
Middleware->>Controller: getToken()
Controller->>Model: Users.findByPk()
Model->>Controller: object
Controller->>Middleware: result: number
Middleware->>Middleware: checkUserGame()
Middleware->>Controller: checkGameInProgress()
Controller->>Model: Game.findOne()
Model->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkOpponentGame()
Middleware->>Controller: checkGameInProgress()
Controller->>Model: Game.findOne()
Model->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkSameUser()
Middleware->>Middleware: checkGridConfig()
Middleware->>Middleware CoR: next()
Middleware CoR->>Router: next()
Router->>Controller: updateToken()
Controller->>Controller: getToken()
Controller->>Model: Users.findByPk()
Model->>Controller: number
Controller->>Model: Users.update()
Router->>Controller: createGame()
Controller->>Utils: gridInitialize()
Utils->>Controller: object
Controller->>Utils: arrangeShips()
Utils->>Utils: placeShip()
Utils->>Utils: allowedOrientation()
Utils->>Controller: object
Controller->>Model: game:create()
Controller->>Client: res.status().json
```

## Esegui una mossa (/make-move)
Mediante l'utilizzo di questa rotta si può effettuare una mossa. Questa rotta può essere richiamata solamente dagli utenti autenticati.

//tutte le possibilità

Da effettuare tramite token JWT che deve contenere un payload JSON con la seguente struttura:

~~~
{
    "id": 32,
    "move": {
        "player": "admin@mail.it",
        "row": 1,
        "col": 0
    }
}
~~~

### Sequence Diagram

```mermaid
sequenceDiagram
autonumber
Client->>Router: /make-move
Router->>Middleware CoR: app.post()
Middleware CoR->>Middleware: autentication()
Middleware->>Middleware: checkHeader()
Middleware->>Middleware: checkToken()
Middleware->>Middleware: verifyAndAuthenticate()
Middleware->>Middleware CoR: next()
Middleware CoR->>Middleware: makeMove()
Middleware->>Middleware: checkUserExist()
Middleware->>Controller: checkUser()
Controller->>Models: Users.findByPk()
Models->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkOpponentExist()
Middleware->>Controller: checkUser()
Controller->>Models: Users.findByPk()
Models->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkRemainingToken()
Middleware->>Controller: getToken()
Controller->>Models: Users.findByPk()
Models->>Controller: number
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkUserGame()
Middleware->>Controller: checkGameInProgress()
Controller->>Models: Game.findOne()
Models->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkOpponentGame()
Middleware->>Controller: checkGameInProgress()
Controller->>Models: Game.findOne()
Models->>Controller: object
Controller->>Middleware: result: boolean
Middleware->>Middleware: checkSameUser()
Middleware->>Middleware: checkGridConfig()
Middleware->>Middleware CoR: next()
Middleware CoR->>Router: next()
Router->>Controller: updateToken()
Controller->>Controller: getToken()
Controller->>Models: Users.findByPk()
Models->>Controller: number
Controller->>Models: Users.update()
Router->>Controller: createMove()
Controller->>Models: Game.findByPk()
Models->>Controller: object
Controller->>Utils: returnGridState()
Utils->>Controller: object
Controller->>Utils: updateLeaderboardWin()
Utils->>Models: Leaderboard.findByPk()
Models->>Utils: object
Utils->>Models: leaderboard.create()
Utils->>Models: leaderboard.update()
Controller->>Utils: updateLeaderboardLose()
Utils->>Models: Leaderboard.findByPk()
Models->>Utils: object
Utils->>Models: leaderboard.create()
Utils->>Models: leaderboard.update()
Controller->>Models: Game.update()
Controller->>Client: res.send()
Controller->>Utils: executeAIMove()
Utils->>Utils: returnGridState()
Utils->>Models: Game.update()
```
