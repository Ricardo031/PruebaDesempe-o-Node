import { Router } from "express";
import { responsableController } from "../controllers/responsable.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { UserRole } from "../models/user.model.js";
import { responsableSchema, updateResponsableSchema } from "../schemas/responsable.schema.js";

const responsableRoutes = Router();

/**
 * @openapi
 * /api/responsables:
 *   post:
 *     summary: Registrar un nuevo responsable
 *     tags: [Responsable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, clinicaId]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               clinicaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Responsable creado correctamente
 */
responsableRoutes.post("/", requireAuth, requireRole(UserRole.ADMIN), validateBody(responsableSchema), responsableController.create);

/**
 * @openapi
 * /api/responsables:
 *   get:
 *     summary: Obtener todos los responsables
 *     tags: [Responsable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de responsables
 */
responsableRoutes.get("/", requireAuth, requireRole(UserRole.ADMIN), responsableController.getAll);

/**
 * @openapi
 * /api/responsables/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener un responsable por ID
 *     tags: [Responsable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Responsable encontrado
 *       404:
 *         description: Responsable no encontrado
 */
responsableRoutes.get("/:id", requireAuth, requireRole(UserRole.ADMIN), responsableController.getById);

/**
 * @openapi
 * /api/responsables/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   put:
 *     summary: Actualizar un responsable
 *     tags: [Responsable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Responsable actualizado correctamente
 *       404:
 *         description: Responsable no encontrado
 */
responsableRoutes.put("/:id", requireAuth, requireRole(UserRole.ADMIN), validateBody(updateResponsableSchema), responsableController.update);

/**
 * @openapi
 * /api/responsables/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Eliminar logicamente un responsable
 *     tags: [Responsable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Responsable eliminado correctamente
 *       404:
 *         description: Responsable no encontrado
 */
responsableRoutes.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), responsableController.delete);

export default responsableRoutes;
