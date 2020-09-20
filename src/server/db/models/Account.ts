import {DataTypes, Model, Sequelize, Optional} from "sequelize";

export interface AccountAttrs {
    id: number;
    nickname: string;
    passwordHash: string;
    oauthId: string
    isActive: boolean;
    isReady: boolean;
}

export interface AccountCreateAttrs extends Optional<AccountAttrs, "id"> {

}

export class AccountModel extends Model<AccountAttrs, AccountCreateAttrs> implements AccountAttrs {
    static getById(id: number) {
        const user = AccountModel.findOne({where: {id}});
        return user;
    }
    public id!: number;
    public nickname!: string;
    public passwordHash!: string;
    public oauthId!: string;
    public isActive!: boolean;
    public isReady!: boolean;

    static async getByOauthId(oauthId: string) {
        const user = AccountModel.findOne({where: {oauthId}});
        return user;
    }
}

export async function initAccountModel(dbClientInstance: Sequelize): Promise<void> {
    AccountModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            nickname: {
                type: new DataTypes.STRING(255),
                allowNull: false
            },
            passwordHash: {
                type: new DataTypes.STRING(255),
                allowNull: true
            },
            oauthId: {
                type: new DataTypes.STRING(255),
                allowNull: true
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false

            },
            isReady: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
        },
        {
            tableName: "accounts",
            sequelize: dbClientInstance,
            indexes: [
                {unique: true, fields: ["id"]},
                {unique: true, fields: ["nickname"]},
            ]
        }
    );

    await AccountModel.sync()
}