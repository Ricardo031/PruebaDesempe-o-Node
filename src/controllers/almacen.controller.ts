import type { NextFunction, Request, Response } from "express";
import { almacenService } from "../services/almacen.service.js";

export const almacenController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const almacen = await almacenService.create(req.body);
            res.status(201).json(almacen);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const almacenes = await almacenService.getAll();
            res.status(200).json(almacenes);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const almacen = await almacenService.getById(Number(req.params.id));
            res.status(200).json(almacen);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const almacen = await almacenService.update(Number(req.params.id), req.body);
            res.status(200).json(almacen);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await almacenService.delete(Number(req.params.id));
            res.status(200).json({ message: "Almacen eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    },
};
