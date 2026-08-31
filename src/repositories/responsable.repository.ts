import { Responsable } from "../models/index.js";
import type { ResponsableCreationAttributes } from "../models/responsable.model.js";

export const responsableRepository = {
    findAll: async () => {
        return Responsable.findAll({ where: { isDeleted: false } });
    },

    findById: async (id: number) => {
        return Responsable.findOne({ where: { id, isDeleted: false } });
    },

    create: async (data: ResponsableCreationAttributes) => {
        return Responsable.create(data);
    },

    update: async (id: number, data: Partial<ResponsableCreationAttributes>) => {
        const responsable = await Responsable.findOne({ where: { id, isDeleted: false } });
        if (!responsable) return null;
        return responsable.update(data);
    },

    delete: async (id: number) => {
        const responsable = await Responsable.findOne({ where: { id, isDeleted: false } });
        if (!responsable) return null;
        await responsable.update({ isDeleted: true });
        return true;
    },
};
