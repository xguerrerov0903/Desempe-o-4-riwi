# Clínica RIWI — CRUD + Consultas (Node.js, MySQL, Vite)

## 🇪🇸 Español

Aplicación full‑stack para gestionar una clínica (**citas**, **pacientes**, **médicos** y **usuarios**), con consultas agregadas para reporting.  
Backend en **Node.js + Express + MySQL** y frontend **SPA** con **Vite** (HTML + JS). Este README está **alineado al script** `MySQLscript.sql` incluido en el proyecto.

---

### 🧭 Estructura
```
ddbb-clinica-riwi-main/
├─ backend/              # API REST (Express)
│  ├─ app.js             # Rutas y servidor
│  ├─ db.js              # Conexión MySQL (dotenv)
│  ├─ crud/              # Controladores CRUD
│  ├─ readcsv.js         # Carga desde CSV (opcional)
│  └─ MySQLscript.sql    # Esquema y datos/consultas de ejemplo
└─ frontend/             # SPA con Vite (HTML + JS)
   ├─ index.html         # Layout y navbar
   ├─ index.js           # Router simple (SPA)
   ├─ public/            # Vistas (citas, pacientes, etc.)
   └─ js/                # Lógica de vistas/CRUD
```

### ✅ Requisitos
- **Node.js 18+**
- **MySQL 8+**
- **npm**

### ⚙️ Variables de entorno (backend)
Crea `backend/.env` con:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=clinica
```
> Asegúrate de que `DB_NAME` coincida con el script (`clinica`).

### 🗄️ Base de datos (según `MySQLscript.sql`)
**Tablas principales**: `pacientes`, `medicos`, `citas`, `usuarios` con llaves foráneas en `citas` y `ENUM` para validación de negocio.  
**Notas importantes**:
- El script incluye **dos declaraciones de base de datos** y **dos versiones de la tabla de citas** (`CITA` y `citas`). **Usa la versión `citas`** y deja una sola creación de base de datos para evitar duplicados/conflictos.
- Las FKs en `citas` usan **`ON DELETE SET NULL`** (para permitir historial de citas aunque se elimine un paciente/médico), por eso `id_paciente` e `id_medico` están sin `NOT NULL`.
- Los campos `ENUM` restringen valores válidos:
  - `ubicacion`: `Sede Norte | Sede Centro | Sede Sur`
  - `metodo_pago`: `Efectivo | Transferencia | Tarjeta Crédito | Tarjeta Débito`
  - `estatus`: `Cancelada | Confirmada | Reprogramada | Pendiente`

**SQL de referencia (resumen)**:
```sql
CREATE DATABASE clinica;
USE clinica;

CREATE TABLE pacientes(
  id_paciente INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE medicos(
  id_medico INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100)
);

CREATE TABLE citas(
  id_cita INT PRIMARY KEY AUTO_INCREMENT,
  id_paciente INT,          -- FK, permite NULL por ON DELETE SET NULL
  id_medico INT,            -- FK, permite NULL por ON DELETE SET NULL
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200),
  ubicacion ENUM('Sede Norte','Sede Centro','Sede Sur'),
  metodo_pago ENUM('Efectivo','Transferencia','Tarjeta Crédito','Tarjeta Débito'),
  estatus ENUM('Cancelada','Confirmada','Reprogramada','Pendiente'),
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE SET NULL,
  FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE SET NULL
);

