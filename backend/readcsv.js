import mysql from 'mysql2';
import fs from 'fs';
import csv from 'csv-parser';
import { parse } from 'csv-parse/sync';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Conectado correctamente a la base de datos");
});

async function main() {
  // Leer CSV completo
  const raw = fs.readFileSync('data.csv', 'utf8');
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true
  });

  for (const row of rows) {
    try {
      const idUsuario = await getOrCreateUsuarioAsync(row["Nombre del ciente"], row["Número de Identificación"], row["Dirección"], row["Teléfono"], row["Correo Electrónico"]);
      const idTransacion  = await getOrCreateTransacionAsync(idUsuario, row["ID de la Transacción"],row["Fecha y Hora de la Transacción"], row["Monto de la Transacción"], row["Estado de la Transacción"], row["Tipo de Transacción"]);
      await insertFactura(idUsuario, idTransacion, row);

      console.log(`Factura insertada para usuario ${idUsuario} y transaccion ${idTransacion}`);
    } catch (e) {
      console.error("Error procesando fila:", e.message);
    }
  }

  console.log("Importación finalizada");
  connection.end();
}

main().catch(err => {
  console.error("Fallo general:", err);
});



function getOrCreateUsuario(nombre, idenficacion, direccion, telefono, email, callback) {
  const emailNorm = email.toString().trim().toLowerCase();
  const idenficacionNorm = idenficacion.trim()

  connection.query(
    "SELECT id_usuario FROM usuarios WHERE email = ? OR identificacion = ?",
    [emailNorm], [idenficacionNorm],
    (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        return callback(null, results[0].id_paciente);
      }


      connection.query(
        "INSERT INTO usuarios (nombre, email, identificacion, direccion, telefono) VALUES (?, ?, ?, ?, ?)",
        [nombre, emailNorm, idenficacionNorm,direccion,telefono],
        (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        }
      );
    }
  );
}

function getOrCreateTransacion(idUsuario, codigo_transaccion, fecha, cantidad, estado, tipo, callback) {
  connection.query(
    "SELECT id_transaccion FROM transacciones WHERE codigo_factura = ?",
    [codigo_transaccion],
    (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        return callback(null, results[0].id_medico);
      }

      connection.query(
        "INSERT INTO transacciones (id_usuario, codigo_transaccion, fecha, cantidad, estado, tipo) VALUES (?, ?, ?, ?, ?, ?)",
        [idUsuario, codigo_transaccion, fecha, cantidad, estado, tipo],
        (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        }
      );
    }
  );
}

// ===== Wrappers en promesas para usar con await =====
function getOrCreateUsuarioAsync(nombre, idenficacion, direccion, telefono, email) {
  return new Promise((resolve, reject) => {
    getOrCreateUsuario(nombre, idenficacion, direccion, telefono, email, (err, id) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
}

function getOrCreateTransacionAsync(idUsuario, codigo_transaccion, fecha, cantidad, estado, tipo) {
  return new Promise((resolve, reject) => {
    getOrCreateTransacion(idUsuario, codigo_transaccion, fecha, cantidad, estado, tipo, (err, id) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
}

function insertFactura(idPaciente, idMedico, row) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO citas
        (id_usuario, id_transaccion, plataforma, codigo_factura, periodo, monto_facturado, monto_pagado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPaciente,
        idMedico,
        row["Plataforma Utilizada"],
        row["Número de Factura"],
        row["Periodo de Facturación"],
        row["Monto Facturado"],
        row["Monto Pagado"],
      ],
      (err) => err ? reject(err) : resolve()
    );
  });
}