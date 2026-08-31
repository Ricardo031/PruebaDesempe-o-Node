import { z } from "zod";

/**
 * @description Esquema de creación de una clica
 * @param {string} name - Nombre de la clica
 * @param {string} nit - NIT de la clica
 * @param {string} address - Direccion de la clica
 * @param {string} phone - Telefono de la clica
 * */
export const clinicaSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    nit: z.string().min(1, "El NIT es obligatorio"),
    address: z.string().min(1, "La direccion es obligatoria"),
    phone: z.string().min(1, "El telefono es obligatorio"),
});

export const updateClinicaSchema = clinicaSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
