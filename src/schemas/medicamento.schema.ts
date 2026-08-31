import { z } from "zod";

export const medicamentoSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().optional(),
    unit: z.string().min(1, "La unidad es obligatoria"),
});

export const updateMedicamentoSchema = medicamentoSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
