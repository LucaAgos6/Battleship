import { PostgresSingleton } from "../connection/connection";
import { DataTypes, Sequelize } from 'sequelize';

export const sequelize: Sequelize = PostgresSingleton.getConnection();

/** 
*Definizione dell'ORM attraverso "Sequelize" per l'interazione con il database
**/

export const Users = sequelize.define('users', {
    email: {
        type: DataTypes.STRING(100),
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    token: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
},
{
    modelName: 'users',
    timestamps: false,
    freezeTableName: true
});


export const Game = sequelize.define('game', {
    id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        autoIncrement: true
    },
    player1: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    player2: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    game_status: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    player_turn: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    winner: {
        type: DataTypes.STRING(100),
    },
    loser: {
        type: DataTypes.STRING(100),
    },
    grid_dim: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    grids: {
        type: DataTypes.JSON,
        allowNull: false
    },
    log_moves: {
        type: DataTypes.JSON,
        allowNull: false
    },
    game_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
},
{
    modelName: 'GAME',
    timestamps: false,
    freezeTableName: true
});


export const Leaderboard = sequelize.define('leaderboard', {
    email: {
        type: DataTypes.STRING(100),
        primaryKey: true
    },
    total_matches: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wins: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    losses: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    win_ratio: {
        type: DataTypes.REAL,
        allowNull: false
    },
    avg_moves: {
        type: DataTypes.REAL,
        allowNull: false
    }
},
{
    modelName: 'leaderboard',
    timestamps: false,
    freezeTableName: true
});
