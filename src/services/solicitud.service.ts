import { AppError } from "../errors/AppError.js";
import { SolicitudStatus, type SolicitudCreationAttributes } from "../models/solicitud.model.js";
import { almacenRepository } from "../repositories/almacen.repository.js";
import { clinicRepository } from "../repositories/clinica.repository.js";
import { inventarioRepository } from "../repositories/inventario.repository.js";
import { medicamentoRepository } from "../repositories/medicamento.repository.js";
import { solicitudRepository } from "../repositories/solicitud.repository.js";

const allowedStatusTransitions: Record<SolicitudStatus, SolicitudStatus[]> = {
    [SolicitudStatus.PENDIENTE]: [SolicitudStatus.APROBADA, SolicitudStatus.RECHAZADA],
    [SolicitudStatus.APROBADA]: [SolicitudStatus.ENTREGADA, SolicitudStatus.RECHAZADA],
    [SolicitudStatus.RECHAZADA]: [],
    [SolicitudStatus.ENTREGADA]: [],
};

export const solicitudService = {
    create: async (data: SolicitudCreationAttributes) => {
        if (data.quantity <= 0) {
            throw new AppError("La cantidad solicitada debe ser mayor a cero", 400);
        }

        const clinica = await clinicRepository.findById(data.clinicaId);
        if (!clinica) throw new AppError("Clinica no encontrada", 404);

        const almacen = await almacenRepository.findById(data.almacenId);
        if (!almacen) throw new AppError("Almacen no encontrado", 404);

        const medicamento = await medicamentoRepository.findById(data.medicamentoId);
        if (!medicamento) throw new AppError("Medicamento no encontrado", 404);

        const inventario = await inventarioRepository.findByAlmacenAndMedicamento(data.almacenId, data.medicamentoId);
        if (!inventario || inventario.quantity < data.quantity) {
            throw new AppError("Inventario insuficiente para registrar la solicitud", 400);
        }

        if (!Object.values(SolicitudStatus).includes(data.status)) {
            throw new AppError("Estado de solicitud no permitido", 400);
        }

        return solicitudRepository.create(data);
    },

    getAll: async () => {
        return solicitudRepository.findAll();
    },

    getActive: async () => {
        return solicitudRepository.findActive();
    },

    getHistoryByClinica: async (clinicaId: number) => {
        const clinica = await clinicRepository.findById(clinicaId);
        if (!clinica) throw new AppError("Clinica no encontrada", 404);
        return solicitudRepository.findByClinicaId(clinicaId);
    },

    getById: async (id: number) => {
        const solicitud = await solicitudRepository.findById(id);
        if (!solicitud) throw new AppError("Solicitud no encontrada", 404);
        return solicitud;
    },

    updateStatus: async (id: number, status: SolicitudStatus) => {
        const solicitud = await solicitudRepository.findById(id);
        if (!solicitud) throw new AppError("Solicitud no encontrada", 404);

        if (!allowedStatusTransitions[solicitud.status].includes(status)) {
            throw new AppError("No se puede cambiar la solicitud a ese estado", 400);
        }

        if (status === SolicitudStatus.ENTREGADA) {
            const inventario = await inventarioRepository.findByAlmacenAndMedicamento(solicitud.almacenId, solicitud.medicamentoId);
            if (!inventario || inventario.quantity < solicitud.quantity) {
                throw new AppError("Inventario insuficiente para entregar la solicitud", 400);
            }

            await inventarioRepository.update(inventario.id, {
                quantity: inventario.quantity - solicitud.quantity,
            });
        }

        return solicitudRepository.update(id, { status });
    },

    delete: async (id: number) => {
        const solicitud = await solicitudRepository.findById(id);
        if (!solicitud) throw new AppError("Solicitud no encontrada", 404);
        return solicitudRepository.delete(id);
    },
};
