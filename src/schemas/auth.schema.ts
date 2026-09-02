import { z } from "zod";
import { UserRole } from "../models/user.model.js";

/**
 * @description Validate the register request body schema
 * - User explicitly sends the role (ADMIN | GESTOR)
 * - Password minimum 6 characters (basic criterion)
 */
export const registerSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El email no tiene un formato válido"),
    password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    role: z.enum(Object.values(UserRole), { message: "El rol no es válido" }),
});

/**
 * @description Validate the login request body schema
 */
export const loginSchema = z.object({
    email: z.string().email("El email no tiene un formato válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;