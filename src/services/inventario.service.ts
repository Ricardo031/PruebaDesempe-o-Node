import { AppError } from "../errors/AppError.js";
import type { InventarioCreationAttributes } from "../models/inventario.model.js";
import { almacenRepository } from "../repositories/almacen.repository.js";
import { inventarioRepository } from "../repositories/inventario.repository.js";
import { medicamentoRepository } from "../repositories/medicamento.repository.js";

export const inventarioService = {
    create: async (data: InventarioCreationAttributes) => {
        if (data.quantity <= 0) {
            throw new AppError("La cantidad debe ser mayor a cero", 400);
        }

        const almacen = await almacenRepository.findById(data.almacenId);
        if (!almacen) throw new AppError("Almacen no encontrado", 404);

        const medicamento = await medicamentoRepository.findById(data.medicamentoId);
        if (!medicamento) throw new AppError("Medicamento no encontrado", 404);

        const existingInventory = await inventarioRepository.findByAlmacenAndMedicamento(data.almacenId, data.medicamentoId);
        if (existingInventory) {
            throw new AppError("Ya existe inventario para este almacen y medicamento", 409);
        }

        return inventarioRepository.create(data);
    },

    getAll: async () => {
        return inventarioRepository.findAll();
    },

    getById: async (id: number) => {
        const inventario = await inventarioRepository.findById(id);
        if (!inventario) throw new AppError("Inventario no encontrado", 404);
        return inventario;
    },

    update: async (id: number, data: Partial<InventarioCreationAttributes>) => {
        const existingInventory = await inventarioRepository.findById(id);
        if (!existingInventory) throw new AppError("Inventario no encontrado", 404);

        if (data.quantity !== undefined && data.quantity <= 0) {
            throw new AppError("La cantidad debe ser mayor a cero", 400);
        }

        const almacenId = data.almacenId ?? existingInventory.almacenId;
        const medicamentoId = data.medicamentoId ?? existingInventory.medicamentoId;

        if (data.almacenId) {
            const almacen = await almacenRepository.findById(data.almacenId);
            if (!almacen) throw new AppError("Almacen no encontrado", 404);
        }

        if (data.medicamentoId) {
            const medicamento = await medicamentoRepository.findById(data.medicamentoId);
            if (!medicamento) throw new AppError("Medicamento no encontrado", 404);
        }

        const duplicateInventory = await inventarioRepository.findByAlmacenAndMedicamento(almacenId, medicamentoId);
        if (duplicateInventory && duplicateInventory.id !== id) {
            throw new AppError("Ya existe inventario para este almacen y medicamento", 409);
        }

        return inventarioRepository.update(id, data);
    },

    delete: async (id: number) => {
        const existingInventory = await inventarioRepository.findById(id);
        if (!existingInventory) throw new AppError("Inventario no encontrado", 404);
        return inventarioRepository.delete(id);
    },
};
