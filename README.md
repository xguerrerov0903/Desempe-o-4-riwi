## 🇬🇧 English

Full‑stack app to manage for ExpertSoft (**facturas**)
Backend: **Node.js + Express + MySQL**. Frontend: **Vite SPA** (HTML + JS).

### 🧭 Structure
```
  DESEMPE-O-4-RIWI/
├─ pd_ximena_guerrero_lovelace.sql # SQL Script
├─ Diagramas.png # ERD
├─ Desempeño DDBB.postman_collection.json # Postman collection
├─ backend/              # REST API (Express)
│  ├─ app.js             # Routes & server
│  ├─ db.js              # MySQL connection (dotenv)
│  ├─ crud/              # CRUD controllers
│  ├─ data.csv           # the file CSV
│  ├─ readcsv.js         # CSV loader
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
DB_NAME=your DB
```

### 🗄️ Database 

You can find it in the file "pd_ximena_guerrero_lovelace.sql"

### 🚀 Getting started
**1) Clone the github**
```bash
git clone https://github.com/xguerrerov0903/Desempe-o-4-riwi.git
```
**2) Backend**
```bash
cd backend
npm install mysql2 fs csv-parser csv-parse express cors dotenv
node readcsv.js
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

### 🧾 Advanced queries sql
- http://localhost:3000/total-cliente
- http://localhost:3000/facturas-pendientes
- http://localhost:3000/lista-transacciones

Backend need to be online to test it


### 🛠️ Tech stack
- **Backend:** Node.js, Express 5, mysql2, dotenv, CORS
- **Frontend:** Vite, HTML/vanilla JS (simple SPA routing)

