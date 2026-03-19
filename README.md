# Altairis Backoffice

Backoffice operativo para la gestión hotelera B2B de Viajes Altairis. Permite gestionar hoteles, tipos de habitación, disponibilidad e inventario, y reservas, con un dashboard de métricas en tiempo real.

## Tecnologías

- **Backend**: Java 21 + Spring Boot 3.5.11 + Spring Data JPA
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Base de datos**: PostgreSQL 16
- **Tests backend**: JUnit 5 + Mockito
- **Tests frontend**: Jest + Testing Library
- **Infraestructura**: Docker + Docker Compose

## Requisitos previos

- Docker Desktop instalado y corriendo
- Puertos 3000, 8080 y 5432 libres

## Levantar el proyecto

Clona el repositorio y ejecuta un único comando:

```bash
git clone https://github.com/GuilleAlvareez/backofficeAltairis.git
cd backofficeAltairis
docker-compose up -d --build
```

En unos minutos los 3 servicios estarán corriendo:

| Servicio   | URL                       |
| ---------- | ------------------------- |
| Frontend   | http://localhost:3000     |
| Backend    | http://localhost:8080/api |
| PostgreSQL | localhost:5432            |

> La base de datos se inicializa automáticamente con datos de ejemplo al arrancar por primera vez.

## Parar el proyecto

```bash
docker-compose down
```

Para parar y eliminar los datos:

```bash
docker-compose down -v
```

## Estructura del proyecto

```
altairis/
├── backend/                  ← API REST Spring Boot
│   ├── src/main/java/com/altairis/backoffice/
│   │   ├── controller/       ← Endpoints REST
│   │   ├── service/          ← Lógica de negocio
│   │   ├── repository/       ← Acceso a datos
│   │   ├── model/            ← Entidades JPA
│   │   └── config/           ← Configuración CORS
│   └── src/test/             ← Tests JUnit + Mockito
├── frontend/                 ← Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── availability/ ← Página de disponibilidad
│   │   │   ├── hotels/       ← Página de hoteles
│   │   │   ├── reservations/ ← Página de reservas
│   │   │   ├── room-types/   ← Página de habitaciones
│   │   │   ├── layout.tsx    ← Layout principal
│   │   │   └── page.tsx      ← Dashboard
│   │   ├── components/
│   │   │   ├── layout/       ← Sidebar y Header
│   │   │   └── ui/           ← Componentes reutilizables
│   │   ├── hooks/            ← Hooks de validación
│   │   └── services/         ← Llamadas API al backend
│   └── __tests__/
│       └── hooks/            ← Tests Jest
├── db/
│   └── init.sql              ← Esquema y datos de ejemplo
└── docker-compose.yml
```

## Endpoints API

| Método | Endpoint                          | Descripción                       |
| ------ | --------------------------------- | --------------------------------- |
| GET    | /api/hotels                       | Listar hoteles                    |
| POST   | /api/hotels                       | Crear hotel                       |
| PUT    | /api/hotels/{id}                  | Actualizar hotel                  |
| DELETE | /api/hotels/{id}                  | Eliminar hotel                    |
| GET    | /api/room-types                   | Listar habitaciones               |
| POST   | /api/room-types?hotelId={id}      | Crear habitación                  |
| PUT    | /api/room-types/{id}              | Actualizar habitación             |
| DELETE | /api/room-types/{id}              | Eliminar habitación               |
| GET    | /api/availability/hotel/{id}      | Disponibilidad por hotel y fechas |
| POST   | /api/availability?roomTypeId={id} | Crear/actualizar disponibilidad   |
| GET    | /api/reservations                 | Listar reservas                   |
| POST   | /api/reservations?roomTypeId={id} | Crear reserva                     |
| PATCH  | /api/reservations/{id}/status     | Cambiar estado                    |
| DELETE | /api/reservations/{id}            | Eliminar reserva                  |
| GET    | /api/reservations/dashboard       | Métricas del dashboard            |

## Ejecutar tests

**Backend:**

```bash
cd backend
./mvnw test
```

**Frontend:**

```bash
cd frontend
npx jest
```

## Datos de ejemplo

La base de datos incluye datos precargados:

- **8 hoteles** de lujo en 6 países (España, Italia, Emiratos, Maldivas, Reino Unido)
- **18 tipos de habitación** con precios reales
- **Disponibilidad** para los próximos 30 días
- **18 reservas** en los 4 estados posibles (confirmada, pendiente, completada, cancelada)
