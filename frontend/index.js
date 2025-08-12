// Main script to handle SPA routing and logic.

// Define the routes for the application
const routes = {
  "/": "/citas.html",
  "/citas": "/citas.html",
  "/create/create_cita": "/create/create_cita.html",
};

const DEFAULT_PATH = "/citas";
// Function to handle navigation and load the appropriate content
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

// Handle logout button click
const logoutButton = document.getElementById("logoutButton");

// Event listener of the logout button
logoutButton.addEventListener("click", function () {
  // Clear user data from localStorage and redirect to login page
  localStorage.removeItem("user");
  window.location.href = "/login";
});

function hideLogOut(user) {
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) logoutBtn.style.display = user ? "inline-block" : "none";
}

// Function to navigate to a specific path and load the corresponding content
async function navigate(pathname) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  hideLogOut(user);
  if (!user && pathname !== "/login" && pathname !== "/registro") {
    pathname = "/login";
  }

    if (!routes[pathname]) {
    pathname = DEFAULT_PATH;
  }
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  if (pathname === "/login") {
    import("./js/login.js").then((module) => {
      module.initLogin();
    });
  } else if (pathname === "/" || pathname === "/citas") {
    import("./js/citas.js").then((module) => {
      module.loadCitas();
    });
  } else if (pathname === "/medicos") {
    import("./js/medicos.js").then((module) => {
      module.loadMedicos();
    });
  } else if (pathname === "/pacientes") {
    import("./js/pacientes.js").then((module) => {
      module.loadPacientes();
    });
  } else if (pathname === "/create/create_cita") {
    import("./js/create/create_cita.js");
  } else if (pathname === "/create/create_medico") {
    import("./js/create/create_medico.js");
  } else if (pathname === "/create/create_paciente") {
    import("./js/create/create_paciente.js");
  } else if (pathname === "/registro") {
    import("./js/registro.js");
  } else if (pathname === "/consultas") {
    import("./js/consultas.js");
  }
}

window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});
