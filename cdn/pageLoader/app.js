// loader.js

document.addEventListener("DOMContentLoaded", () => {
  const msgElement = document.getElementById("loader-mensaje");
  const txtElement = document.getElementById("loader-texto");
  const barra = document.getElementById("barra-progreso");
  const loader = document.getElementById("pantalla-carga");

  // 1. CARGAR MENSAJE ALEATORIO DESDE EL .TXT
  // Cambia 'mensajes.txt' por tu ruta real si está en otra carpeta (ej: '/assets/mensajes.txt')
  fetch('cdn/pageLoader/messages.txt')
    .then(response => {
      if (!response.ok) throw new Error();
      return response.text();
    })
    .then(text => {
      // Separamos por líneas y limpiamos espacios vacíos
      const lineas = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lineas.length > 0) {
        const mensajeAleatorio = lineas[Math.floor(Math.random() * lineas.length)];
        msgElement.textContent = mensajeAleatorio;
      }
    })
    .catch(() => {
      msgElement.textContent = "Made by ElmichiYT"; // Mensaje de respaldo si falla el fetch
    });

  // 2. CÁLCULO DEL PORCENTAJE REAL DE ASSETS
  // Buscamos todas las imágenes y scripts en la página
  const assets = Array.from(document.querySelectorAll("img, script[src], link[rel='stylesheet'], audio"));
  let cargados = 0;
  const totalAssets = assets.length;

  function actualizarProgreso() {
    cargados++;
    // Si no hay assets, protegemos de división por cero
    const porcentaje = totalAssets > 0 ? Math.round((cargados / totalAssets) * 100) : 100;
    
    // Actualizamos elementos visuales
    if (barra) barra.style.width = `${porcentaje}%`;
    if (txtElement) txtElement.textContent = `Cargando... ${porcentaje}%`;
  }

  if (totalAssets === 0) {
    // Si la página es puro texto y no hay assets, forzamos el 100%
    if (barra) barra.style.width = "100%";
    if (txtElement) txtElement.textContent = "Cargando... 100%";
  } else {
    // Escuchar la carga de cada asset individual
    assets.forEach(asset => {
      if (asset.complete) { 
        // Si ya estaba en caché del navegador
        actualizarProgreso();
      } else {
        // Si apenas se va a descargar
        asset.addEventListener("load", actualizarProgreso);
        asset.addEventListener("error", actualizarProgreso); // Contar también si falla para no trabar la barra
      }
    });
  }
});

// 3. RETIRAR PANTALLA CUANDO TODO TERMINE
window.addEventListener("load", () => {
  const loader = document.getElementById("pantalla-carga");
  const txtElement = document.getElementById("loader-texto");
  const barra = document.getElementById("barra-progreso");

  // Forzar visualmente el 100% al terminar el evento 'load' general
  if (barra) barra.style.width = "100%";
  if (txtElement) txtElement.textContent = "Terminado.";

  // Esperar un momento breve para que el usuario vea el "100% Terminado" antes de desvanecer
  setTimeout(() => {
    if (loader) {
      loader.classList.add("oculto");
      setTimeout(() => loader.remove(), 600); // Borra del DOM tras la animación CSS
    }
  }, 400); 
});