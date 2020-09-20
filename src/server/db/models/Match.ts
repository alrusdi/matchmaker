import {DataTypes, Model, Sequelize, Optional} from "sequelize";

export interface MatchAttrs {
    id: number;
    link: string;
    startedAt: Date;
    finishedAt: Date;
    sourceLink: string;
}

export interface MatchCreateAttrs extends Optional<MatchAttrs, "id"> {

}

export class MatchModel extends Model<MatchAttrs, MatchCreateAttrs> implements MatchAttrs {
    public id!: number;
    public link!: string;
    public sourceLink!: string;
    public startedAt!: Date;
    public finishedAt!: Date;

    static getByLink(link: string) {
        const user = MatchModel.findOne({where: {link}});
        return user;
    }
}

export async function initMatchModel(dbClientInstance: Sequelize): Promise<void> {
    MatchModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            link: {
                type: new DataTypes.STRING(255),
                allowNull: true
            },
            sourceLink: {
                type: new DataTypes.STRING(255),
                allowNull: true
            },
            startedAt: {
                type: new DataTypes.DATE(),
                allowNull: true
            },
            finishedAt: {
                type: new DataTypes.DATE(),
                allowNull: true
            }
        },
        {
            tableName: "matches",
            sequelize: dbClientInstance,
            indexes: [
                {unique: true, fields: ["id"]},
                {unique: true, fields: ["link"]},
            ]
        }
    );

    await MatchModel.sync()
}