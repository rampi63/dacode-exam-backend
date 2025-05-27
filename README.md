## DaCode Exam – Backend

Este es el backend del proyecto técnico **DaCode Exam**, construido con **NestJS**, **GraphQL**, **JWT**, y **PostgreSQL**. Desplegado en **Railway**.

## 🚀 Tecnologías

- NestJS + GraphQL (Code First)
- JWT con refresh tokens
- PostgreSQL con TypeORM
- Autenticación basada en cookies seguras (HttpOnly)
- Desplegado en Railway

## 📂 Estructura principal

src/
├── auth/ // Login, registro, guards, JWT
├── users/ // Entidad de usuario
├── tasks/ // CRUD completo de tareas
├── main.ts // Bootstrap de la app
└── app.module.ts // Módulo raíz

---

## 🔐 Variables de entorno

Crea un archivo `.env` basado en el siguiente ejemplo:

```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:3000
DB_URL=url_db
DB_HOST=host_db
DB_PORT=port_db
DB_USERNAME=username_db
DB_PASSWORD=password_db
DB_NAME=db_name
JWT_SECRET=token_jwt_secret
JWT_REFRESH_SECRET=token_jwt_refresh_secret

```

## 🧪 Pruebas unitarias

El backend incluye pruebas unitarias con jest para:

AuthResolver

TasksService

TasksResolver (mockeando guards)

npm run test

## Desarrollo

npm run start:dev

## Compilar y ejecutar en producción

npm run build && npm run start

## ✅ Endpoints clave

POST /graphql — Interfaz de GraphQL

Cookies: accessToken, refreshToken manejados vía HttpOnly