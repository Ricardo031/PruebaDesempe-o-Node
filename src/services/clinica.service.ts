import { clinicRepository } from "../repositories/clinica.repository.js";
import { AppError } from "../errors/AppError.js";
import type { ClinicaCreationAttributes } from "../models/clinica.model.js";

export const clinicService = {
    create: async (data: ClinicaCreationAttributes) => {
        const existingNit = await clinicRepository.findByNit(data.nit);
        if (existingNit) throw new AppError("Ya existe una clinica con este NIT", 409);
        return clinicRepository.create(data);
    },

    getAll: async () => {
        return clinicRepository.findAll();
    },

    getById: async (id: number) => {
        const existingClinic = await clinicRepository.findById(id);
        if (!existingClinic) throw new AppError("Clinica no encontrada", 404);
        return existingClinic;
    },

    getByNit: async (nit: string) => {
        return clinicRepository.findByNit(nit);
    },

    update: async (id: number, data: Partial<ClinicaCreationAttributes>) => {
        const existingClinic = await clinicRepository.findById(id);
        if (!existingClinic) throw new AppError("Clinica no encontrada", 404);

        if (data.nit) {
            const existingNit = await clinicRepository.findByNit(data.nit);
            if (existingNit && existingNit.id !== id) {
                throw new AppError("Ya existe una clinica con este NIT", 409);
            }
        }

        return clinicRepository.update(id, data);
    },

    delete: async (id: number) => {
        const existingClinic = await clinicRepository.findById(id);
        if (!existingClinic) throw new AppError("Clinica no encontrada", 404);

        return clinicRepository.delete(id);
    },
};
