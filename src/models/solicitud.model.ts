import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export enum SolicitudStatus {
    PENDIENTE = "PENDIENTE",
    APROBADA = "APROBADA",
    RECHAZADA = "RECHAZADA",
    ENTREGADA = "ENTREGADA",
}

interface SolicitudAttributes {
    id: number;
    clinicaId: number;
    almacenId: number;
    medicamentoId: number;
    quantity: number;
    status: SolicitudStatus;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SolicitudCreationAttributes extends Optional<SolicitudAttributes, "id" | "isDeleted"> { }

export class Solicitud extends Model<SolicitudAttributes, SolicitudCreationAttributes> implements SolicitudAttributes {
    declare id: number;
    declare clinicaId: number;
    declare almacenId: number;
    declare medicamentoId: number;
    declare quantity: number;
    declare status: SolicitudStatus;
    declare isDeleted: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Solicitud.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        clinicaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        status: {
            type: DataTypes.ENUM(
                SolicitudStatus.PENDIENTE,
                SolicitudStatus.APROBADA,
                SolicitudStatus.RECHAZADA,
                SolicitudStatus.ENTREGADA
            ),
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
        tableName: "solicitudes",
        timestamps: true,
    }
);
