import { get, get_id, deletes, update, post } from "./crud.js";

const url = "http://localhost:3000/facturas";

// Carga inicial
export async function loadFacturas() {
  const facturas = await get(url);
  printFacturas(facturas);
  setupfacturasTableListener();
}

loadFacturas();

// Render de la tabla
function printFacturas(facturas) {
  const tbody = document.getElementById("facturasTableBody"); // mismo id que ya tienes
  tbody.innerHTML = facturas
    .map(
      (c) => `
      <tr id="${c.id_factura}">
        <td>${c.id_factura}</td>
        <td>${c.codigo_factura}</td>
        <td>${c.plataforma}</td>
        <td>${c.periodo}</td>
        <td>${c.monto_facturado}</td>
        <td>${c.monto_pagado}</td>
        <td>${c.id_usuario}</td>
        <td>${c.id_transaccion}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");
}

// Reimprime la fila 
function rePrintfacturaView(c, tr) {
  tr.innerHTML = `
    <tr id="${c.id_factura}">
        <td>${c.id_factura}</td>
        <td>${c.codigo_factura}</td>
        <td>${c.plataforma}</td>
        <td>${c.periodo}</td>
        <td>${c.monto_facturado}</td>
        <td>${c.monto_pagado}</td>
        <td>${c.id_usuario}</td>
        <td>${c.id_transaccion}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      </tr>
  `;
}

// Escucha cualquiera de los botones de acciones
function setupfacturasTableListener() {
  const tbody = document.getElementById("facturasTableBody");

  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    // Revisa que el click corresponda a un boton
    if (event.target.tagName !== "BUTTON") return;
    // Se agarra el id de la fila el cual fua asignado cuando se renderizo
    const tr = event.target.closest("tr");
    const id = tr.id;
    const action = event.target.value;
    // Revisa si hacemos un delet y ejecuta de ser asi a la fila correspondiente
    if (action === "delete") {
      await deletes(url, id);
      tr.remove();
      // Si es un edit se va a su propia funcion que se encarga de renderizar la edicion
    } else if (action === "edit") {
      editFactura(id);
      // Cuando se lea el save se realiza su update(patch) con los inputs leidos
    } else if (action === "save-factura") {
      const id = tr.id;

      const inputs = tr.querySelectorAll("input");
      const selects = tr.querySelectorAll("select");

      const existingfactura = await get_id(url, id);

      const updatedfactura = {
        // Usa los datos existentes y actualiza lo editado
        ...existingfactura,
        plataforma: selects[0] ? selects[0].value : existingfactura.plataforma,
        periodo: inputs[0].value,
        monto_facturado: inputs[1].value,
        monto_pagado: inputs[2].value,
        id_usuario: inputs[3].value,
        id_transaccion: inputs[4].value,
      };

      await update(url, id, updatedfactura);
      rePrintfacturaView(updatedfactura, tr);
    } else {
      // Por default seria cancelar y no se hace nada solo reimprimir la fila original
      const original = await get_id(url, id);
      rePrintfacturaView(original, tr);
    }
  });
}
// Se imprime una version de la fila con inputs para su edicion
async function editFactura(id) {
  const facturaContainer = document.getElementById(id);
  const factura = await get_id(url, id);
  facturaContainer.innerHTML = `
<td>${factura.id_factura}</td>
        <td>${factura.codigo_factura}</td>
    <td>
      <select data-field="plataforma">
        ${selectOpt("Daviplata", factura.plataforma)}
        ${selectOpt("Nequi", factura.plataforma)}
      </select>
    </td>
    <td><input type="text" required value="${factura.periodo}" /></td>
    <td><input type="number" value="${factura.monto_facturado}" /></td>
    <td><input type="number" value="${factura.monto_pagado}" /></td>
    <td><input type="number" value="${factura.id_usuario}" /></td>
    <td><input type="number" value="${factura.id_transaccion}" /></td>
    <td>
      <button type="button" value="save-factura">Guardar</button>
      <button type="button" value="cancel-edit">Cancelar</button>
    </td>
    `;
}

// Una funcion helper que leera la elecion de inputs option
function selectOpt(val, current) {
  const sel = val === current ? " selected" : "";
  return `<option value="${val}"${sel}>${val}</option>`;
}
