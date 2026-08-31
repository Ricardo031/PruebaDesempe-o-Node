import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface ResponsableAttributes {
    id: number;
    name: string;
    email: string;
    phone: string;
    clinicaId: number;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ResponsableCreationAttributes extends Optional<ResponsableAttributes, "id" | "isDeleted"> { }

export class Responsable extends Model<ResponsableAttributes, ResponsableCreationAttributes> implements ResponsableAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare phone: string;
    declare clinicaId: number;
    declare isDeleted: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Responsable.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clinicaId: {
            type: DataTypes.INTEGER,
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
        tableName: "responsables",
        timestamps: true,
    }
);

