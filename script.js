
const estados = ["Pendiente", "Aprobado"];
const clases = ["pendiente", "aprobado"];

document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  ramos.forEach(ramo => {
    const id = ramo.id;
    const estadoGuardado = localStorage.getItem(id);
    if (estadoGuardado) {
      const index = estados.indexOf(estadoGuardado);
      if (index >= 0) {
        ramo.classList.remove(...clases);
        ramo.classList.add(clases[index]);
        ramo.querySelector(".estado").textContent = estados[index];
      }
    }
  });
  actualizarDisponibilidad();
});

function cambiarEstado(el) {
  const contenedor = el.parentElement;
  let estadoActual = el.textContent.trim();
  let nuevoEstado = estados[(estados.indexOf(estadoActual) + 1) % estados.length];

  contenedor.classList.remove(...clases);
  contenedor.classList.add(nuevoEstado.toLowerCase());
  el.textContent = nuevoEstado;
  localStorage.setItem(contenedor.id, nuevoEstado);

  actualizarDisponibilidad();
}

function actualizarDisponibilidad() {
  const ramos = document.querySelectorAll(".ramo");
  ramos.forEach(ramo => {
    const prereqsTexto = ramo.getAttribute("data-prerreq");
    if (!prereqsTexto) {
      // Sin prerrequisitos → siempre disponible
      ramo.style.opacity = "1";
      ramo.style.pointerEvents = "auto";
      return;
    }

    const prereqs = prereqsTexto.split(",").map(p =>
      p.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );

    const habilitado = prereqs.every(id => {
      const estado = localStorage.getItem(id);
      return estado === "Aprobado";
    });

    ramo.style.opacity = habilitado ? "1" : "0.4";
    ramo.style.pointerEvents = habilitado ? "auto" : "none";
  });
}
