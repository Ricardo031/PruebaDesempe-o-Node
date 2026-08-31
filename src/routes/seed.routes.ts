import { Router } from "express";
import multer from "multer";
import { seedController } from "../controllers/seed.controller.js";
import { AppError } from "../errors/AppError.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../models/user.model.js";

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, callback) => {
        const isJsonFile =
            file.mimetype === "application/json" ||
            file.originalname.toLowerCase().endsWith(".json");

        if (!isJsonFile) {
            callback(new AppError("Solo se permiten archivos JSON", 400));
            return;
        }

        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const seedRoutes = Router();

/**
 * @openapi
 * /api/seed/upload:
 *   post:
 *     summary: Cargar un archivo JSON para poblar la base de datos
 *     tags: [Seed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Seed cargado correctamente
 *       400:
 *         description: Archivo inválido o JSON mal formado
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No autorizado
 */
seedRoutes.post(
    "/upload",
    requireAuth,
    requireRole(UserRole.ADMIN),
    upload.single("file"),
    seedController.importJson
);

export default seedRoutes;
