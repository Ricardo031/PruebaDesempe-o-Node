import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";
import { AppError } from "../errors/AppError.js";
import {
    Almacen,
    Clinica,
    Inventario,
    Medicamento,
    Responsable,
    Solicitud,
    User,
} from "../models/index.js";
import type { AlmacenCreationAttributes } from "../models/almacen.model.js";
import type { ClinicaCreationAttributes } from "../models/clinica.model.js";
import type { InventarioCreationAttributes } from "../models/inventario.model.js";
import type { MedicamentoCreationAttributes } from "../models/medicamento.model.js";
import type { ResponsableCreationAttributes } from "../models/responsable.model.js";
import type { SolicitudCreationAttributes } from "../models/solicitud.model.js";
import type { UserCreationAttributes } from "../models/user.model.js";

const HASH_ROUNDS = 10;

export interface SeedPayload {
    users?: UserCreationAttributes[];
    clinicas?: ClinicaCreationAttributes[];
    responsables?: ResponsableCreationAttributes[];
    almacenes?: AlmacenCreationAttributes[];
    medicamentos?: MedicamentoCreationAttributes[];
    inventarios?: InventarioCreationAttributes[];
    solicitudes?: SolicitudCreationAttributes[];
}

export const parseSeedPayload = (rawJson: string): SeedPayload => {
    try {
        const parsed = JSON.parse(rawJson) as SeedPayload;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new AppError("El archivo JSON debe contener un objeto valido", 400);
        }
        return parsed;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("No se pudo parsear el archivo JSON", 400);
    }
};

export const importJsonSeed = async (rawJson: string) => {
    const payload = parseSeedPayload(rawJson);

    const transaction = await sequelize.transaction();

    try {
        const users = payload.users ?? [];
        const clinicas = payload.clinicas ?? [];
        const responsables = payload.responsables ?? [];
        const almacenes = payload.almacenes ?? [];
        const medicamentos = payload.medicamentos ?? [];
        const inventarios = payload.inventarios ?? [];
        const solicitudes = payload.solicitudes ?? [];

        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, HASH_ROUNDS),
            }))
        );

        if (hashedUsers.length > 0) {
            await User.bulkCreate(hashedUsers, { transaction, validate: true });
        }

        if (clinicas.length > 0) {
            await Clinica.bulkCreate(clinicas, { transaction, validate: true });
        }

        if (responsables.length > 0) {
            await Responsable.bulkCreate(responsables, { transaction, validate: true });
        }

        if (almacenes.length > 0) {
            await Almacen.bulkCreate(almacenes, { transaction, validate: true });
        }

        if (medicamentos.length > 0) {
            await Medicamento.bulkCreate(medicamentos, { transaction, validate: true });
        }

        if (inventarios.length > 0) {
            await Inventario.bulkCreate(inventarios, { transaction, validate: true });
        }

        if (solicitudes.length > 0) {
            await Solicitud.bulkCreate(solicitudes, { transaction, validate: true });
        }

        await transaction.commit();

        return {
            message: "Seed cargado correctamente",
            summary: {
                users: users.length,
                clinicas: clinicas.length,
                responsables: responsables.length,
                almacenes: almacenes.length,
                medicamentos: medicamentos.length,
                inventarios: inventarios.length,
                solicitudes: solicitudes.length,
            },
        };
    } catch (error) {
        await transaction.rollback();
        if (error instanceof AppError) throw error;
        throw new AppError("No se pudo cargar el archivo seed en la base de datos", 400);
    }
};
