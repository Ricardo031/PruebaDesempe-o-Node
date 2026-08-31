import { Almacen, Clinica, Medicamento, Solicitud } from "../models/index.js";
import { SolicitudStatus } from "../models/solicitud.model.js";
import type { SolicitudCreationAttributes } from "../models/solicitud.model.js";

export const solicitudRepository = {
    findAll: async () => {
        return Solicitud.findAll({
            where: { isDeleted: false },
            include: [
                { model: Clinica, as: "clinica" },
                { model: Almacen, as: "almacen" },
                { model: Medicamento, as: "medicamento" },
            ],
            order: [["createdAt", "DESC"]],
        });
    },

    findById: async (id: number) => {
        return Solicitud.findOne({
            where: { id, isDeleted: false },
            include: [
                { model: Clinica, as: "clinica" },
                { model: Almacen, as: "almacen" },
                { model: Medicamento, as: "medicamento" },
            ],
        });
    },

    findActive: async () => {
        return Solicitud.findAll({
            where: {
                isDeleted: false,
                status: [SolicitudStatus.PENDIENTE, SolicitudStatus.APROBADA],
            },
            include: [
                { model: Clinica, as: "clinica" },
                { model: Almacen, as: "almacen" },
                { model: Medicamento, as: "medicamento" },
            ],
            order: [["createdAt", "DESC"]],
        });
    },

    findByClinicaId: async (clinicaId: number) => {
        return Solicitud.findAll({
            where: { clinicaId, isDeleted: false },
            include: [
                { model: Clinica, as: "clinica" },
                { model: Almacen, as: "almacen" },
                { model: Medicamento, as: "medicamento" },
            ],
            order: [["createdAt", "DESC"]],
        });
    },

    create: async (data: SolicitudCreationAttributes) => {
        return Solicitud.create(data);
    },

    update: async (id: number, data: Partial<SolicitudCreationAttributes>) => {
        const solicitud = await Solicitud.findOne({ where: { id, isDeleted: false } });
        if (!solicitud) return null;
        return solicitud.update(data);
    },

    delete: async (id: number) => {
        const solicitud = await Solicitud.findOne({ where: { id, isDeleted: false } });
        if (!solicitud) return null;
        await solicitud.update({ isDeleted: true });
        return true;
    },
};
