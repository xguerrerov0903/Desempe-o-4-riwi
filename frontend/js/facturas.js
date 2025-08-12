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



// Hear the event submit (button) of the form
function setupfacturasTableListener() {
  const tbody = document.getElementById("facturasTableBody");

  // Avoid multiple listeners: clone the node and replace it (removes listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    // Check if the clicked element is a button
    if (event.target.tagName !== "BUTTON") return;
    const tr = event.target.closest("tr");
    const id = tr.id;
    const action = event.target.value;
    // Check if the action is delete
    if (action === "delete") {
      await deletes(url, id);
      tr.remove();
    } else if (action === "edit") {
      editFactura(id);
    } else if (action === "save-factura") {
      const id = tr.id;

      const inputs = tr.querySelectorAll("input"); 
      const selects = tr.querySelectorAll("select"); 

      const existingfactura = await get_id(url, id);

      const updatedfactura = {
        // Usa los datos existentes y actualiza lo editado
        ...existingfactura,

        codigo_factura: inputs[0].value,
        plataforma: selects[0] ? selects[0].value : existingfactura.plataforma,
        periodo: inputs[1].value,
        monto_facturado: inputs[2].value,
        monto_pagado: inputs[3].value,
        id_usuario: inputs[4].value,
        id_transaccion: inputs[5].value,
     };

      // Update factura in DB
      await update(url, id, updatedfactura);
      rePrintfacturaView(updatedfactura, tr);
    } else {
      // This case es cancel so dont edit the event
      const original = await get_id(url, id);
      rePrintfacturaView(original, tr);
    }
  });

}


async function editFactura(id) {
  const facturaContainer = document.getElementById(id);
  const factura = await get_id(url, id);
  facturaContainer.innerHTML = `
        <td>${factura.id_factura}</td>
    <td><input type="text" maxlength="7" minlength="7" required value="${factura.codigo_factura}" /></td>
    <td>
      <select data-field="plataforma">
        ${selectOpt("Daviplata", factura.plataforma)}
        ${selectOpt("Nequi", factura.plataforma)}
      </select>
    </td>
    <td><input type="text" value="${factura.periodo}" /></td>
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

function selectOpt(val, current) {
  const sel = val === current ? " selected" : "";
  return `<option value="${val}"${sel}>${val}</option>`;
}
