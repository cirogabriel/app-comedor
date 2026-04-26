# Comedor Universitario

App-Comedor es una simulación del comedor público universitario que permite registrar y consultar los datos de los alumnos, el sistema de pagos y las asistencias.

🌐 **[Ver demo en vivo](https://theplatepal.netlify.app/)**

---

## Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 18, Vite, Tailwind CSS v4, Formik, ECharts, Lucide React |
| Backend | Node.js, Express, Passport.js, JWT, bcrypt |
| Base de datos | PostgreSQL 13+, Prisma ORM |
| Seguridad | Google reCAPTCHA v2, JWT |
| Infra | Docker, Docker Compose |

---

## Funcionalidades

**Estudiante**
- Reserva y cancelación de cupo diario
- Verificación con Google reCAPTCHA
- Notificaciones de estado (confirmado, sin cupos, sin servicio)

**Administrador**
- Dashboard con estadísticas del día y gráfico donut
- Gestión de días de servicio — crear, editar, eliminar
- Auto-programación semanal de días
- Historial de reservas con calendario mensual
- Búsqueda y filtrado de reservas y estudiantes
- Modo oscuro / claro

---

## Instalación

### 1. Clonar

```bash
git clone https://github.com/cirogabriel/app-comedor.git
cd app-comedor
```

### 2. Servidor

```bash
cd server
npm install
```

Crear `server/.env`:

```env
PORT=3000
NODE_ENV=dev
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_NAME=comedor_db
DB_PORT=5432
DATABASE_URL="postgresql://tu_usuario:tu_contraseña@localhost:5432/comedor_db"
JWT_SECRET=tu_jwt_secret
RECAPTCHA_SECRET_KEY=tu_recaptcha_secret
```

```bash
npx prisma migrate dev --name init
npx prisma generate
node scripts/seed.js
node scripts/createAdmin.js admin@unsaac.edu.pe 134403
```

### 3. Cliente

```bash
cd ../client
npm install
```

Crear `client/.env`:

```env
VITE_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
```

---

## Ejecución

```bash
# Servidor
cd server && npm run dev

# Cliente (nueva terminal)
cd client && npm run dev
```

O con Docker:

```bash
docker-compose up
```

---

## Datos de prueba

| Rol | Campo | Valor |
|-----|-------|-------|
| Estudiante | Código | `134401` |
| Estudiante | Contraseña | `241101` |
| Admin | Email | `admin@unsaac.edu.pe` |
| Admin | Contraseña | `134403` |

---

## Estructura

```
app-comedor/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── lib/
│       ├── pages/
│       └── styles/
└── server/
    ├── config/
    ├── middleware/
    ├── routes/
    ├── schema/
    ├── services/
    ├── scripts/
    └── prisma/
```

---

## Licencia

MIT © [cirogabriel](https://github.com/cirogabriel)