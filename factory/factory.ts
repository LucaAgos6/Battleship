/** 
*
* Utilizzo del design pattern "Factory" per la gestione efficiente degli errori
*
*
* Interfaccia utilizzata da tutte le classi sottostanti per definire il messaggio di errore
*
**/

interface Msg {
    getMsg():{status: number, msg: string};
}

class ErrTokenHeader implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Error token header"
        }
    }
}

class ErrJWT implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Missing token"
        }
    }
}

class ErrJSONPayload implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Malformed payload"
        }
    }
}

class ErrPayloadHeader implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Payload header error"
        }
    }
}

class ErrNotAdmin implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 401,
            msg: "User is not admin"
        }
    }
}

class ErrCheckAdmin implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "Admin not found"
        }
    }
}

class ErrUser implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "User not found"
        }
    }
}

class ErrInsufficientToken implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 401,
            msg: "Unauthorized: not enough token"
        }
    }
}

class ErrRouteNotFound implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "Route not found"
        }
    }
}

class ErrServer implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 500,
            msg: "Server error"
        }
    }
}

export class Success implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 200,
            msg: "Successful operation"
        }
    }
}

class ErrorGeneral implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "General Error, can't handle"
        }
    }
}


class ErrGameInProgress implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: user is playing another game"
        }
    }
}

class ErrSamePlayer implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: you can't play against yourself"
        }
    }
}

class ErrMakeMove implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: player move not allowed"
        }
    }
}

class ErrIdGame implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: game do not exist"
        }
    }
}

class ErrPlayerStats implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: player has no stats"
        }
    }
}

class ErrDateFormat implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: wrong date format"
        }
    }
}

class ErrSortMethod implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: invalid sort method"
        }
    }
}

class ErrPlayerTurn implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 402,
            msg: "Error: it is not your turn!"
        }
    }
}


/*
* Enumerazione per identificare i diversi tipi di errore
*/
export enum ErrorEnum {
    ErrTokenHeader,
    MissingToken,
    MalformedPayload,
    ErrPayloadHeader,
    ErrCheckAdmin,
    ErrNotAdmin,
    ErrUser,
    ErrInsufficientToken,
    ErrRouteNotFound,
    ErrServer,
    ErrUserNotOwner,
    ErrorGeneral,
    ErrorGameInProgress,
    ErrorSamePlayer,
    ErrorMakeMove,
    ErrorIdGame,
    ErrorPlayerStats,
    ErrorDateFormat,
    ErrorSortMethod,
    ErrorPlayerTrun
}

/** 
* Funzione che permette di restituire un oggetto in base all'enum in input
**/
let val: Msg;
export function getError(type: ErrorEnum): Msg{
    switch (type)
    {
        case ErrorEnum.ErrTokenHeader:
            val = new ErrTokenHeader();
            break;
        case ErrorEnum.MissingToken:
            val = new ErrJWT();
            break;
        case ErrorEnum.MalformedPayload:
            val = new ErrJSONPayload();
            break;
        case ErrorEnum.ErrPayloadHeader:
            val = new ErrPayloadHeader();
            break;
        case ErrorEnum.ErrNotAdmin:
            val = new ErrNotAdmin();
            break;
        case ErrorEnum.ErrCheckAdmin:
            val = new ErrCheckAdmin();
            break;
        case ErrorEnum.ErrUser:
            val = new ErrUser();
            break;
        case ErrorEnum.ErrInsufficientToken:
            val = new ErrInsufficientToken();
            break;
        case ErrorEnum.ErrRouteNotFound:
            val = new ErrRouteNotFound();
            break;
        case ErrorEnum.ErrServer:
            val = new ErrServer();
            break;
        case ErrorEnum.ErrorGameInProgress:
            val = new ErrGameInProgress();
            break;
        case ErrorEnum.ErrorSamePlayer:
            val = new ErrSamePlayer();
            break;
        case ErrorEnum.ErrorMakeMove:
            val = new ErrMakeMove;
            break;
        case ErrorEnum.ErrorIdGame:
            val = new ErrIdGame;
            break;
        case ErrorEnum.ErrorPlayerStats:
            val = new ErrPlayerStats;
            break;
        case ErrorEnum.ErrorDateFormat:
            val = new ErrDateFormat;
            break;
        case ErrorEnum.ErrorSortMethod:
            val = new ErrSortMethod;
            break;
        case ErrorEnum.ErrorPlayerTrun:
            val = new ErrPlayerTurn;
            break;
        default: ErrorEnum.ErrorGeneral
            val = new ErrorGeneral();
    } return val;
}