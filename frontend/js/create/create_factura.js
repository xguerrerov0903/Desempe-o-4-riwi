import { post, get } from "../crud.js";

const url = "http://localhost:3000/facturas";

// Estare a la escucha del boton de submit

document
  .getElementById("newFacturaForm")
  .addEventListener("submit", async function (event) {
    // Evita la recarga de la pagina ya que es SPA
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const factura = Object.fromEntries(formData.entries());

    // Se revisa que el codigo de factura ingresado no se repita
    const todos = await get(url);
    const existe =
      Array.isArray(todos) &&
      todos.some(
        (p) =>
          (p.codigo_factura || "").toLowerCase() === (factura.codigo_factura|| "").toLowerCase()
      );

    if (existe) {
        // De repetirse saltara un alert
      alert(`El codigo "${factura.codigo_factura}" ya está registrado en otra factura.`);
      return;
    }


    // Si no hay interrupciones se creare al nuevo registro de factura
    try {
      await post(url, factura);
      alert("Cita agregada exitosamente");
      this.reset();
    } catch (error) {
      console.error("Error creando la cita:", error);
    }
  });

// No hay revision de que el id de usuario y transaccion sean correctas ya que no contamos con los elementos CRUD de estos, por cuestiones de tiempo se deja asi pero se puede implementar a futuro con mas tiempo