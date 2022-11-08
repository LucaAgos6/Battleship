import { Sequelize } from 'sequelize';
require('dotenv').config()

/*
    Singleton design pattern used to correctly manage the connection
    to the postgres server, returning a new instance if needed or
    reusing it if it was already instantiated, thus blocking the creation
    of multiple db connections.
*/

export class PostgresSingleton {
    private static instance: PostgresSingleton;
    private connection: Sequelize;
    
    private constructor() {
        this.connection = new Sequelize (process.env.POSTGRES_DATABASE!, process.env.POSTGRES_USER!, process.env.POSTGRES_PASSWORD, {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            dialect: 'postgres'
        });
    }

    public static getConnection(): Sequelize {
        if (!PostgresSingleton.instance) {
            this.instance = new PostgresSingleton();
        }
        return PostgresSingleton.instance.connection;
    }
}