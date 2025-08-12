// Main script to handle SPA routing and logic.

// Define the routes for the application
const routes = {
  "/": "/facturas.html",
  "/facturas": "/facturas.html",
  "/create/create_factura": "/create/create_factura.html",
};

const DEFAULT_PATH = "/facturas";
// Function to handle navigation and load the appropriate content
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});



async function navigate(pathname) {

  if (!routes[pathname]) {
    pathname = DEFAULT_PATH;
  }
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  if (pathname === "/" || pathname === "/facturas") {
    import("./js/facturas.js").then((module) => {
      module.loadFacturas();
    });
  } else if (pathname === "/create/create_factura") {
    import("./js/create/create_factura.js");
    };
}

window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});
