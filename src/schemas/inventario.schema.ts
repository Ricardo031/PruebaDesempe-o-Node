import { z } from "zod";

export const inventarioSchema = z.object({
    almacenId: z.number().int().positive("El ID del almacen debe ser un numero positivo"),
    medicamentoId: z.number().int().positive("El ID del medicamento debe ser un numero positivo"),
    quantity: z.number().int().positive("La cantidad debe ser mayor a cero"),
});

export const updateInventarioSchema = inventarioSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
