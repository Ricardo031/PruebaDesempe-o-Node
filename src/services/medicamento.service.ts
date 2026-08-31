import { AppError } from "../errors/AppError.js";
import type { MedicamentoCreationAttributes } from "../models/medicamento.model.js";
import { medicamentoRepository } from "../repositories/medicamento.repository.js";

export const medicamentoService = {
    create: async (data: MedicamentoCreationAttributes) => {
        return medicamentoRepository.create(data);
    },

    getAll: async () => {
        return medicamentoRepository.findAll();
    },

    getById: async (id: number) => {
        const medicamento = await medicamentoRepository.findById(id);
        if (!medicamento) throw new AppError("Medicamento no encontrado", 404);
        return medicamento;
    },

    update: async (id: number, data: Partial<MedicamentoCreationAttributes>) => {
        const existingMedicamento = await medicamentoRepository.findById(id);
        if (!existingMedicamento) throw new AppError("Medicamento no encontrado", 404);
        return medicamentoRepository.update(id, data);
    },

    delete: async (id: number) => {
        const existingMedicamento = await medicamentoRepository.findById(id);
        if (!existingMedicamento) throw new AppError("Medicamento no encontrado", 404);
        return medicamentoRepository.delete(id);
    },
};
