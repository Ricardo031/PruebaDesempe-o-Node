import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface AlmacenAttributes {
    id: number;
    name: string;
    location: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AlmacenCreationAttributes extends Optional<AlmacenAttributes, "id" | "isDeleted"> { }

export class Almacen extends Model<AlmacenAttributes, AlmacenCreationAttributes> implements AlmacenAttributes {
    declare id: number;
    declare name: string;
    declare location: string;
    declare isDeleted: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Almacen.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "almacenes",
        timestamps: true,
    }
);
