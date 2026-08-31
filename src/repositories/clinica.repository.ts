import { Clinica } from "../models/index.js";
import type { ClinicaCreationAttributes } from "../models/clinica.model.js";


export const clinicRepository = {
    findAll: async () => {
        return Clinica.findAll({ where: { isDeleted: false } });
    },

    findById: async (id: number) => {
        return Clinica.findOne({ where: { id, isDeleted: false } });
    },

    findByNit: async (nit: string) => {
        return Clinica.findOne({ where: { nit, isDeleted: false } });
    },

    create: async (data: ClinicaCreationAttributes) => {
        return Clinica.create(data);
    },

    update: async (id: number, data: Partial<ClinicaCreationAttributes>) => {
        const clinica = await Clinica.findOne({ where: { id, isDeleted: false } });
        if (!clinica) return null;
        return clinica.update(data);
    },

    delete: async (id: number) => {
        const clinica = await Clinica.findOne({ where: { id, isDeleted: false } });
        if (!clinica) return null;
        await clinica.update({ isDeleted: true });
        return true;
    },
};
