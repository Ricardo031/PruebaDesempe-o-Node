import { z } from "zod";

export const responsableSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El email no tiene un formato valido"),
    phone: z.string().min(1, "El telefono es obligatorio"),
    clinicaId: z.number().int().positive("El ID de la clinica debe ser un numero positivo"),
});

export const updateResponsableSchema = responsableSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
