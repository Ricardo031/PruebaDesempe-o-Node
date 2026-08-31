import { Router } from "express";
import { medicamentoController } from "../controllers/medicamento.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { UserRole } from "../models/user.model.js";
import { medicamentoSchema, updateMedicamentoSchema } from "../schemas/medicamento.schema.js";

const medicamentoRoutes = Router();

/**
 * @openapi
 * /api/medicamentos:
 *   post:
 *     summary: Registrar un nuevo medicamento
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, unit]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               unit:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicamento creado correctamente
 */
medicamentoRoutes.post("/", requireAuth, requireRole(UserRole.ADMIN), validateBody(medicamentoSchema), medicamentoController.create);

/**
 * @openapi
 * /api/medicamentos:
 *   get:
 *     summary: Obtener todos los medicamentos
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de medicamentos
 */
medicamentoRoutes.get("/", requireAuth, requireRole(UserRole.ADMIN), medicamentoController.getAll);

/**
 * @openapi
 * /api/medicamentos/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener un medicamento por ID
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medicamento encontrado
 *       404:
 *         description: Medicamento no encontrado
 */
medicamentoRoutes.get("/:id", requireAuth, requireRole(UserRole.ADMIN), medicamentoController.getById);

/**
 * @openapi
 * /api/medicamentos/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   put:
 *     summary: Actualizar un medicamento
 *     tags: [Medicamento]
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
 *         description: Medicamento actualizado correctamente
 *       404:
 *         description: Medicamento no encontrado
 */
medicamentoRoutes.put("/:id", requireAuth, requireRole(UserRole.ADMIN), validateBody(updateMedicamentoSchema), medicamentoController.update);

/**
 * @openapi
 * /api/medicamentos/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Eliminar logicamente un medicamento
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medicamento eliminado correctamente
 *       404:
 *         description: Medicamento no encontrado
 */
medicamentoRoutes.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), medicamentoController.delete);

export default medicamentoRoutes;
