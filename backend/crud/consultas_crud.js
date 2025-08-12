import { connection } from "../db.js";

export async function totalCliente(_req, res) {
  const [rows] = await connection.execute(
    `SELECT u.nombre, SUM(f.monto_pagado)
FROM usuarios u
JOIN facturas f ON u.id_usuario = f.id_usuario
GROUP BY u.id_usuario`
  );
  res.json(rows || []);
}

export async function facturasPendientes(_req, res) {
  const [rows] = await connection.execute(
    `SELECT f.codigo_factura, 
monto_facturado-monto_pagado as Monto_pendiente
FROM facturas f
WHERE monto_facturado-monto_pagado > 0
ORDER BY monto_facturado-monto_pagado`
  );
  res.json(rows || []);
}

export async function listaTransacciones(_req, res) {
  const [rows] = await connection.execute(
    `SELECT t.codigo_transaccion, f.plataforma, u.nombre, f.codigo_factura
FROM facturas f
JOIN transacciones t ON f.id_transaccion = t.id_transaccion
JOIN usuarios u ON u.id_usuario = f.id_usuario` 
  );
  res.json(rows || []);
}

