import { z } from "zod";

export const almacenSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    location: z.string().min(1, "La ubicacion es obligatoria"),
});

export const updateAlmacenSchema = almacenSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
