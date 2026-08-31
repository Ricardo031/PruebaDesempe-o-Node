import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export enum UserRole {
    ADMIN = "ADMIN",
    GESTOR = "GESTOR",
}

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: UserRole;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("ADMIN", "GESTOR"),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: "users",
    timestamps: true,
})
