import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface InventarioAttributes {
    id: number;
    almacenId: number;
    medicamentoId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InventarioCreationAttributes extends Optional<InventarioAttributes, "id"> { }

export class Inventario extends Model<InventarioAttributes, InventarioCreationAttributes> implements InventarioAttributes {
    declare id: number;
    declare almacenId: number;
    declare medicamentoId: number;
    declare quantity: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Inventario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        almacenId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        medicamentoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "inventarios",
        timestamps: true,
        indexes: [
            { unique: true, fields: ["almacenId", "medicamentoId"] },
        ],
    }
);
