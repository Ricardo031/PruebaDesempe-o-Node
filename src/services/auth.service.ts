import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../errors/AppError.js";
import type { UserCreationAttributes } from "../models/user.model.js";

interface LoginData {
    email: string;
    password: string;
}

const HASH_ROUNDS = 10;

//Add block comment above login method describing the authentication process steps
export const authService = {
    // the login method will manager the login process
    async login(data: LoginData) {
        //% 1. find user by email (userRepository.findByEmail)
        const user = await userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError("Email o contraseña inválidos", 401);
        }

        //% 2. compare password (bcrypt.compare)
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Contraseña inválida", 401);
        }

        //% 3. generate token (jsonwebtoken.sign)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
        );

        //% 4. return token and user info
        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    },

    async register(data: UserCreationAttributes) {
        //% 1. check if user already exists (userRepository.findByEmail)
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError("Ya existe un usuario con este email", 409);
        }

        //% 2. hash password (bcrypt.hash)
        const hashedPassword = await bcrypt.hash(data.password, HASH_ROUNDS);
        const user = await userRepository.create({ ...data, password: hashedPassword });

        //% 3. generate token (jsonwebtoken.sign)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
        );
        //% 4. return token and user info
        return {
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        };
    },
};