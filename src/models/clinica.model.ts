import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface ClinicaAttributes {
    id: number;
    name: string;
    nit: string;
    address: string;
    phone: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ClinicaCreationAttributes extends Optional<ClinicaAttributes, "id" | "isDeleted"> { }

export class Clinica extends Model<ClinicaAttributes, ClinicaCreationAttributes> implements ClinicaAttributes {
    declare id: number;
    declare name: string;
    declare nit: string;
    declare address: string;
    declare phone: string;
    declare isDeleted: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Clinica.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    { sequelize, tableName: "clinicas", timestamps: true }
);
