import {Sequelize} from "sequelize";
import path = require("path");
import { initAccountModel } from "./models/Account";
import { initMatchModel } from "./models/Match";

export class Database {
    private client: Sequelize;

    constructor() {
        let connectionString = "sqlite://" + path.resolve(__dirname, "..", "..", "..", "db", "game.db")
        console.log(connectionString);
        if (process.env.POSTGRES_HOST !== undefined) {
            connectionString = process.env.POSTGRES_HOST
        }
        this.client = new Sequelize(connectionString)
    }

    async init() {
        await initAccountModel(this.client)
        await initMatchModel(this.client)
    }
}
