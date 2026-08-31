import { z } from "zod";
import { SolicitudStatus } from "../models/solicitud.model.js";

export const solicitudSchema = z.object({
    clinicaId: z.number().int().positive("El ID de la clinica debe ser un numero positivo"),
    almacenId: z.number().int().positive("El ID del almacen debe ser un numero positivo"),
    medicamentoId: z.number().int().positive("El ID del medicamento debe ser un numero positivo"),
    quantity: z.number().int().positive("La cantidad debe ser mayor a cero"),
    status: z.nativeEnum(SolicitudStatus, {
        message: "El estado de la solicitud no es valido",
    }),
});

export const updateSolicitudStatusSchema = z.object({
    status: z.nativeEnum(SolicitudStatus, {
        message: "El estado de la solicitud no es valido",
    }),
});
