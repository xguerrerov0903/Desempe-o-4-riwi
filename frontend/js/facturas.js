import { get, get_id, deletes, update, post } from "./crud.js";

const url = "http://localhost:3000/facturas";

// Carga inicial
export async function loadFacturas() {
  const citas = await get(url);
  printFacturas(citas);
  setupCitasTableListener();
}

loadFacturas();

// Render de la tabla
function printFacturas(citas) {
  const tbody = document.getElementById("facturasTableBody"); // mismo id que ya tienes
  tbody.innerHTML = citas
    .map(
      (c) => `
      <tr id="${c.id_cita}">
        <td>${c.id_cita}</td>
        <td>${c.id_paciente ?? "-"}</td>
        <td>${c.id_medico ?? "-"}</td>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${c.motivo}</td>
        <td>${c.descripcion ?? "-"}</td>
        <td>${c.ubicacion ?? "-"}</td>
        <td>${c.metodo_pago ?? "-"}</td>
        <td>${c.estatus ?? "-"}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function rePrintCitaView(c, tr) {
  tr.innerHTML = `
    <td>${c.id_cita}</td>
    <td>${c.id_paciente ?? "-"}</td>
    <td>${c.id_medico ?? "-"}</td>
    <td>${c.fecha}</td>
    <td>${c.hora}</td>
    <td>${c.motivo}</td>
    <td>${c.descripcion ?? "-"}</td>
    <td>${c.ubicacion ?? "-"}</td>
    <td>${c.metodo_pago ?? "-"}</td>
    <td>${c.estatus ?? "-"}</td>
    <td>
      <button type="button" value="edit">Editar</button>
      <button type="button" value="delete">Eliminar</button>
    </td>
  `;
}



// Hear the event submit (button) of the form
function setupCitasTableListener() {
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
      editCita(id);
    } else if (action === "save-cita") {
      // Save the edited cita
      const id = tr.id;

      // Mantén el mismo patrón por índices
      const inputs = tr.querySelectorAll("input"); // 0:id_paciente, 1:id_medico, 2:fecha, 3:hora, 4:motivo, 5:descripcion
      const selects = tr.querySelectorAll("select"); // 0:ubicacion, 1:metodo_pago, 2:estatus

      const existingCita = await get_id(url, id);

      const updatedCita = {
        // Usa los datos existentes y actualiza lo editado
        ...existingCita,
        id_paciente: inputs[0].value ? Number(inputs[0].value) : null,
        id_medico: inputs[1].value ? Number(inputs[1].value) : null,
        fecha: inputs[2].value,
        hora: inputs[3].value,
        motivo: inputs[4].value,
        descripcion: inputs[5].value || null,
        ubicacion: selects[0] ? selects[0].value : existingCita.ubicacion,
        metodo_pago: selects[1] ? selects[1].value : existingCita.metodo_pago,
        estatus: selects[2] ? selects[2].value : existingCita.estatus,
      };

      // Update cita in DB
      await update(url, id, updatedCita);
      rePrintCitaView(updatedCita, tr);
    } else {
      // This case es cancel so dont edit the event
      const original = await get_id(url, id);
      rePrintCitaView(original, tr);
    }
  });
  // If the user is not an admin, listen for enroll actions
}

// Function to edit an event
// This function replaces the event row with input fields for editing
async function editCita(id) {
  const citaContainer = document.getElementById(id);
  const cita = await get_id(url, id);
  const fechaSolo = cita.fecha ? cita.fecha.slice(0, 10) : "";
  const horaSolo = cita.hora ? cita.hora.slice(0, 5) : "";
  citaContainer.innerHTML = `
        <td>${cita.id_cita}</td>
    <td><input type="number" value="${cita.id_paciente ?? ""}" /></td>
    <td><input type="number" value="${cita.id_medico ?? ""}" /></td>
    <td><input type="date" value="${fechaSolo}" /></td>
    <td><input type="time" value="${horaSolo}" /></td>
    <td><input type="text" value="${cita.motivo}" /></td>
    <td><input type="text" value="${cita.descripcion ?? ""}" /></td>
    <td>
      <select data-field="ubicacion">
        ${selectOpt("Sede Norte", cita.ubicacion)}
        ${selectOpt("Sede Centro", cita.ubicacion)}
        ${selectOpt("Sede Sur", cita.ubicacion)}
      </select>
    </td>
    <td>
      <select data-field="metodo_pago">
        ${selectOpt("Efectivo", cita.metodo_pago)}
        ${selectOpt("Transferencia", cita.metodo_pago)}
        ${selectOpt("Tarjeta Crédito", cita.metodo_pago)}
        ${selectOpt("Tarjeta Débito", cita.metodo_pago)}
      </select>
    </td>
    <td>
      <select data-field="estatus">
        ${selectOpt("Cancelada", cita.estatus)}
        ${selectOpt("Confirmada", cita.estatus)}
        ${selectOpt("Reprogramada", cita.estatus)}
        ${selectOpt("Pendiente", cita.estatus)}
      </select>
    </td>
    <td>
      <button type="button" value="save-cita">Guardar</button>
      <button type="button" value="cancel-edit">Cancelar</button>
    </td>
    `;
}

function selectOpt(val, current) {
  const sel = val === current ? " selected" : "";
  return `<option value="${val}"${sel}>${val}</option>`;
}
