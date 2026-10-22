# ms-padron

Microservicio del Padrón Electoral desarrollado con Node.js, Express y PostgreSQL 18.

## Requisitos previos

- Node.js (v18 o superior)
- PostgreSQL 18 (puerto 5436)

## Variables de Entorno

Crear un archivo `.env` basado en `.env.example`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5436
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=ms_padron
```

> Nota: Asegurarse de tener creada la base de datos `ms_padron` en PostgreSQL antes de iniciar:
> `CREATE DATABASE ms_padron;`

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

## Endpoint de Verificación

- `GET http://localhost:3001/salud`
  - Retorna el estado del microservicio y la conectividad con PostgreSQL.

## Estructura de Tablas Creadas

- `facultades`
- `carreras`
- `elecciones`
- `electores`
- `candidatos`
