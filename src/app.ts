import express from "express";
import cors from "cors";
import clinicaRoutes from "./routes/clinica.routes.js";
import responsableRoutes from "./routes/responsable.routes.js";
import almacenRoutes from "./routes/almacen.routes.js";
import medicamentoRoutes from "./routes/medicamento.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import solicitudRoutes from "./routes/solicitud.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// here we are using the authRoutes
app.use("/api/auth", authRoutes);
app.use("/api/clinicas", clinicaRoutes);
app.use("/api/responsables", responsableRoutes);
app.use("/api/almacenes", almacenRoutes);
app.use("/api/medicamentos", medicamentoRoutes);
app.use("/api/inventarios", inventarioRoutes);
app.use("/api/solicitudes", solicitudRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

export default app;
