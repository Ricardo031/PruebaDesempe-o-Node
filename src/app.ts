import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

export default app;
