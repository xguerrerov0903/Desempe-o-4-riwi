import { connection } from '../db.js';

export async function listFacturas(_req, res) {
  const [rows] = await connection.execute('SELECT * FROM facturas');
  res.json(rows); 
}

export async function getFactura(req, res) {
  const [rows] = await connection.execute(
    'SELECT * FROM facturas WHERE id_factura = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

export async function createFactura(req, res) {
  const { id_usuario, id_transaccion, plataforma, codigo_factura, periodo, monto_facturado, monto_pagado } = req.body;

  const [r] = await connection.execute(
    `INSERT INTO facturas (id_usuario, id_transaccion, plataforma, codigo_factura, periodo, monto_facturado, monto_pagado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, id_transaccion, plataforma, codigo_factura, periodo, monto_facturado, monto_pagado]
  );

  const [rows] = await connection.execute(
    'SELECT * FROM citas WHERE id_factura = ?',
    [r.insertId]
  );
  res.status(201).json(rows[0]);
}

export async function updateFactura(req, res) {
  const id = req.params.id;
  const {id_usuario, id_transaccion, plataforma, codigo_factura, periodo, monto_facturado, monto_pagado} = req.body;

  await connection.execute(
    `UPDATE facturas
       SET id_usuario=?, id_transaccion=?, plataforma=?, codigo_factura=?, periodo=?, monto_facturado=?, monto_pagado=?
     WHERE id_factura=?`,
    [id_usuario, id_transaccion, plataforma, codigo_factura, periodo, monto_facturado, monto_pagado, id]
  );

  const [rows] = await connection.execute(
    'SELECT * FROM facturas WHERE id_factura = ?',
    [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

export async function deleteFactura(req, res) {
  const [r] = await connection.execute(
    'DELETE FROM facturas WHERE id_factura = ?',
    [req.params.id]
  );

  if (r.affectedRows === 0) {
    return res.status(404).json({ error: 'No existe' });
  }

  // Si se borró correctamente:
  return res.sendStatus(204); // "No Content"
}

