// loader.js

document.addEventListener("DOMContentLoaded", () => {
  const msgElement = document.getElementById("loader-mensaje");
  const txtElement = document.getElementById("loader-texto");
  const assetElement = document.getElementById("asset-cargado"); // Capturamos el <small>
  const barra = document.getElementById("barra-progreso");

  // 1. CARGAR MENSAJE ALEATORIO DESDE EL .TXT
  fetch('mensajes.txt')
    .then(response => {
      if (!response.ok) throw new Error();
      return response.text();
    })
    .then(text => {
      const lineas = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lineas.length > 0) {
        const mensajeAleatorio = lineas[Math.floor(Math.random() * lineas.length)];
        msgElement.textContent = mensajeAleatorio;
      }
    })
    .catch(() => {
      msgElement.textContent = ".";
    });

  // 2. CÁLCULO DEL PORCENTAJE REAL DE ASSETS + NOMBRE DE ARCHIVO
  const assets = Array.from(document.querySelectorAll("img, script[src], link[rel='stylesheet'], audio"));
  let cargados = 0;
  const totalAssets = assets.length;

  function actualizarProgreso(elementoElemento) {
    cargados++;
    const porcentaje = totalAssets > 0 ? Math.round((cargados / totalAssets) * 100) : 100;
    
    // Actualizamos porcentaje y barra
    if (barra) barra.style.width = `${porcentaje}%`;
    if (txtElement) txtElement.textContent = `Cargando... ${porcentaje}%`;

    // MÁGIA EXTRA: Extraer solo el nombre del archivo
    if (assetElement && elementoElemento) {
      // Obtenemos la ruta completa (src para imágenes/scripts, href para estilos)
      const rutaCompleta = elementoElemento.src || elementoElemento.href || "";
      
      if (rutaCompleta) {
        // 1. Quitamos parámetros de caché si existen (ej: script.js?v=1.2 -> script.js)
        const rutaLimpia = rutaCompleta.split('?')[0];
        // 2. Rompemos por las barras '/' y nos quedamos con el último elemento
        const nombreArchivo = rutaLimpia.split('/').pop();
        
        // Lo pintamos en el <small>
        assetElement.textContent = nombreArchivo;
      }
    }
  }

  if (totalAssets === 0) {
    if (barra) barra.style.width = "100%";
    if (txtElement) txtElement.textContent = "Cargando... 100%";
    if (assetElement) assetElement.textContent = "Completado";
  } else {
    assets.forEach(asset => {
      if (asset.complete) { 
        // Pasamos el asset actual a la función
        actualizarProgreso(asset);
      } else {
        // Pasamos el asset actual a través del evento
        asset.addEventListener("load", () => actualizarProgreso(asset));
        asset.addEventListener("error", () => actualizarProgreso(asset)); 
      }
    });
  }
});

// 3. RETIRAR PANTALLA CUANDO TODO TERMINE
window.addEventListener("load", () => {
  const loader = document.getElementById("pantalla-carga");
  const txtElement = document.getElementById("loader-texto");
  const assetElement = document.getElementById("asset-cargado");
  const barra = document.getElementById("barra-progreso");

  if (barra) barra.style.width = "100%";
  if (txtElement) txtElement.textContent = "¡Listo!";
  if (assetElement) assetElement.textContent = "Todos los archivos cargados.";

  setTimeout(() => {
    if (loader) {
      loader.classList.add("oculto");
      setTimeout(() => loader.remove(), 600);
    }
  }, 400); 
});