CREATE TABLE usuarios(
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  usuario VARCHAR(25) UNIQUE NOT NULL,
  contrasenia VARCHAR(25) NOT NULL
);
```

### 🔌 Endpoints principales (REST)
CRUD estándar (`application/json`):

- **Citas**: `GET /citas`, `GET /citas/:id`, `POST /citas`, `PATCH /citas/:id`, `DELETE /citas/:id`
- **Pacientes**: `GET /pacientes`, `GET /pacientes/:id`, `POST /pacientes`, `PATCH /pacientes/:id`, `DELETE /pacientes/:id`
- **Médicos**: `GET /medicos`, `GET /medicos/:id`, `POST /medicos`, `PATCH /medicos/:id`, `DELETE /medicos/:id`
- **Usuarios**: `GET /usuarios`, `GET /usuarios/:id`, `POST /usuarios`, `PATCH /usuarios/:id`, `DELETE /usuarios/:id`

### 🚀 Puesta en marcha
**1) Crear BD con el script**
```bash
# desde el directorio backend/ o raíz del proyecto
mysql -u root -p < MySQLscript.sql
```
**2) Backend**
```bash
cd backend
npm install
npm init -y
npm install mysql2 fs csv-parser csv-parse express cors dotenv
node app.js
# API en http://localhost:3000  (CORS permite http://localhost:5173 por defecto)
```
**3) Frontend**
```bash
cd frontend
npm install
npm init -y
npm run dev
# Vite en http://localhost:5173
```

### 🧪 Datos de ejemplo y consultas (del script)
- Inserción de citas de muestra (requiere IDs existentes de pacientes y médicos).  
- Consultas útiles predefinidas:
  - **Citas por médico en rango de fechas** (JOIN + BETWEEN + ORDER BY).
  - **Pacientes frecuentes** (COUNT + HAVING).
  - **Médicos con total de citas en el último mes** (DATE_SUB + CURDATE).
  - **Totales por método de pago** (GROUP BY).

> Puedes ejecutar directamente estas consultas desde tu cliente MySQL, o implementar endpoints `/consultas/*` en el backend para exponer estos reportes vía API.

### 🧾 Ejemplos de petición (JSON)
```jsonc
// POST /pacientes
{ "nombre": "Ana Pérez", "email": "ana@example.com" }

// POST /medicos
{ "nombre": "Dr. Ruiz", "especialidad": "Dermatología" }

// POST /usuarios
{ "usuario": "admin", "contrasenia": "1234" }

// POST /citas
{
  "id_paciente": 1,
  "id_medico": 1,
  "fecha": "2025-08-20",
  "hora": "09:00:00",
  "motivo": "Chequeo",
  "descripcion": "N/A",
  "ubicacion": "Sede Norte",
  "metodo_pago": "Efectivo",
  "estatus": "Confirmada"
}
```

### 🧩 Limpieza y reseteo de datos (con cuidado)
El script incluye bloques para borrar y truncar tablas. Úsalos conscientemente en entornos de desarrollo.
```sql
SET SQL_SAFE_UPDATES = 0;
DELETE FROM citas;
DELETE FROM pacientes;
DELETE FROM medicos;
TRUNCATE TABLE citas;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE pacientes;
TRUNCATE TABLE medicos;
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;
```
> `FOREIGN_KEY_CHECKS=0` permite truncar tablas con FKs, pero **no lo uses en producción** sin entender el impacto.

### 🔐 Autenticación (nota)
El **login** del frontend valida contra `/usuarios`, pero el backend **no** implementa hashing de contraseñas ni JWT (uso educativo). No utilizar en producción sin endurecer seguridad.

### 🛠️ Tecnologías
- **Backend:** Node.js, Express 5, mysql2, dotenv, CORS
- **Frontend:** Vite, HTML/JS vanilla (SPA con routing básico)

---

## 🇬🇧 English

Full‑stack app to manage a clinic (**appointments**, **patients**, **doctors**, **users**) plus reporting queries.  
Backend: **Node.js + Express + MySQL**. Frontend: **Vite SPA** (HTML + JS). This README is **aligned with** the provided `MySQLscript.sql`.

### 🧭 Structure
```
ddbb-clinica-riwi-main/
├─ backend/              # REST API (Express)
│  ├─ app.js             # Routes & server
│  ├─ db.js              # MySQL connection (dotenv)
│  ├─ crud/              # CRUD controllers
│  ├─ readcsv.js         # CSV loader (optional)
│  └─ MySQLscript.sql    # Schema + sample data/queries
└─ frontend/             # SPA with Vite (HTML + vanilla JS)
   ├─ index.html         # Layout & navbar
   ├─ index.js           # Simple SPA router
   ├─ public/            # Views
   └─ js/                # View/CRUD logic
```

### ✅ Requirements
- **Node.js 18+**
- **MySQL 8+**
- **npm**

### ⚙️ Environment variables (backend)
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=clinica
```

### 🗄️ Database (from `MySQLscript.sql`)
**Core tables**: `pacientes`, `medicos`, `citas`, `usuarios`.  
**Key points**:
- Script contains duplicate DB creation and two appointment tables (`CITA` and `citas`). **Use the `citas` version** and keep a single `CREATE DATABASE` block.
- `citas` uses **`ON DELETE SET NULL`** FKs so history is kept even if a patient/doctor is removed.
- Business rules enforced via `ENUM`:
  - `ubicacion`: `Sede Norte | Sede Centro | Sede Sur`
  - `metodo_pago`: `Efectivo | Transferencia | Tarjeta Crédito | Tarjeta Débito`
  - `estatus`: `Cancelada | Confirmada | Reprogramada | Pendiente`

**Reference SQL (summary)** — see the Spanish section above for the full snippet.

### 🔌 Main endpoints (REST)
Standard CRUD (`application/json`):
- **Appointments**: `GET /citas`, `GET /citas/:id`, `POST /citas`, `PATCH /citas/:id`, `DELETE /citas/:id`
- **Patients**: `GET /pacientes`, `GET /pacientes/:id`, `POST /pacientes`, `PATCH /pacientes/:id`, `DELETE /pacientes/:id`
- **Doctors**: `GET /medicos`, `GET /medicos/:id`, `POST /medicos`, `PATCH /medicos/:id`, `DELETE /medicos/:id`
- **Users**: `GET /usuarios`, `GET /usuarios/:id`, `POST /usuarios`, `PATCH /usuarios/:id`, `DELETE /usuarios/:id`

### 🚀 Getting started
**1) Create DB from script**
```bash
mysql -u root -p < MySQLscript.sql
```
**2) Backend**
```bash
cd backend
npm install
node app.js
# API at http://localhost:3000  (CORS allows http://localhost:5173 by default)
```
**3) Frontend**
```bash
cd frontend
npm install
npm run dev
# Vite at http://localhost:5173
```

### 🧪 Sample data & queries (from the script)
Predefined examples include:
- **Appointments by doctor within date range** (JOIN + BETWEEN + ORDER BY)
- **Frequent patients** (COUNT + HAVING)
- **Doctors with total appointments in the last month** (DATE_SUB + CURDATE)
- **Totals by payment method** (GROUP BY)

You can either run them in MySQL or expose them via `/consultas/*` endpoints.

### 🧾 Sample request bodies
(See Spanish section above.)

### 🧩 Data reset (use with care)
The script includes DELETE/TRUNCATE blocks and toggles `FOREIGN_KEY_CHECKS`. Avoid this in production without proper consideration.

### 🔐 Auth (note)
Frontend checks `/usuarios`, but the backend ships **no password hashing/JWT** (educational).

### 🛠️ Tech stack
- **Backend:** Node.js, Express 5, mysql2, dotenv, CORS
- **Frontend:** Vite, HTML/vanilla JS (simple SPA routing)

