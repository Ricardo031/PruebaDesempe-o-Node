import { Sequelize } from "sequelize"

export const sequelize = new Sequelize({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "PruebadesempenoNode",
    dialect: "postgres",
    logging: false,
})

export const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Error connecting to the database:", error)
        process.exit(1)
    }
}