// backend/app.js
import express from 'express';
import cors from 'cors';
import { connection } from './db.js';
import {
  listFacturas
} from './CRUD/facturas_crud.js';

const app = express();

// Si usas Vite en 5173:
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_req, res) => res.send('API OK 👋'));


const PORT = 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));

app.get('/facturas', listFacturas);