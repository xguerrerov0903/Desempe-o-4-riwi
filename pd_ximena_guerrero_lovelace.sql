CREATE DATABASE pd_ximena_guerrero_lovelace;

USE pd_ximena_guerrero_lovelace;

CREATE TABLE usuarios(
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    identificacion INT NOT NULL,
    telefono VARCHAR (30),
    email VARCHAR (100) UNIQUE NOT NULL,
    direccion VARCHAR (200),
    nombre VARCHAR (150) NOT NULL
);

CREATE TABLE transacciones (
	id_transaccion INT PRIMARY KEY AUTO_INCREMENT,
    codigo_transaccion VARCHAR (6) UNIQUE NOT NULL,
    tipo ENUM ('Pago de Factura'),
    estado ENUM ('Pendiente','Fallida','Completada') NOT NULL,
    cantidad INT NOT NULL,
    fecha DATETIME,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE TABLE facturas (
	id_factura INT PRIMARY KEY AUTO_INCREMENT,
    codigo_factura VARCHAR (7) UNIQUE NOT NULL,
    plataforma ENUM ('Daviplata','Nequi') NOT NULL,
    periodo VARCHAR(50),
    monto_facturado INT NOT NULL,
    monto_pagado INT NOT NULL,
    id_usuario INT,
    id_transaccion INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_transaccion) REFERENCES transacciones(id_transaccion) ON DELETE SET NULL
);

SELECT u.nombre, SUM(f.monto_pagado)
FROM usuarios u
JOIN facturas f ON u.id_usuario = f.id_usuario
GROUP BY u.id_usuario;

SELECT f.codigo_factura, 
monto_facturado-monto_pagado as Monto_pendiente
FROM facturas f
WHERE monto_facturado-monto_pagado > 0
ORDER BY monto_facturado-monto_pagado;

SELECT t.codigo_transaccion, f.plataforma, u.nombre, f.codigo_factura
FROM facturas f
JOIN transacciones t ON f.id_transaccion = t.id_transaccion
JOIN usuarios u ON u.id_usuario = f.id_usuario
