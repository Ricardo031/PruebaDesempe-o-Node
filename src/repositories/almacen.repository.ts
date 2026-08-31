import { Almacen } from "../models/index.js";
import type { AlmacenCreationAttributes } from "../models/almacen.model.js";

export const almacenRepository = {
    findAll: async () => {
        return Almacen.findAll({ where: { isDeleted: false } });
    },

    findById: async (id: number) => {
        return Almacen.findOne({ where: { id, isDeleted: false } });
    },

    create: async (data: AlmacenCreationAttributes) => {
        return Almacen.create(data);
    },

    update: async (id: number, data: Partial<AlmacenCreationAttributes>) => {
        const almacen = await Almacen.findOne({ where: { id, isDeleted: false } });
        if (!almacen) return null;
        return almacen.update(data);
    },

    delete: async (id: number) => {
        const almacen = await Almacen.findOne({ where: { id, isDeleted: false } });
        if (!almacen) return null;
        await almacen.update({ isDeleted: true });
        return true;
    },
};
