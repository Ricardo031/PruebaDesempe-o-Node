import { z } from "zod";
import { UserRole } from "../models/user.model.js";

/**
 * @description Valida el cuerpo de la petición POST /register
 * - El usuario envía explícitamente el rol (ADMIN | GESTOR)
 * - Contraseña mínimo 6 caracteres (criterio básico)
 */
export const registerSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El email no tiene un formato válido"),
    password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    role: z.enum(Object.values(UserRole), { message: "El rol no es válido" }),
});

/**
 * @description Valida el cuerpo de la petición POST /login
 */
export const loginSchema = z.object({
    email: z.email("El email no tiene un formato válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;