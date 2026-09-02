import { Router } from "express";
import { clinicaController } from "../controllers/clinica.controller.js";
import { clinicaSchema, updateClinicaSchema } from "../schemas/clinica.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../models/user.model.js";

const clinicaRoutes = Router();

/**
 * @openapi
 * /api/clinicas:
 *   post:
 *     summary: Registrar una nueva clica
 *     tags: [Clinica]
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nit, address, phone]
 *             properties:
 *               name:
 *                 type: string
 *               nit:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *        201:
 *         description: Clinica registrada exitosamente, retorna
 * 
*/
clinicaRoutes.post("/", requireAuth, requireRole(UserRole.ADMIN), validateBody(clinicaSchema), clinicaController.create);

/**
 * @openapi
 * /api/clinicas:
 *   get:
 *     summary: Obtener todas las clicas
 *     tags: [Clinica]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        200:
 *         description: Todas las clicas registradas
 */
clinicaRoutes.get("/", requireAuth, requireRole(UserRole.ADMIN), clinicaController.getAll);

/**
 * @openapi
 * /api/clinicas/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: El ID de la clica
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener una clica por su id
 *     tags: [Clinica]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        200:
 *         description: Clica encontrada
 *        404:
 *         description: Clica no encontrada
 */
clinicaRoutes.get("/:id", requireAuth, requireRole(UserRole.ADMIN), clinicaController.getById);

/**
 * @openapi
 * /api/clinicas/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: El ID de la clica
 *       schema:
 *         type: integer
 *   put:
 *     summary: Actualizar una clica por su id
 *     tags: [Clinica]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nit:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string

 *     responses:
 *        200:
 *         description: Clica actualizada exitosamente
 *        404:
 *         description: Clica no encontrada
 */
clinicaRoutes.put("/:id", requireAuth, requireRole(UserRole.ADMIN), validateBody(updateClinicaSchema), clinicaController.update);

/**
 * @openapi
 * /api/clinicas/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: El ID de la clica
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Eliminar una clica por su id
 *     tags: [Clinica]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        200:
 *         description: Clica eliminada exitosamente
 *        404:
 *         description: Clica no encontrada
 */
clinicaRoutes.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), clinicaController.delete);

export default clinicaRoutes;
