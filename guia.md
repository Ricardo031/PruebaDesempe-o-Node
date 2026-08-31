# 🎯 Guía Rápida — Prueba de Desempeño Backend Node.js

Guía de referencia rápida durante el examen. Sigue el orden — es el mismo que usaste para construir el proyecto de práctica.

***

## 0. Checklist de arranque (primeros 5 minutos)

- [ ] Leer el enunciado completo ANTES de escribir código
- [ ] Identificar las entidades y sus campos
- [ ] Identificar las relaciones (1:N, N:M)
- [ ] Identificar qué endpoints requieren qué rol
- [ ] Identificar las reglas de negocio (no solo "campo obligatorio")
- [ ] Crear la base de datos en pgAdmin ANTES de escribir código

***

## 1. Setup del proyecto

```bash
mkdir nombre-proyecto
cd nombre-proyecto
git init
npm init -y
```

### Dependencias principales

```bash
npm install express sequelize pg pg-hstore jsonwebtoken bcrypt dotenv cors zod swagger-jsdoc swagger-ui-express
```

### Dependencias de desarrollo

```bash
npm install -D typescript tsx @types/node @types/express @types/jsonwebtoken @types/bcrypt @types/cors @types/swagger-jsdoc @types/swagger-ui-express
```

> ⚠️ **Si** **`typescript`** **instala la v7 y algo del entorno la rompe** (ts-node, etc.), fija una versión 5.x: `npm install -D typescript@^5.7.0`. Con **`tsx`** como runner esto normalmente no es un problema porque no depende de la API interna del compilador.

### `package.json` — agregar

```json
"type": "module",
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "seed": "tsx src/seeders/seed.ts"
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

> ⚠️ **Con ESM, todos los imports locales llevan extensión** **`.js`** aunque el archivo sea `.ts`: `import { sequelize } from "./config/db.js"`.

### Estructura de carpetas

```bash
mkdir -p src/config src/models src/repositories src/services src/controllers src/routes src/middlewares src/utils src/errors src/seeders src/schemas
```

### `.gitignore`

```
node_modules/
dist/
.env
```

***

## 2. `.env` y conexión a la base de datos

### `.env`

```env
PORT=3000
DB_NAME=mi_proyecto_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=genera_uno_con_el_comando_de_abajo
JWT_EXPIRES_IN=1d
```

Generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### `src/config/db.ts`

```typescript
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'mi_proyecto_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL exitosa');
    } catch (error) {
        console.error('Error conectando a la base de datos: ', error);
        process.exit(1);
    }
};
```

> 🔴 **ERROR CLÁSICO**: si te da `SASL: client password must be a string`, es casi siempre que `"dotenv/config"` se importó DESPUÉS de que algo ya usó `process.env`. **`import "dotenv/config"`** **debe ser el PRIMER import de** **`server.ts`**, antes que cualquier otro import (incluyendo `app.js`).

### `src/app.ts` (separado de server.ts)

```typescript
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
// import de rutas aquí

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use("/api/users", userRoutes);
// ...montar todas las rutas...

app.use(errorHandler); // SIEMPRE al final, después de las rutas

export default app;
```

### `src/server.ts`

```typescript
import "dotenv/config"; // SIEMPRE PRIMERO
import app from "./app.js";
import { sequelize, connectDB } from "./config/db.js";
import "./models/index.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};

startServer();
```

***

## 3. Modelos (patrón para cada entidad)

```typescript
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface EntityAttributes {
    id: number;
    campo: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EntityCreationAttributes extends Optional<EntityAttributes, "id"> {}

export class Entity extends Model<EntityAttributes, EntityCreationAttributes> implements EntityAttributes {
    declare id: number;
    declare campo: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Entity.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        campo: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, tableName: "entities", timestamps: true }
);
```

**Puntos críticos:**

- Usa `declare`, NUNCA `public campo!: tipo` — rompe el dirty-checking de Sequelize.
- `Optional<Attributes, "id" | "campoConDefault">` — todo lo que tenga `defaultValue` o sea nullable va en la lista de opcionales.
- FKs con formato camelCase (`userId`, no `UserId` ni `userID`).
- Fechas de comparación exacta (ej. "misma fecha") → `DataTypes.DATEONLY`, no `DataTypes.DATE`.

### `src/models/index.ts` — asociaciones centralizadas

```typescript
import { User } from "./user.model.js";
import { Workspace } from "./workspace.model.js";

