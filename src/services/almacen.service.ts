import { AppError } from "../errors/AppError.js";
import type { AlmacenCreationAttributes } from "../models/almacen.model.js";
import { almacenRepository } from "../repositories/almacen.repository.js";

export const almacenService = {
    create: async (data: AlmacenCreationAttributes) => {
        return almacenRepository.create(data);
    },

    getAll: async () => {
        return almacenRepository.findAll();
    },

    getById: async (id: number) => {
        const almacen = await almacenRepository.findById(id);
        if (!almacen) throw new AppError("Almacen no encontrado", 404);
        return almacen;
    },

    update: async (id: number, data: Partial<AlmacenCreationAttributes>) => {
        const existingAlmacen = await almacenRepository.findById(id);
        if (!existingAlmacen) throw new AppError("Almacen no encontrado", 404);
        return almacenRepository.update(id, data);
    },

    delete: async (id: number) => {
        const existingAlmacen = await almacenRepository.findById(id);
        if (!existingAlmacen) throw new AppError("Almacen no encontrado", 404);
        return almacenRepository.delete(id);
    },
};
