import { Router } from "express";
import { almacenController } from "../controllers/almacen.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { UserRole } from "../models/user.model.js";
import { almacenSchema, updateAlmacenSchema } from "../schemas/almacen.schema.js";

const almacenRoutes = Router();

/**
 * @openapi
 * /api/almacenes:
 *   post:
 *     summary: Registrar un nuevo almacen
 *     tags: [Almacen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Almacen creado correctamente
 */
almacenRoutes.post("/", requireAuth, requireRole(UserRole.ADMIN), validateBody(almacenSchema), almacenController.create);

/**
 * @openapi
 * /api/almacenes:
 *   get:
 *     summary: Obtener todos los almacenes
 *     tags: [Almacen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de almacenes
 */
almacenRoutes.get("/", requireAuth, requireRole(UserRole.ADMIN), almacenController.getAll);

/**
 * @openapi
 * /api/almacenes/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener un almacen por ID
 *     tags: [Almacen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Almacen encontrado
 *       404:
 *         description: Almacen no encontrado
 */
almacenRoutes.get("/:id", requireAuth, requireRole(UserRole.ADMIN), almacenController.getById);

/**
 * @openapi
 * /api/almacenes/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   put:
 *     summary: Actualizar un almacen
 *     tags: [Almacen]
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
 *         description: Almacen actualizado correctamente
 *       404:
 *         description: Almacen no encontrado
 */
almacenRoutes.put("/:id", requireAuth, requireRole(UserRole.ADMIN), validateBody(updateAlmacenSchema), almacenController.update);

/**
 * @openapi
 * /api/almacenes/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Eliminar logicamente un almacen
 *     tags: [Almacen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Almacen eliminado correctamente
 *       404:
 *         description: Almacen no encontrado
 */
almacenRoutes.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), almacenController.delete);

export default almacenRoutes;