User.hasMany(Workspace, { foreignKey: "userId", as: "workspaces" });
Workspace.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, Workspace };
```

> ⚠️ **SIEMPRE importa modelos desde** **`models/index.js`**, nunca directo del archivo individual — si no, las asociaciones podrían no estar registradas todavía.

***

## 4. Arquitectura por capas (el patrón que se repite por entidad)

**Regla de oro de cada capa:**

| Capa       | Responsabilidad                              | NO debe hacer                                        |
| ---------- | -------------------------------------------- | ---------------------------------------------------- |
| Repository | Queries crudas a Sequelize                   | Lanzar `AppError`, validar reglas de negocio         |
| Service    | Reglas de negocio, orquestar repos           | Hablar con `req`/`res`, hablar con Sequelize directo |
| Controller | Leer `req`, llamar service, responder        | Validaciones de negocio, queries                     |
| Routes     | Conectar endpoint + middlewares + controller | Lógica                                               |

### Repository

```typescript
import { Entity } from "../models/index.js";
import type { EntityCreationAttributes } from "../models/entity.model.js";

export const entityRepository = {
    findAll: async () => Entity.findAll(),
    findById: async (id: number) => Entity.findByPk(id),
    create: async (data: EntityCreationAttributes) => Entity.create(data),
    update: async (id: number, data: Partial<EntityCreationAttributes>) => {
        const item = await Entity.findByPk(id);
        if (!item) return null;
        return item.update(data);
    },
    delete: async (id: number) => {
        const item = await Entity.findByPk(id);
        if (!item) return null;
        await item.destroy();
        return true;
    },
};
```

### Service

```typescript
import { entityRepository } from "../repositories/entity.repository.js";
import { AppError } from "../errors/AppError.js";

export const entityService = {
    create: async (data) => {
        // reglas de negocio ANTES de crear
        return entityRepository.create(data);
    },
    getAll: async () => entityRepository.findAll(),
    getById: async (id: number) => {
        const item = await entityRepository.findById(id);
        if (!item) throw new AppError("No encontrado", 404);
        return item;
    },
    update: async (id: number, data) => {
        const existing = await entityRepository.findById(id);
        if (!existing) throw new AppError("No encontrado", 404);
        return entityRepository.update(id, data);
    },
    delete: async (id: number) => {
        const existing = await entityRepository.findById(id);
        if (!existing) throw new AppError("No encontrado", 404);
        return entityRepository.delete(id);
    },
};
```

### Controller

```typescript
import type { Request, Response, NextFunction } from "express";
import { entityService } from "../services/entity.service.js";

export const entityController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const item = await entityService.create(req.body);
            res.status(201).json(item);
        } catch (error) { next(error); }
    },
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(await entityService.getAll());
        } catch (error) { next(error); }
    },
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(await entityService.getById(Number(req.params.id)));
        } catch (error) { next(error); }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(await entityService.update(Number(req.params.id), req.body));
        } catch (error) { next(error); }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await entityService.delete(Number(req.params.id));
            res.status(200).json({ message: "Eliminado exitosamente" });
        } catch (error) { next(error); }
    },
};
```

> 🔴 **ERROR CLÁSICO**: `router.get("/id", ...)` (ruta literal) vs `router.get("/:id", ...)` (parámetro dinámico) — falta el `:` y la ruta nunca hace match con `/1`, `/2`, etc.

***

## 5. Manejo de errores centralizado

### `src/errors/AppError.ts`

```typescript
export class AppError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
```

### `src/middlewares/errorHandler.middleware.ts`

```typescript
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
};
```

**Códigos HTTP a usar:**

| Código | Cuándo                                                                                |
| ------ | ------------------------------------------------------------------------------------- |
| `400`  | Datos inválidos / regla de negocio violada (ej. capacidad ≤ 0, recurso no disponible) |
| `401`  | Sin token / token inválido / credenciales incorrectas                                 |
| `403`  | Autenticado pero sin permiso (rol incorrecto)                                         |
| `404`  | Recurso no encontrado                                                                 |
| `409`  | Conflicto (email duplicado, reserva duplicada)                                        |

***

## 6. Autenticación JWT

### `src/services/auth.service.ts`

```typescript
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../errors/AppError.js";

