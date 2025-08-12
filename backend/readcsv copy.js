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
      const idTransacion  = await getOrCreateMedicoAsync(idUsuario, row);
      await insertFactura(idPaciente, idMedico, row);

      console.log(`Cita insertada para paciente ${idPaciente} y médico ${idMedico}`);
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

// -------- helpers (sin modificar tus rows; email sí se normaliza aquí) --------

function getOrCreateUsuario(nombre, idenficacion, direccion, telefono, email, callback) {
  const emailNorm = email.toString().trim().toLowerCase();
  const idenficacionNorm = idenficacion.trim()

  connection.query(
    "SELECT id_usuario FROM pacientes WHERE email = ? OR identificacion = ?",
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

function getOrCreateMedico(nombre, especialidad, callback) {
  connection.query(
    "SELECT id_medico FROM medicos WHERE nombre = ? AND especialidad = ?",
    [nombre, especialidad],
    (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        return callback(null, results[0].id_medico);
      }

      connection.query(
        "INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)",
        [nombre, especialidad],
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

function getOrCreateMedicoAsync(nombre, especialidad) {
  return new Promise((resolve, reject) => {
    getOrCreateMedico(nombre, especialidad, (err, id) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
}

function insertCitaAsync(idPaciente, idMedico, row) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO citas
        (id_paciente, id_medico, fecha, hora, motivo, descripcion, ubicacion, metodo_pago, estatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPaciente,
        idMedico,
        row["Fecha Cita"],
        row["Hora Cita"],
        row["Motivo"],
        row["Descripción"],
        row["Ubicación"],
        row["Método de Pago"],
        row["Estatus Cita"],
      ],
      (err) => err ? reject(err) : resolve()
    );
  });
}