import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface MedicamentoAttributes {
    id: number;
    name: string;
    description?: string | null;
    unit: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MedicamentoCreationAttributes extends Optional<MedicamentoAttributes, "id" | "description" | "isDeleted"> { }

export class Medicamento extends Model<MedicamentoAttributes, MedicamentoCreationAttributes> implements MedicamentoAttributes {
    declare id: number;
    declare name: string;
    declare description?: string | null;
    declare unit: string;
    declare isDeleted: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Medicamento.init(
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        unit: {
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
        tableName: "medicamentos",
        timestamps: true,
    }
);
