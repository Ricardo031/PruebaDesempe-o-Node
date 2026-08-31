import type { NextFunction, Request, Response } from "express";
import { inventarioService } from "../services/inventario.service.js";

export const inventarioController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const inventario = await inventarioService.create(req.body);
            res.status(201).json(inventario);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const inventarios = await inventarioService.getAll();
            res.status(200).json(inventarios);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const inventario = await inventarioService.getById(Number(req.params.id));
            res.status(200).json(inventario);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const inventario = await inventarioService.update(Number(req.params.id), req.body);
            res.status(200).json(inventario);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await inventarioService.delete(Number(req.params.id));
            res.status(200).json({ message: "Inventario eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    },
};
