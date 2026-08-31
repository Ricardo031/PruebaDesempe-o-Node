import { Router } from "express";
import { solicitudController } from "../controllers/solicitud.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { UserRole } from "../models/user.model.js";
import { solicitudSchema, updateSolicitudStatusSchema } from "../schemas/solicitud.schema.js";

const solicitudRoutes = Router();

/**
 * @openapi
 * /api/solicitudes:
 *   post:
 *     summary: Registrar una nueva solicitud
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicaId, almacenId, medicamentoId, quantity, status]
 *             properties:
 *               clinicaId:
 *                 type: integer
 *               almacenId:
 *                 type: integer
 *               medicamentoId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [PENDIENTE, APROBADA, RECHAZADA, ENTREGADA]
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 */
solicitudRoutes.post("/", requireAuth, requireRole(UserRole.ADMIN, UserRole.GESTOR), validateBody(solicitudSchema), solicitudController.create);

/**
 * @openapi
 * /api/solicitudes:
 *   get:
 *     summary: Obtener todas las solicitudes
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
solicitudRoutes.get("/", requireAuth, requireRole(UserRole.ADMIN, UserRole.GESTOR), solicitudController.getAll);

/**
 * @openapi
 * /api/solicitudes/activas:
 *   get:
 *     summary: Obtener solicitudes activas
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes activas
 */
solicitudRoutes.get("/activas", requireAuth, requireRole(UserRole.ADMIN, UserRole.GESTOR), solicitudController.getActive);

/**
 * @openapi
 * /api/solicitudes/historial/clinica/{clinicaId}:
 *   parameters:
 *     - name: clinicaId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener historial de solicitudes por clinica
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de solicitudes
 *       404:
 *         description: Clinica no encontrada
 */
solicitudRoutes.get("/historial/clinica/:clinicaId", requireAuth, requireRole(UserRole.ADMIN, UserRole.GESTOR), solicitudController.getHistoryByClinica);

/**
 * @openapi
 * /api/solicitudes/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: Solicitud no encontrada
 */
solicitudRoutes.get("/:id", requireAuth, requireRole(UserRole.ADMIN, UserRole.GESTOR), solicitudController.getById);

/**
 * @openapi
 * /api/solicitudes/{id}/estado:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   patch:
 *     summary: Actualizar el estado de una solicitud
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDIENTE, APROBADA, RECHAZADA, ENTREGADA]
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Solicitud no encontrada
 */
solicitudRoutes.patch("/:id/estado", requireAuth, requireRole(UserRole.ADMIN, UserRole.GESTOR), validateBody(updateSolicitudStatusSchema), solicitudController.updateStatus);

/**
 * @openapi
 * /api/solicitudes/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Eliminar logicamente una solicitud
 *     tags: [Solicitud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitud eliminada correctamente
 *       404:
 *         description: Solicitud no encontrada
 */
solicitudRoutes.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), solicitudController.delete);

export default solicitudRoutes;
