import { AppError } from "../errors/AppError.js";
import { SolicitudStatus, type SolicitudCreationAttributes } from "../models/solicitud.model.js";

jest.mock("../repositories/clinica.repository.js");
jest.mock("../repositories/almacen.repository.js");
jest.mock("../repositories/medicamento.repository.js");
jest.mock("../repositories/inventario.repository.js");
jest.mock("../repositories/solicitud.repository.js");

import { almacenRepository } from "../repositories/almacen.repository.js";
import { clinicRepository } from "../repositories/clinica.repository.js";
import { inventarioRepository } from "../repositories/inventario.repository.js";
import { medicamentoRepository } from "../repositories/medicamento.repository.js";
import { solicitudRepository } from "../repositories/solicitud.repository.js";
import { solicitudService } from "../services/solicitud.service.js";

const mockedClinicaRepo = jest.mocked(clinicRepository);
const mockedAlmacenRepo = jest.mocked(almacenRepository);
const mockedMedicamentoRepo = jest.mocked(medicamentoRepository);
const mockedInventarioRepo = jest.mocked(inventarioRepository);
const mockedSolicitudRepo = jest.mocked(solicitudRepository);

describe("solicitudService.create", () => {
    const baseData: SolicitudCreationAttributes = {
        clinicaId: 1,
        almacenId: 2,
        medicamentoId: 3,
        quantity: 5,
        status: SolicitudStatus.PENDIENTE,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedClinicaRepo.findById.mockResolvedValue({ id: 1, isDeleted: false } as any);
        mockedAlmacenRepo.findById.mockResolvedValue({ id: 2, isDeleted: false } as any);
        mockedMedicamentoRepo.findById.mockResolvedValue({ id: 3, isDeleted: false } as any);
        mockedInventarioRepo.findByAlmacenAndMedicamento.mockResolvedValue({ id: 10, quantity: 100 } as any);
        mockedSolicitudRepo.create.mockResolvedValue({ id: 99, ...baseData } as any);
    });

    it("should create a solicitud when all validations pass", async () => {
        const result = await solicitudService.create(baseData);

        expect(mockedClinicaRepo.findById).toHaveBeenCalledWith(1);
        expect(mockedAlmacenRepo.findById).toHaveBeenCalledWith(2);
        expect(mockedMedicamentoRepo.findById).toHaveBeenCalledWith(3);
        expect(mockedInventarioRepo.findByAlmacenAndMedicamento).toHaveBeenCalledWith(2, 3);
        expect(mockedSolicitudRepo.create).toHaveBeenCalledWith(baseData);
        expect(result.id).toBe(99);
    });

    it("should throw AppError 400 when quantity is less than or equal to 0", async () => {
        await expect(solicitudService.create({ ...baseData, quantity: 0 })).rejects.toMatchObject({
            message: "La cantidad solicitada debe ser mayor a cero",
            statusCode: 400,
        });
        expect(mockedSolicitudRepo.create).not.toHaveBeenCalled();
    });

    it("should throw AppError 404 when clinica is not found", async () => {
        mockedClinicaRepo.findById.mockResolvedValue(null);

        await expect(solicitudService.create(baseData)).rejects.toMatchObject({
            message: "Clinica no encontrada",
            statusCode: 404,
        });
    });

    it("should throw AppError 400 when inventory is insufficient", async () => {
        mockedInventarioRepo.findByAlmacenAndMedicamento.mockResolvedValue({ id: 10, quantity: 2 } as any);

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
