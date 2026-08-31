import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Workspace Reservations API",
            version: "1.0.0",
            description: "API REST para gestión de reservas de espacios de trabajo",
        },
        servers: [
            { url: "http://localhost:3000", description: "Servidor local" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"], // dónde busca los comentarios JSDoc
};

export const swaggerSpec = swaggerJSDoc(options);
