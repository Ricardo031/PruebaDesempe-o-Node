import { Router } from "express";
import { inventarioController } from "../controllers/inventario.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { UserRole } from "../models/user.model.js";
import { inventarioSchema, updateInventarioSchema } from "../schemas/inventario.schema.js";

const inventarioRoutes = Router();

/**
 * @openapi
 * /api/inventarios:
 *   post:
 *     summary: Registrar inventario para un almacen y medicamento
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [almacenId, medicamentoId, quantity]
 *             properties:
 *               almacenId:
 *                 type: integer
 *               medicamentoId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inventario creado correctamente
 */
inventarioRoutes.post("/", requireAuth, requireRole(UserRole.ADMIN), validateBody(inventarioSchema), inventarioController.create);

/**
 * @openapi
 * /api/inventarios:
 *   get:
 *     summary: Obtener todo el inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inventario
 */
inventarioRoutes.get("/", requireAuth, requireRole(UserRole.ADMIN), inventarioController.getAll);

/**
 * @openapi
 * /api/inventarios/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener un inventario por ID
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *       404:
 *         description: Inventario no encontrado
 */
inventarioRoutes.get("/:id", requireAuth, requireRole(UserRole.ADMIN), inventarioController.getById);

/**
 * @openapi
 * /api/inventarios/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   put:
 *     summary: Actualizar inventario
 *     tags: [Inventario]
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
 *         description: Inventario actualizado correctamente
 *       404:
 *         description: Inventario no encontrado
 */
inventarioRoutes.put("/:id", requireAuth, requireRole(UserRole.ADMIN), validateBody(updateInventarioSchema), inventarioController.update);

/**
 * @openapi
 * /api/inventarios/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Eliminar un inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventario eliminado correctamente
 *       404:
 *         description: Inventario no encontrado
 */
inventarioRoutes.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), inventarioController.delete);

export default inventarioRoutes;
