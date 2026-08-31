import { Almacen, Inventario, Medicamento } from "../models/index.js";
import type { InventarioCreationAttributes } from "../models/inventario.model.js";

export const inventarioRepository = {
    findAll: async () => {
        return Inventario.findAll({
            include: [
                { model: Almacen, as: "almacen" },
                { model: Medicamento, as: "medicamento" },
            ],
        });
    },

    findById: async (id: number) => {
        return Inventario.findByPk(id, {
            include: [
                { model: Almacen, as: "almacen" },
                { model: Medicamento, as: "medicamento" },
            ],
        });
    },

    findByAlmacenAndMedicamento: async (almacenId: number, medicamentoId: number) => {
        return Inventario.findOne({ where: { almacenId, medicamentoId } });
    },

    create: async (data: InventarioCreationAttributes) => {
        return Inventario.create(data);
    },

    update: async (id: number, data: Partial<InventarioCreationAttributes>) => {
        const inventario = await Inventario.findByPk(id);
        if (!inventario) return null;
        return inventario.update(data);
    },

    delete: async (id: number) => {
        const inventario = await Inventario.findByPk(id);
        if (!inventario) return null;
        await inventario.destroy();
        return true;
    },
};
