# Performance Test — Module 5.2 Node.js

This is a REST API for **RiwiMediCare Plus**, a company that distributes medicines and medical supplies. The system manages the full lifecycle of supply requests made by clinics and healthcare centers. Before, requests were handled by email and spreadsheets, which caused lost information, inventory errors, and no real control over the status of each request. This project solves that with a centralized platform with inventory control.

## Coder Info

- **Name:** Ricardo José Torres Bermúdez
- **Clan:** Node.js

## Technologies used

- **Node.js** (v18+)
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Sequelize** (ORM)
- **JSON Web Token (JWT)** — authentication and route protection
- **bcrypt** — password hashing
- **Zod** — input data validation
- **Multer** — upload JSON files to seed the database
- **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) — API documentation
- **tsx** — run TypeScript in development
- **Docker + Docker Compose** — containerize the API and the database
- **Jest** — unit tests

## Data model

| Entity        | Description                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `User`        | System users, with role `ADMIN` or `GESTOR`                                                          |
| `Clinica`     | Registered clinics, identified by a unique NIT                                                       |
| `Responsable` | Person(s) in charge of a clinic (1:N relation with `Clinica`)                                        |
| `Almacen`     | Warehouses where the medicine inventory is stored                                                    |
| `Medicamento` | Catalog of available medicines                                                                       |
| `Inventario`  | Available quantity of each medicine per warehouse (N:M relation between `Almacen` and `Medicamento`) |
| `Solicitud`   | Supply request made by a clinic, with a status and full traceability                                 |

### `Solicitud` status flow

`PENDIENTE` → `APROBADA` → `ENTREGADA`, or `PENDIENTE` → `RECHAZADA`

### Logical deletion

`Clinica`, `Responsable`, `Almacen`, `Medicamento` and `Solicitud` use **soft delete** with the `isDeleted` field, instead of deleting the records from the database.

## Roles and permissions

| Role     | Permissions                                                             |
| -------- | ----------------------------------------------------------------------- |
| `ADMIN`  | Full CRUD for Clinics, Warehouses, Medicines and Requests               |
| `GESTOR` | Create requests, update their status, check active requests and history |

Both roles, once logged in, can check active requests and the request history by clinic. User registration (`POST /api/auth/register`) is the only endpoint that does **not** need a JWT.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ricardo031/PruebaDesempe-o-Node.git
   cd PruebaDesempe-o-Node
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create the database in PostgreSQL (for example with pgAdmin or `psql`):

   ```sql
   CREATE DATABASE prueba_desempeno_node;
   ```

4. Create a `.env` file in the root folder (see the example below).

## Environment variables

Create a `.env` file in the root folder with this example content:

```env
PORT=3000

DB_NAME=prueba_desempeno_node
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=a_long_and_random_secret
JWT_EXPIRES_IN=1d
```

> ⚠️ This project uses **PostgreSQL**, not MySQL — make sure you have a PostgreSQL server running locally or with Docker (see the Docker section below).

## Running the project

Development mode (with auto reload):

```bash
npm run dev
```

The server will run at `http://localhost:3000`.

To build and run in production mode:

```bash
npm run build
npm start
```

## API documentation (Swagger)

With the server running, open the interactive documentation at:

```
http://localhost:3000/api-docs
```

You can test every endpoint from there, including the protected ones (use the **Authorize** button and paste the token you get from login).

## Load test data (Seeder using an endpoint)

Instead of a normal seed script, this project has a **protected endpoint** that receives a JSON file (using `multer`) and loads it into the database.

1. Start the server (`npm run dev`)
2. Log in as `ADMIN` at `POST /api/auth/login` to get a token
3. Send the JSON file to the seeder endpoint, for example with `curl`:
   ```bash
   curl -X POST http://localhost:3000/api/seed \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -F "file=@./seed-data.json"
   ```
   Or from Swagger UI directly, in the seeder section, attaching the file.

The JSON file must include the base data: users, clinics (with their responsables), warehouses, medicines, and initial inventory. An example file (`seed-data.example.json`) is included in the root of the repo as a reference for the expected structure.

## Main endpoints

| Method                | Route                                 | Required role | Description                           |
| --------------------- | ------------------------------------- | ------------- | ------------------------------------- |
| `POST`                | `/api/auth/register`                  | Public        | Register a new user (ADMIN or GESTOR) |
| `POST`                | `/api/auth/login`                     | Public        | Login, returns a JWT                  |
| `POST`                | `/api/seed`                           | ADMIN         | Load base data from a JSON file       |
| `GET/POST/PUT/DELETE` | `/api/clinicas`                       | ADMIN         | Clinic CRUD                           |
| `GET/POST/PUT/DELETE` | `/api/responsables`                   | ADMIN         | Responsable CRUD                      |
| `GET/POST/PUT/DELETE` | `/api/almacenes`                      | ADMIN         | Warehouse CRUD                        |
| `GET/POST/PUT/DELETE` | `/api/medicamentos`                   | ADMIN         | Medicine CRUD                         |
| `POST`                | `/api/solicitudes`                    | ADMIN, GESTOR | Create a supply request               |
| `PATCH`               | `/api/solicitudes/:id/estado`         | ADMIN, GESTOR | Update a request status               |
| `GET`                 | `/api/solicitudes`                    | ADMIN, GESTOR | Check active requests                 |
| `GET`                 | `/api/solicitudes/clinica/:clinicaId` | ADMIN, GESTOR | Request history by clinic             |

> Full documentation of parameters, request bodies and responses is available in Swagger (`/api-docs`).

## Docker

### Build and run with Docker Compose

```bash
docker compose up --build
```

This starts two containers:

- **`api`**: the Node.js/Express app
- **`db`**: PostgreSQL, with a persistent volume for the data

Both services talk to each other through the internal network created by Docker Compose (the API connects to the database using the service name `db` as the host, not `localhost`).

### Run the seeder inside the container

```bash
docker compose exec api curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@./seed-data.json"
```

### Stop the containers

```bash
docker compose down        # keeps the database data
docker compose down -v     # also removes the data volume
```

## Unit tests (Jest)

Run the test suite:

```bash
npm test
```

Run with coverage report:

```bash
npm test -- --coverage
```

Unit tests were added for the critical business logic of the requests module (creating a request, checking inventory, and changing status), with coverage above the required 40%.

## Database backup

The `.sql` backup of the database with the test data is included in the delivery, in the root folder (`backup.sql`).

## Project structure

```
src/
├── config/         # Sequelize and Swagger configuration
├── models/         # Sequelize models and their associations
├── repositories/    # Data access (Sequelize)
├── services/        # Business logic
├── controllers/      # Request/response handling
├── routes/          # Endpoint definitions
├── middlewares/      # Authentication, authorization, validation, error handling
├── schemas/          # Validation schemas (Zod)
├── errors/           # Custom error classes
├── seeders/           # Logic for the multer JSON upload endpoint
├── app.ts
└── server.ts
```

## Repository

🔗 https://github.com/Ricardo031/PruebaDesempe-o-Node

> The repository is public, as required by the test statement.
