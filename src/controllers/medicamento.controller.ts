import type { NextFunction, Request, Response } from "express";
import { medicamentoService } from "../services/medicamento.service.js";

export const medicamentoController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const medicamento = await medicamentoService.create(req.body);
            res.status(201).json(medicamento);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const medicamentos = await medicamentoService.getAll();
            res.status(200).json(medicamentos);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const medicamento = await medicamentoService.getById(Number(req.params.id));
            res.status(200).json(medicamento);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const medicamento = await medicamentoService.update(Number(req.params.id), req.body);
            res.status(200).json(medicamento);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await medicamentoService.delete(Number(req.params.id));
            res.status(200).json({ message: "Medicamento eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    },
};
