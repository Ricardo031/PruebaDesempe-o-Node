import "dotenv/config";
import app from "./app.js";
import { connectDB, sequelize } from "./config/db.js";
import "./models/index.js";

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};

start();

