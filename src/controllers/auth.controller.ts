import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
    // the register will do manager the register process
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    // the login will do manager the login process 
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};