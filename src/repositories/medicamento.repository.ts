import { Medicamento } from "../models/index.js";
import type { MedicamentoCreationAttributes } from "../models/medicamento.model.js";

export const medicamentoRepository = {
    findAll: async () => {
        return Medicamento.findAll({ where: { isDeleted: false } });
    },

    findById: async (id: number) => {
        return Medicamento.findOne({ where: { id, isDeleted: false } });
    },

    create: async (data: MedicamentoCreationAttributes) => {
        return Medicamento.create(data);
    },

    update: async (id: number, data: Partial<MedicamentoCreationAttributes>) => {
        const medicamento = await Medicamento.findOne({ where: { id, isDeleted: false } });
        if (!medicamento) return null;
        return medicamento.update(data);
    },

    delete: async (id: number) => {
        const medicamento = await Medicamento.findOne({ where: { id, isDeleted: false } });
        if (!medicamento) return null;
        await medicamento.update({ isDeleted: true });
        return true;
    },
};
