import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { SolicitudStatus, type SolicitudCreationAttributes } from "../models/solicitud.model.js";
import { almacenRepository } from "../repositories/almacen.repository.js";
import { clinicRepository } from "../repositories/clinica.repository.js";
import { inventarioRepository } from "../repositories/inventario.repository.js";
import { medicamentoRepository } from "../repositories/medicamento.repository.js";
import { solicitudRepository } from "../repositories/solicitud.repository.js";
import { solicitudService } from "../services/solicitud.service.js";

describe("solicitudService.create", () => {
    const baseData: SolicitudCreationAttributes = {
        clinicaId: 1,
        almacenId: 2,
        medicamentoId: 3,
        quantity: 5,
        status: SolicitudStatus.PENDIENTE,
    };

    beforeEach(() => {
        // Restaura las implementaciones originales antes de cada test
        jest.restoreAllMocks();

        // Espía los métodos y define las respuestas por defecto
        jest.spyOn(clinicRepository, "findById").mockResolvedValue({ id: 1, isDeleted: false } as any);
        jest.spyOn(almacenRepository, "findById").mockResolvedValue({ id: 2, isDeleted: false } as any);
        jest.spyOn(medicamentoRepository, "findById").mockResolvedValue({ id: 3, isDeleted: false } as any);
        jest.spyOn(inventarioRepository, "findByAlmacenAndMedicamento").mockResolvedValue({ id: 10, quantity: 100 } as any);
        jest.spyOn(solicitudRepository, "create").mockResolvedValue({ id: 99, ...baseData } as any);
    });

    it("should create a solicitud when all validations pass", async () => {
        const result = await solicitudService.create(baseData);

        expect(clinicRepository.findById).toHaveBeenCalledWith(1);
        expect(almacenRepository.findById).toHaveBeenCalledWith(2);
        expect(medicamentoRepository.findById).toHaveBeenCalledWith(3);
        expect(inventarioRepository.findByAlmacenAndMedicamento).toHaveBeenCalledWith(2, 3);
        expect(solicitudRepository.create).toHaveBeenCalledWith(baseData);
        expect(result.id).toBe(99);
    });

    it("should throw AppError 400 when quantity is less than or equal to 0", async () => {
        await expect(solicitudService.create({ ...baseData, quantity: 0 })).rejects.toMatchObject({
            message: "La cantidad solicitada debe ser mayor a cero",
            statusCode: 400,
        });
        expect(solicitudRepository.create).not.toHaveBeenCalled();
    });

    it("should throw AppError 404 when clinica is not found", async () => {
        // Sobrescribe la respuesta solo para esta prueba
        jest.spyOn(clinicRepository, "findById").mockResolvedValue(null);

        await expect(solicitudService.create(baseData)).rejects.toMatchObject({
            message: "Clinica no encontrada",
            statusCode: 404,
        });
    });

    it("should throw AppError 400 when inventory is insufficient", async () => {
        jest.spyOn(inventarioRepository, "findByAlmacenAndMedicamento").mockResolvedValue({ id: 10, quantity: 2 } as any);

        await expect(solicitudService.create(baseData)).rejects.toMatchObject({
            message: "Inventario insuficiente para registrar la solicitud",
            statusCode: 400,
        });
    });

    it("should throw AppError 400 when status is not a valid SolicitudStatus", async () => {
        await expect(
            solicitudService.create({ ...baseData, status: "INVALID" as SolicitudStatus })
        ).rejects.toMatchObject({
            message: "Estado de solicitud no permitido",
            statusCode: 400,
        });
    });
});