export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "RiwiMediCare Plus API",
        version: "1.0.0",
    },
    servers: [{ url: "/" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    paths: {},
} as const;