export const authService = {
    login: async ({ email, password }: { email: string; password: string }) => {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new AppError("Credenciales inválidas", 401);

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new AppError("Credenciales inválidas", 401);

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
        );

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    },
};
```

> ⚠️ Mensaje de error **idéntico** para "email no existe" y "password incorrecto" — evita filtrar qué emails están registrados (user enumeration).

### `src/middlewares/auth.middleware.ts`

```typescript
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export interface AuthRequest extends Request {
    user?: { id: number; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Token no proporcionado", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: string };
        next();
    } catch {
        throw new AppError("Token inválido", 401);
    }
};
```

> 🔴 **ERROR CLÁSICO**: escribir `export type { Request, ... } from 'express'` en vez de `import type { Request, ... } from 'express'`. Esto hace que TypeScript use el `Request` global del navegador (con `Headers` de Fetch API) en vez del de Express, y `req.headers.authorization` deja de existir como propiedad.

### `src/middlewares/authorize.middleware.ts`

```typescript
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import { AppError } from "../errors/AppError.js";

export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new AppError("No tienes permisos para realizar esta acción", 403);
        }
        next();
    };
};
```

Uso en rutas: `router.get("/", authenticate, authorize("ADMIN"), controller.getAll)` — **`authenticate`** **siempre antes que** **`authorize`**.

> 🔴 **Regla de seguridad clave para entidades relacionadas con el usuario autenticado** (ej. reservas, pedidos, etc.): el ID del "dueño" del recurso **siempre sale de** **`req.user.id`** **(del token)**, NUNCA de `req.body`. En el controller:
>
> ```typescript
> const data = { ...req.body, userId: req.user!.id }; // sobreescribe cualquier userId falso del body
> ```

***

## 7. Validación con Zod

### `src/middlewares/validate.middleware.ts`

```typescript
import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const message = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
            throw new AppError(`Datos inválidos: ${message}`, 400);
        }
        req.body = result.data;
        next();
    };
};
```

### Ejemplo de schema (Zod v4 — ojo con la sintaxis)

```typescript
import { z } from "zod";

export const createEntitySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.email("Email inválido"),        // v4: z.email(), NO z.string().email()
    role: z.enum(["ADMIN", "USER"], { error: "Rol inválido" }).optional(),
});

export const updateEntitySchema = createEntitySchema.partial();
```

Uso en rutas: `router.post("/", validate(createEntitySchema), controller.create)`.

***

## 8. Swagger

### `src/config/swagger.ts`

```typescript
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: { title: "Mi API", version: "1.0.0", description: "..." },
        servers: [{ url: "http://localhost:3000" }],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
