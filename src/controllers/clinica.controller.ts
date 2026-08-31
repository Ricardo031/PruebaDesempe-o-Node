import type { NextFunction, Request, Response } from "express";
import { clinicService } from "../services/clinica.service.js";

export const clinicaController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clinic = await clinicService.create(req.body);
            res.status(201).json(clinic);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const clinics = await clinicService.getAll();
            res.status(200).json(clinics);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clinic = await clinicService.getById(Number(req.params.id));
            res.status(200).json(clinic);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clinic = await clinicService.update(Number(req.params.id), req.body);
            res.status(200).json(clinic);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await clinicService.delete(Number(req.params.id));
            res.status(200).json({ message: "Clinica eliminada correctamente" });
        } catch (error) {
            next(error);
        }
    },
};
