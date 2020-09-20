import {DataTypes, Model, Sequelize, Optional} from "sequelize";
import { MatchModel } from "./Match";

export interface MatchToAccountAttrs {
    id: number;
    matchId: number;
    accountId: number;
    sourcePlayerId: string;
}

export interface MatchToAccountCreateAttrs extends Optional<MatchToAccountAttrs, "id"> {

}

export class MatchToAccountModel extends Model<MatchToAccountAttrs, MatchToAccountCreateAttrs> implements MatchToAccountAttrs {
    public id!: number;
    public matchId!: number;
    public accountId!: number;
    public sourcePlayerId!: string;

    static getByMatchId(matchId: string) {
        const items = MatchToAccountModel.findAll({where: {matchId}});
        return items;
    }
}

export async function initMatchToAccountModel(dbClientInstance: Sequelize): Promise<void> {
    MatchToAccountModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            matchId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            },
            accountId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            },
            sourcePlayerId: {
                type: new DataTypes.STRING(255),
                allowNull: false
            }
        },
        {
            tableName: "match_to_account",
            sequelize: dbClientInstance,
            indexes: [
                {unique: true, fields: ["id"]},
                {unique: true, fields: ["sourcePlayerId"]},
                {unique: true, fields: ["matchId", "accountId"]},
            ]
        }
    );

    await MatchModel.sync()
}