```

### JSDoc por endpoint (encima de cada `router.metodo(...)`)

```typescript
/**
 * @openapi
 * /api/entities:
 *   post:
 *     summary: Crear entidad
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", authenticate, validate(createEntitySchema), controller.create);
```

Para rutas con `:id`, agrega:

```yaml
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la entidad
```

> 🔴 **ERROR CLÁSICO — YAML es sensible a indentación**: cada nivel anidado necesita **2 espacios más** que su padre, de forma consistente. `parameters` SIEMPRE es una lista (usa `-`), aunque tenga un solo elemento. Si ves `YAMLSemanticError: Map keys must be unique`, es 99% un problema de indentación inconsistente.

> ⚠️ Mantén el `security`/`403` del JSDoc coherente con los middlewares REALES de la línea de código — un evaluador prueba el endpoint directo, no solo lee el YAML.

***

## 9. Seeders

```typescript
import "dotenv/config";
import { sequelize } from "../config/db.js";
import { User, Workspace } from "../models/index.js";
import bcrypt from "bcrypt";

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // borra y recrea TODO — solo para seeding

        const adminPassword = await bcrypt.hash("123456", 10);
        await User.create({ name: "Admin", email: "admin@example.com", password: adminPassword, role: "ADMIN" });

        const userPassword = await bcrypt.hash("123456", 10);
        await User.create({ name: "User", email: "user@example.com", password: userPassword, role: "USER" });

        await Workspace.bulkCreate([
            { name: "Espacio 1", location: "Piso 1", capacity: 10 },
            { name: "Espacio 2", location: "Piso 2", capacity: 20 },
            { name: "Espacio 3", location: "Piso 3", capacity: 30 },
        ]);

        console.log("Seed completado");
        process.exit(0);
    } catch (error) {
        console.error("Error en el seed:", error);
        process.exit(1);
    }
};

seed();
```

Ejecutar: `npm run seed`

***

## 10. Reglas de negocio típicas — patrón de validación cruzada

Cuando una entidad depende de otras (ej. una reserva depende de usuario + espacio):

```typescript
create: async (data) => {
    // 1. Existencia de dependencias
    const user = await userRepository.findById(data.userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    const resource = await resourceRepository.findById(data.resourceId);
    if (!resource) throw new AppError("Recurso no encontrado", 404);

    // 2. Estado del recurso
    if (!resource.isAvailable) throw new AppError("El recurso no está disponible", 400);

    // 3. Duplicados / conflictos
    const existing = await entityRepository.findByResourceAndDate(data.resourceId, data.date);
    if (existing) throw new AppError("Ya existe un registro para ese recurso en esa fecha", 409);

    // 4. Crear
    return entityRepository.create(data);
},

update: async (id, data) => {
    const existing = await entityRepository.findById(id);
    if (!existing) throw new AppError("No encontrado", 404);

    // Valores finales tras el update (lo nuevo o lo que ya tenía)
    const resourceId = data.resourceId ?? existing.resourceId;
    const date = data.date ?? existing.date;

    // Solo re-valida si realmente está cambiando algo relevante
    if (data.resourceId !== undefined || data.date !== undefined) {
        const resource = await resourceRepository.findById(resourceId);
        if (!resource) throw new AppError("Recurso no encontrado", 404);
        if (!resource.isAvailable) throw new AppError("No disponible", 400);

        const conflict = await entityRepository.findByResourceAndDate(resourceId, date);
        // IMPORTANTE: excluir el propio registro de la búsqueda de conflicto
        if (conflict && conflict.id !== id) throw new AppError("Conflicto de duplicado", 409);
    }

    return entityRepository.update(id, data);
},
```

> ⚠️ Al buscar duplicados en un `update`, **siempre excluye el registro que estás editando** (`conflict.id !== id`), o el sistema pensará que siempre choca consigo mismo.

***

## 11. Orden de rutas en Express — cuidado con rutas específicas vs dinámicas

```typescript
// ✅ CORRECTO: rutas literales ANTES que rutas con parámetro
router.get("/my-resource", authenticate, controller.getMine);
router.get("/:id", authenticate, controller.getById);

// ❌ INCORRECTO: /:id captura "/my-resource" como si fuera un id
router.get("/:id", authenticate, controller.getById);
router.get("/my-resource", authenticate, controller.getMine); // nunca se alcanza
```

***

## 12. Probar en Postman/Bruno

1. Body → `raw` → `JSON`
2. Auth → pestaña `Authorization`/`Auth` → `Bearer Token` → pegar el token del login
3. Guarda el token en una variable de colección para no copiarlo cada vez

***

## 13. Git / GitFlow / Conventional Commits

```bash
git checkout -b develop
git checkout -b feature/authentication
# ... trabajo ...
git add .
git commit -m "feat: implement user authentication"
git checkout develop
git merge feature/authentication
```

**Formato de Conventional Commits:**

- `feat: create user model`
- `fix: validate duplicated reservations`
- `docs: add swagger documentation`
- `refactor: separate business logic into service layer`

***

## 14. Docker (opcional / puntos extra)

### `Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### `docker-compose.yml`

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
      - PORT=3000
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

> ⚠️ Dentro de Docker Compose, los contenedores se comunican por el **nombre del servicio**, no por `localhost` — por eso `DB_HOST=db` (nombre del servicio de Postgres), no `DB_HOST=localhost`.

Comandos:

```bash
docker compose up --build
docker compose exec api npm run seed
docker compose down          # mantiene los datos
docker compose down -v       # borra también los datos
```

***

## 15. Checklist final antes de entregar

- [ ] Todas las entidades: modelo → repository → service → controller → routes
- [ ] Todas las relaciones definidas en `models/index.ts`
- [ ] Login funcional, JWT con `id` + `role`
- [ ] `authenticate`/`authorize` aplicados según el enunciado (revisa CADA endpoint contra el enunciado, no asumas)
- [ ] Passwords siempre hasheados (create Y update)
- [ ] `userId`/dueño del recurso siempre desde el token, nunca del body
- [ ] Middleware de validación en POST/PUT de cada entidad
- [ ] Manejo de errores centralizado, sin `try/catch` sueltos sin `next(error)`
- [ ] Swagger accesible en `/api-docs`, código y documentación coinciden
- [ ] Seeder ejecuta sin errores
- [ ] README con instrucciones claras
- [ ] Commits con Conventional Commits, ramas con GitFlow

