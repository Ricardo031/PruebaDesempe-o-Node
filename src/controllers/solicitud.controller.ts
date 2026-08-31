import type { NextFunction, Request, Response } from "express";
import { solicitudService } from "../services/solicitud.service.js";

export const solicitudController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const solicitud = await solicitudService.create(req.body);
            res.status(201).json(solicitud);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const solicitudes = await solicitudService.getAll();
            res.status(200).json(solicitudes);
        } catch (error) {
            next(error);
        }
    },

    getActive: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const solicitudes = await solicitudService.getActive();
            res.status(200).json(solicitudes);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const solicitud = await solicitudService.getById(Number(req.params.id));
            res.status(200).json(solicitud);
        } catch (error) {
            next(error);
        }
    },

    getHistoryByClinica: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const solicitudes = await solicitudService.getHistoryByClinica(Number(req.params.clinicaId));
            res.status(200).json(solicitudes);
        } catch (error) {
            next(error);
        }
    },

    updateStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const solicitud = await solicitudService.updateStatus(Number(req.params.id), req.body.status);
            res.status(200).json(solicitud);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await solicitudService.delete(Number(req.params.id));
            res.status(200).json({ message: "Solicitud eliminada correctamente" });
        } catch (error) {
            next(error);
        }
    },
};
