import { AppError } from "../errors/AppError.js";
import type { ResponsableCreationAttributes } from "../models/responsable.model.js";
import { clinicRepository } from "../repositories/clinica.repository.js";
import { responsableRepository } from "../repositories/responsable.repository.js";

export const responsableService = {
    create: async (data: ResponsableCreationAttributes) => {
        const clinica = await clinicRepository.findById(data.clinicaId);
        if (!clinica) throw new AppError("Clinica no encontrada", 404);
        return responsableRepository.create(data);
    },

    getAll: async () => {
        return responsableRepository.findAll();
    },

    getById: async (id: number) => {
        const responsable = await responsableRepository.findById(id);
        if (!responsable) throw new AppError("Responsable no encontrado", 404);
        return responsable;
    },

    update: async (id: number, data: Partial<ResponsableCreationAttributes>) => {
        const existingResponsable = await responsableRepository.findById(id);
        if (!existingResponsable) throw new AppError("Responsable no encontrado", 404);

        if (data.clinicaId) {
            const clinica = await clinicRepository.findById(data.clinicaId);
            if (!clinica) throw new AppError("Clinica no encontrada", 404);
        }

        return responsableRepository.update(id, data);
    },

    delete: async (id: number) => {
        const existingResponsable = await responsableRepository.findById(id);
        if (!existingResponsable) throw new AppError("Responsable no encontrado", 404);
        return responsableRepository.delete(id);
    },
};
