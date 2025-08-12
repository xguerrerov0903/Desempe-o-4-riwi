import { post, get } from "../crud.js";

const url = "http://localhost:3000/facturas";

// Event listener for the new event form submission

document
  .getElementById("newFacturaForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const factura = Object.fromEntries(formData.entries());

    const todos = await get(url);
    const existe =
      Array.isArray(todos) &&
      todos.some(
        (p) =>
          (p.codigo_factura || "").toLowerCase() === (factura.codigo_factura|| "").toLowerCase()
      );

    if (existe) {
      alert(`El codigo "${factura.codigo_factura}" ya está registrado en otra factura.`);
      return;
    }


    // Post the new event data to the server
    try {
      await post(url, factura);
      alert("Cita agregada exitosamente");
      this.reset();
    } catch (error) {
      console.error("Error creando la cita:", error);
    }
  });

