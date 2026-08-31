import "dotenv/config";
import bcrypt from "bcrypt";
import { connectDB, sequelize } from "../config/db.js";
import {
    Almacen,
    Clinica,
    Inventario,
    Medicamento,
    Responsable,
    Solicitud,
    User,
} from "../models/index.js";
import { SolicitudStatus } from "../models/solicitud.model.js";
import { UserRole } from "../models/user.model.js";

const run = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });

    await Solicitud.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Inventario.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Responsable.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Clinica.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Medicamento.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Almacen.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });

    const password = await bcrypt.hash("123456", 10);

    await User.bulkCreate([
        {
            id: 1,
            name: "Admin Principal",
            email: "admin@test.com",
            password,
            role: UserRole.ADMIN,
        },
        {
            id: 2,
            name: "Gestor Principal",
            email: "gestor@test.com",
            password,
            role: UserRole.GESTOR,
        },
    ]);

    await Clinica.bulkCreate([
        {
            id: 1,
            name: "Clinica Central",
            nit: "900100001",
            address: "Calle 10 # 20-30",
            phone: "3001002000",
            isDeleted: false,
        },
        {
            id: 2,
            name: "Clinica Norte",
            nit: "900100002",
            address: "Carrera 15 # 40-50",
            phone: "3002003000",
            isDeleted: false,
        },
    ]);

    await Responsable.bulkCreate([
        {
            id: 1,
            name: "Laura Martinez",
            email: "laura@clinica.com",
            phone: "3011111111",
            clinicaId: 1,
            isDeleted: false,
        },
        {
            id: 2,
            name: "Carlos Perez",
            email: "carlos@clinica.com",
            phone: "3022222222",
            clinicaId: 2,
            isDeleted: false,
        },
    ]);

    await Almacen.bulkCreate([
        {
            id: 1,
            name: "Almacen Centro",
            location: "Bogota",
            isDeleted: false,
        },
        {
            id: 2,
            name: "Almacen Norte",
            location: "Medellin",
            isDeleted: false,
        },
    ]);

    await Medicamento.bulkCreate([
        {
            id: 1,
            name: "Acetaminofen",
            description: "Tabletas 500mg",
            unit: "caja",
            isDeleted: false,
        },
        {
            id: 2,
            name: "Ibuprofeno",
            description: "Tabletas 400mg",
            unit: "caja",
            isDeleted: false,
        },
    ]);

    await Inventario.bulkCreate([
        {
            id: 1,
            almacenId: 1,
            medicamentoId: 1,
            quantity: 120,
        },
        {
            id: 2,
            almacenId: 1,
            medicamentoId: 2,
            quantity: 80,
        },
        {
            id: 3,
            almacenId: 2,
            medicamentoId: 1,
            quantity: 60,
        },
    ]);

    await Solicitud.bulkCreate([
        {
            id: 1,
            clinicaId: 1,
            almacenId: 1,
            medicamentoId: 1,
            quantity: 10,
            status: SolicitudStatus.PENDIENTE,
            isDeleted: false,
        },
        {
            id: 2,
            clinicaId: 2,
            almacenId: 1,
            medicamentoId: 2,
            quantity: 5,
            status: SolicitudStatus.APROBADA,
            isDeleted: false,
        },
    ]);

    console.log("Seed ejecutado correctamente");
    console.log("Credenciales admin:", { email: "admin@test.com", password: "123456" });
    console.log("Credenciales gestor:", { email: "gestor@test.com", password: "123456" });
    process.exit(0);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
